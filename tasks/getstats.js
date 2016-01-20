var getStats = require('../lib/get-stats')

var fs = require('fs')
var path = require('path')

var destPath = path.join(__dirname,'..','src','metalsmith','settings')

console.log('Getting Stats')
getStats.get(function(stats){
	fs.writeFile(path.join(destPath,'stats.json'),JSON.stringify(stats),function(err){
		if (err) throw err;
		console.log('Stats saved to settings/stats.json')
	})
})