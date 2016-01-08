var fs = require('fs')
var path = require('path')
var each = require('async').each


exports.get = getSpecials;

function getSpecials(options,callback){

	if(arguments.length === 1 && typeof arguments[0] === 'function'){
		callback = options;
	}

	options = options || {}
	options.templateDir = options.templateDir || './templates'
	options.specials = options.specials || {specials:'specials',charts:'charts', fundraising:'fundraising'}
	options.ext = options.ext || '.swig'

	var output = {}

	each(Object.keys(options.specials),read,function(err){
		if(err) throw err;

		if(callback && typeof callback === 'function'){
			callback(output)
		}
	})

	function read(specialType,cb){
		var dir = path.join(process.cwd(),options.templateDir,specialType);
		fs.readdir(dir,function(err,filenames){
			if (err) throw err;
			output[specialType] = {};
			filenames.forEach(function(special){
				output[specialType][path.basename(special,options.ext)] = path.join(dir,special)
			})
			cb();
		});
	}



}

