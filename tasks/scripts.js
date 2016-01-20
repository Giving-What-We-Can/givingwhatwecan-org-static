console.log('Building Javascript files')

var fs = require('fs')
var path = require('path')
var cp = require('ncp').ncp;
var rm = require('rimraf')
var recursive = require('recursive-readdir')

var browserify = require('browserify')
var uglify = require('uglify-js')

var each = require('async').each
var minimatch = require('minimatch')

var srcPath = path.join(__dirname,'..','src','scripts');
var destPath = path.join(__dirname,'..','src','metalsmith','scripts')
var builtPath = path.join(__dirname,'..','dest')

// clear directory out
console.log('Clearing directory...')
rm(destPath, function(err){
	if(err) throw err;
	fs.mkdir(destPath,function(err){
		if(err) throw err;
		// do a straight copy of 'includes' directory
		console.log('Copying `includes` directory...')
		cp(path.join(srcPath,'includes'),path.join(destPath,'includes'),function(err){
			if(err) throw err;
			console.log('Copied')
			// browserify all `bundles` files
			fs.readdir(srcPath,function(err,files){
				console.log('Bundling files with browserify...')
				each(files.filter(minimatch.filter('*.bundle.js')),bundle,function(err){
					if(err) throw err;
					console.log('All files bundled')
					// create minified versions of all files
					recursive(destPath,function(err,files){
						if(err) throw err;
						console.log('Minifying files...')
						each(files.filter(minimatch.filter("**/*.js")),minify,function(err){
							if(err) throw err;
							console.log('All files minified')
							// copy to the 'dest' directory if needed
							if(process.env.ENV !== 'production'){
								fs.readdir(builtPath,function(err){
									if(err) {
										return;
									}
									cp(destPath,path.join(builtPath,'scripts'),function(){
										console.log('Updated /dest directory with latest scripts...')
									})
								})
							}
						})

					})

				})
			})
			
		})
	})
})






function bundle(file, cb){
	console.log('Bundling',file)
    // the output filename of our bundle
    var outFile = file.replace('.bundle','');
    // the output filename of our sourcemap
    var mapFile = file.replace('.bundle.js','.js.map');
    // get an absolute path to the file
    var entryFile  = path.join(srcPath,file);
    // turn minification on or off
    var minify =  true// ENVIRONMENT ==='production' ? true : false;
    // start browserify
    var b = new browserify({debug:true});
    // add the entry file to the queue
    b.add(entryFile)
    // add minifier / sourcemap generator
    b.plugin('minifyify', {map: '/'+mapFile, minify:minify}); 
    // call the main bundle function
    b.bundle(function(err, src, map){
        if(err) throw err;
        fs.writeFile(path.join(destPath,outFile),src,function(err){
	        if(err) throw err;
	        console.log('+ Wrote',outFile)
	        fs.writeFile(path.join(destPath,mapFile),map,function(err){
		        if(err) throw err;
		        console.log('+ Wrote',mapFile)
		        cb();
	        })
        })
    })
}

function minify(file, cb){
	console.log('Minifying',path.basename(file))
	var outFile = file.replace('.js','.min.js')
	var mapFile = file.replace('.js','.min.js.map')
	
	var minified = uglify.minify(file,{
			outSourceMap: path.basename(mapFile)
		});
	fs.writeFile(outFile,minified.code,function(err){
		if(err) throw err;
		console.log('+ Wrote',path.basename(outFile))
		fs.writeFile(mapFile,minified.map,function(err){
			if(err) throw err;
			console.log('+ Wrote',path.basename(outFile))
			cb()
		})
	})

}