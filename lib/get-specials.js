var fs = require('fs')
var path = require('path')


module.exports = plugin;

function plugin(options){
	options = options || {}
	options.directory = options.directory || './templates/specials'
	options.ext = options.ext || '.swig'

	return function (files,metalsmith,done){
		var specialsDir = path.join(process.cwd(),options.directory)
		fs.readdir(specialsDir,function(err,specials){
			if (err) throw err

			var meta = metalsmith.metadata();
			meta.specials = {};

			specials.forEach(function(special){
				meta.specials[path.basename(special,options.ext)] = path.join(specialsDir,special)
			})
			done();
			
		})


	}



}

