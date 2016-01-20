#!/usr/bin/env node

// async requests
var request = require('request-promise')
var PromiseQueue = require('bluebird-queue')
var PromiseRetry = require('promise-retry')
var ProgressBar = require('progress')

// request processing
var cheerio = require('cheerio')
var entities = require('html-entities').Html5Entities

exports.get = getStats;

function getStats(callback){
	// vars
	var statURL = "https://www.givingwhatwecan.org/statsjson?stat=%s%"

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

	// create a queue
	var queue = new PromiseQueue({
		concurrency: 10
	})
	// create a progress bar
	var bar = new ProgressBar('[:bar] :percent :current/:total :etas :message', {total: stats.length})
	stats.forEach(function(stat){
		queue.add(function(){
			// retry factor spreads retries out over 3 minutes
			return PromiseRetry({retries:20,factor:1.197},function(retry,attempt){
				return request(statURL.replace('%s%',stat))
				.then(function(body){
					if(!body || body.length === 0){
						bar.tick(0,{message: stat+' returned falsy value'})
						retry();
						return false;
					}
					// convert response from a JSON string to an actual javascript object
					var responseData = JSON.parse(body.trim())
					// strip extraneous formatting from numeric responses
					if(['numberofmembers','amountpledged','amountdonatedsofar'].indexOf(stat)>-1){
						responseData = parseNumber(responseData);
					}
					// remove HTML tags from member list
					if(stat === 'listofmembers'){
						responseData = parseMemberList(responseData)
					}
					bar.tick({message:'Got '+ stat})
					return [keys[stat],responseData];
				})
				.catch(function(err){
					bar.tick(0,{message:stat+ ' returned an error'})
					retry();
				})
			})
		})
	})
	queue.start()
	.then(function(results){
		var output = {}
		results.forEach(function(result){
			output[result[0]] = result[1];
		})
		callback(output)
	})
	.catch(function(err){
		console.log('Could not retrieve all stats:')
		throw err
	})
}



function parseNumber(number){
	if(typeof number !== 'string'){
		throw new Error ([number + ' has type ' + (typeof number) + '. Expected a string.'])
	}
	return parseInt (number.replace(/[^\d.-]/g,''));
}

function parseMemberList(memberList){
	var members = [];
	var $ = cheerio.load(memberList);
	var re = /<td>(.*?)<\/td>/g
	$('tr').each(function(){
		var member = []
		while ( (d = re.exec($(this).html())) !== null) {
			member.push( entities.decode(d[1].trim()) );
		}
		if(member[0] && member[0].length>0){
			members.push(member)
		}
	})
	return members;
}