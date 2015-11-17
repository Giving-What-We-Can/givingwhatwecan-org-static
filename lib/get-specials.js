var fs = require('fs')
var path = require('path')


module.exports = getSpecials;

function getSpecials(options,callback){

	if(arguments.length === 1 && typeof arguments[0] === 'function'){
		callback = options;
	}

	options = options || {}
	options.directory = options.directory || './templates/specials'
	options.ext = options.ext || '.swig'

	var specialsDir = path.join(process.cwd(),options.directory)
	var specials = {}
	fs.readdir(specialsDir,function(err,filenames){
		if (err) throw err
		filenames.forEach(function(special){
			specials[path.basename(special,options.ext)] = path.join(specialsDir,special)
		})
		if(callback && typeof callback === 'function'){
			callback(specials)
		}

	})
}

