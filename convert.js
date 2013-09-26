var databaseUrl = "wato",
	collections = ["articles"],
	db = require("mongojs").connect(databaseUrl, collections),
	u = require("underscore"),
	objectid = require('mongodb').ObjectID,
	moment = require('moment'),
	async = require('async');


	(function(){
		console.log('starting')
		db.articles.find({},function(err,result){
			async.eachSeries(result,function(_result,cb){
				var concat = '';
				console.log('working on '+_result.title)
				async.eachSeries(_result.content,function(cont,next){
					concat += "\n" + cont.text;
					next();
				},function(err){
					db.articles.update({url: _result.url}, {$set: {content:concat}},function(err){
						cb(err);
					})
				})
			},function(err){
				if (err) console.log('there were errors')
				console.log('all done')
				process.exit()
			})
		})
	})()