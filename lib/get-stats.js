var request = require('request')
var cheerio = require('cheerio')
var each = require('async').each
var fs = require('fs')
var path = require('path')
var entities = require('html-entities').Html5Entities


module.exports = plugin;

function plugin(options, callback){
	if(arguments.length === 1 && typeof arguments[0] === 'function'){
		callback = options;
		options = false;
	}

	options = options || {}
	options.cache = options.cache || true
	options.forceCache = options.forceCache || false

	var stats = [
		'numberofmembers',
		'amountpledged',
		'amountpledgedwords',
		'amountdonatedsofar',
		'igivechart',
		'igivechartwithoutother',
		'citieschart',
		'chaptermap',
	 	'listofmembers'
	];

	keys = {
		'numberofmembers':       	'numberMembers',
		'amountpledged':         	'amountPledged',
		'amountpledgedwords':    	'amountPledgedWords',
		'amountdonatedsofar':    	'amountDonated',
		'igivechart':  		     	'donationsByCharity',
		'igivechartwithoutother': 	'donationsByCharityWithoutOther' ,
		'citieschart': 				'memberCities',
		'chaptermap': 				'chapterCities',
	 	'listofmembers': 			'memberList'
	}
	var output = {}

	var cacheFilePath = path.join(process.cwd(),'.cache')
	var cacheFile = path.join(cacheFilePath,'stats.json')

	var cachedStats;
	try {
		cachedStats = JSON.parse(fs.readFileSync(cacheFile).toString().trim())
	} catch (e) {
		if (e.code === 'ENOENT') {
			cachedStats = false;
		} else {
		  throw e;
		}
	}

	getStats(callback)

	function getStats(callback){
		if(cachedStats && options.forceCache){
			output = cachedStats
			if(callback && typeof callback === 'function'){
				callback(output)
			}
		} else {
			each(stats,getStat,function(){
				// save the stats
				if(options.cache) {
					try {
						fs.mkdirSync(cacheFilePath)
					} catch (e) {
						if(e.code !== 'EEXIST'){
							throw e
						}
					}
					fs.writeFileSync(cacheFile,JSON.stringify(output) )
				}
				if(callback && typeof callback === 'function'){
					callback(output)
				}
			})
		}
	}


	function getStat(stat,callback){

		var responseData = '';

		request
		.get('https://www.givingwhatwecan.org/statsjson?stat='+stat, function(error,response,body){
			if(error){
				console.log('Warning, request error - using cached stat for',stat)
				console.log(error)
				output[keys[stat]] = cachedStats[keys[stat]]
				callback()
			} else if(response.statusCode !== 200){
				console.log('Warning, server returned status code',response.statusCode,'- using cached stat for',stat)
				output[keys[stat]] = cachedStats[keys[stat]]
				callback()
			} else {
				// convert response from a JSON string to an actual javascript object
				var responseData = JSON.parse(body.trim())
				
				if(!responseData){
					console.log('Warning, server returned a falsy value for',stat,'- using cached value')
					output[keys[stat]] = cachedStats[keys[stat]]
					callback();
					return
				}
				// strip extraneous formatting from numeric responses
				if(['numberofmembers','amountpledged','amountdonatedsofar',].indexOf(stat)>-1){
					responseData = parseNumber(responseData);
				}
				// remove HTML tags from member list
				if(stat === 'listofmembers'){
					var members = [];
					var $ = cheerio.load(responseData);
					var re = /<td>(.*?)<\/td>/g
					$('tr').each(function(){
						var member = []
						while ( (d = re.exec($(this).html())) !== null) {
							member.push( entities.decode(d[1].trim()) );
						}
						members.push(member)
					})
					responseData = members;
				}

				output[keys[stat]] = responseData;
				callback();

			}
		})

	}


	function parseNumber(number){
		if(typeof number !== 'string'){
			throw new Error ([number + ' has type ' + (typeof number) + '. Expected a string.'])
		}
		return parseInt (number.replace(/[^\d.-]/g,''));
	}

}

