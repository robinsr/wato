var databaseUrl = "wato",
	collections = ["articles","users"],
	db = require("mongojs").connect(databaseUrl, collections),
	fs = require('fs'),
	async = require('async'),
	path = require('path');

exports.getMenuFileList = function(next){
	var return_obj = {
		login: true,
		article_editor: true,
		files: []
	}
	async.parallel([
	function(cb){
		db.articles.find({destination:'articles'}).sort({publishDate: -1}).limit(10,function(err,result){
			if (err) {
				cb('error')
			} else {
				result.forEach(function(file){return_obj.files.push(file)})
				cb(null)
			}
		})
	},
	function(cb){
		db.articles.find({destination:'drafts'}).sort({publishDate: -1}).limit(10,function(err,result){
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
	},
	function(cb){
		db.articles.distinct("category",function(err,result){
			if (err) cb('err')
			return_obj.category = result.filter(function(_category){
				return _category.length != 0
			}).map(function(_category){
				return "\"" + _category + "\"";
			}).join(",");
			cb(null)
		})
	},
	function(cb){
		fs.readdir('./views/',function(err,result){
			return_obj.views = result.map(function(_view){
				return path.basename(_view);
			});
		cb(null);
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
exports.getAllFiles = function(next){
	var return_obj = {};
	return_obj.files = [];
	db.articles.find().sort({publishDate: -1},function(err,result){
		if (err) {
			cb('error')
		} else {
			async.eachSeries(result,function(file,_cb){
				if (file.lastEdit){
					console.log("last edit "+file.lastEdit)
					db.users.findOne({user_id: parseInt(file.lastEdit)},function(err,_result){
						if (err || !_result){
							file.lastEditName = "-";
						} else {
							file.lastEditName = _result.name;
						}
						return_obj.files.push(file);
						_cb(null)
					})
				} else {
					file.lastEditName = "-";
					return_obj.files.push(file);
					_cb(null)
				}
			},function(err){
				if (err) {
					next('error',null)
				} else {
					next(null, return_obj);
				}
			})
		}
	})
}