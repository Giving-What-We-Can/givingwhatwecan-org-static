console.log('Building Stylesheets')

var fs = require('fs')
var path = require('path')
var cp = require('ncp')

var sass = require('node-sass')
var cleanCSS = require('clean-css')

var each = require('async').each

var srcFile = path.join(__dirname,'..','src','styles','styles.scss');
var destPath = path.join(__dirname,'..','src','metalsmith','styles')
var builtPath = path.join(__dirname,'..','dest')

sass.render({
  file: srcFile,
  outFile: 'app.css',
  sourceMap: 'app.css.map'

}, function(err, result) {
	if(err) throw err
	console.log('Processed SCSS files')
	var files = {
		"app.css" : result.css,
		"app.css.map" : result.map
	}

	cleaned = new cleanCSS({
		sourceMap: result.map.toString(),
		debug:true
	}).minify(result.css);
	files["app.min.css"] = cleaned.styles.toString() + '\n/*# sourceMappingURL=app.min.css.map */';
	files["app.min.css.map"] = cleaned.sourceMap;
	console.log('Minified CSS file')
	console.log('Original vs Minified:',(cleaned.stats.originalSize/1000) + 'kb','/',(cleaned.stats.minifiedSize/1000) + 'kb','('+(cleaned.stats.efficiency*100).toFixed(2)+'% reduction)')
	

	each(Object.keys(files),function(file,cb){
		fs.writeFile(path.join(destPath,file),files[file],function(err){
			console.log('+ Wrote file',file)
			cb(err);
		})
	},
	function(err){
		if(err) console.log(err)
		console.log('All files written!')
		if(process.env.ENV !== 'production'){
			fs.readdir(builtPath,function(err){
				if(err) {
					return;
				}
				cp(destPath,path.join(builtPath,'styles'),function(){
					console.log('Updated /dest directory with latest styles...')
				})
			})
		}

	})
});