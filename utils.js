var databaseUrl = "wato",
	collections = ["articles","users"],
	db = require("mongojs").connect(databaseUrl, collections),
	async = require('async');

exports.getMenuFileList = function(next){
	var files = [];
	async.parallel([
	function(cb){
		db.articles.find({destination:'articles'}).limit(10,function(err,result){
			if (err) {
				cb('error')
			} else {
				result.forEach(function(file){files.push(file)})
				cb(null)
			}
		})
	},
	function(cb){
		db.articles.find({destination:'drafts'}).limit(10,function(err,result){
			if (err) {
				cb('error')
			} else {
				result.forEach(function(file){files.push(file)})
				cb(null)
			}
		})
	}
	],
	function(err){
		if (err) {
			next('error',null)
		} else {
			next(null, files);
		}
	})
}