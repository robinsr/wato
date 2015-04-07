var fs = require('fs')
	, async = require('async')
	, path = require('path')
	, util = require('util')
	, config = require(__dirname + '/../config')
	, mongoose = require('mongoose');

var Article = mongoose.model('Article');
var User = mongoose.model('User');


/**
 * getMenuFileList
 *
 * extends req, req.watoData: {
 * 		login: true,
 * 		article_editor: true,
 * 		files: <Array of articles>,
 * 		css: <Array of css file paths>,
 * 		categories: <Array of category strings>,
 * 		views: <Array of view file paths>
 * 	}
 */
exports.getMenuFileList = function(req, res, next){

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

		req.watoData = return_obj;
		
		next(null);
	});
}