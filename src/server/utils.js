var fs = require('fs')
	, async = require('async')
	, path = require('path')
	, util = require('util')
	, config = require(__dirname + '/config/config')
	, mongoose = require('mongoose');

var Article = mongoose.model('Article');
var User = mongoose.model('User');

exports.getMenuFileList = function(next){
	var return_obj = {
		login: true,
		article_editor: true,
		files: []
	};

	async.parallel([
		function(cb){
			Article.list({ criteria: {destination:'Article'}, perPage: 10} ,function (err, result) {
				if (err) return cb(err);

				result.forEach(function(file){return_obj.files.push(file)})
				return cb(null);
			});
		},

		function(cb){
			Article.list({ criteria: {destination:'drafts'}, perPage: 10} ,function (err, result) {
				if (err) return cb(err);

				result.forEach(function(file){return_obj.files.push(file)});
				return cb(null);
			});
		},

		function(cb){
			var dir = config.appRoot + '/client/stylesheets';
			fs.readdir(dir, function (err, result){
				if (err) return cb(err);
			
				return_obj.css = result.map(function (_css){
					return "\"" + _css + "\"";
				}).join(",");

				return cb(null);
			})
		},

		function(cb){
			Article.getCategories(function (err, result) {
				if (err) return cb(err);

				return_obj.category = result.filter(function (_category) {
					return _category.length != 0
				}).map(function(_category){
					return "\"" + _category + "\"";
				}).join(",");
				
				return cb(null);
			});
		},

		function (cb) {
			var dir = config.appRoot + '/server/views/';
			fs.readdir(dir, function (err, result) {
				if (err) return cb(err);

				return_obj.views = result.map(function (_view) {
					return path.basename(_view);
				});
				
				return cb(null);
			});
		}
	],

	function (err) {
		if (err) {
			return next(err)
		}
		
		next(null, return_obj);
	});
}


exports.getAllFiles = function(next) {
	var return_obj = {
		file: []
	};

	Article.list({}, function (err, articles) {
		if (err) return next(err);

		async.eachSeries(articles, function (article, _cb) {
			if (article.lastEdit){
				console.log("last edit "+article.lastEdit)
				User.load({ criteria: { user_id: parseInt(article.lastEdit) }}, function (err, _result) {

					if (err) return _cb(err);

					if (!_result){
						article.lastEditName = "-";
					} else {
						article.lastEditName = _result.name;
					}

					return_obj.files.push(article);
					
					_cb(null);
				})
			} else {
				article.lastEditName = "-";
				return_obj.files.push(article);
				_cb(null)
			}
		},function(err){
			if (err) {
				return next(err)
			}

			next(null, return_obj);
		});
	});
}