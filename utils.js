var databaseUrl = "wato",
	collections = ["articles","users"],
	db = require("mongojs").connect(databaseUrl, collections),
	fs = require('fs'),
	async = require('async');

exports.getMenuFileList = function(next){
	var return_obj = {};
	return_obj.files = [];
	async.parallel([
	function(cb){
		db.articles.find({destination:'articles'}).limit(10,function(err,result){
			if (err) {
				cb('error')
			} else {
				result.forEach(function(file){return_obj.files.push(file)})
				cb(null)
			}
		})
	},
	function(cb){
		db.articles.find({destination:'drafts'}).limit(10,function(err,result){
			if (err) {
				cb('error')
			} else {
				result.forEach(function(file){return_obj.files.push(file)})
				cb(null)
			}
		})
	},
	function(cb){
		fs.readdir('public/stylesheets',function(err, result){
			if (err) {
				cb('error')
			} else {
				return_obj.css = result.map(function(_css){
					return "\"" + _css + "\"";
				}).join(",");
				cb(null)
			}
		})
	},
	function(cb){
		fs.readdir('views/',function(err, result){
			if (err) {
				cb('error')
			} else {
				return_obj.templates = result.map(function(_template){
					return "\"" + _template + "\"";
				}).join(",");
				cb(null)
			}
		})
	}
	],
	function(err){
		if (err) {
			next('error',null)
		} else {
			next(null, return_obj);
		}
	})
}