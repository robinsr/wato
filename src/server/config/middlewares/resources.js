var fs = require('fs')
	, async = require('async')
	, path = require('path')
	, extend = require('util')._extend
	, config = require(__dirname + '/../config')
	, mongoose = require('mongoose');

var Article = mongoose.model('Article');
var User = mongoose.model('User');


/**
 * getMenuFileList
 *
 * extends req, req.watoData: {
 * 		articles: <Array of articles>,
 * 		drafts: <Array of drafts>,
 * 		css: <Array of css file paths>,
 * 		category: <Array of category strings>,
 * 		views: <Array of view file paths>
 * 	}
 */
exports.getMenuFileList = function(req, res, next){

	async.parallel({
		articles: function (done) {
			Article.list({ criteria: {destination:'articles'}, select:'title url', perPage: 10} , done);
		},
		drafts: function (done) {
			Article.list({ criteria: {destination:'drafts'}, select:'title url', perPage: 10} , done);
		},
		css: function (done) {
			var dir = config.appRoot + '/client/stylesheets';
			fs.readdir(dir, function (err, files){
				if (err) return done(err);
			
				return done(null, files.map(function (fileName) {
					return fileName.toString();
				}));
			});
		},
		category: function (done) {
			Article.getCategories(done);
		},
		views: function (done) {
			var dir = res.locals.viewsPath;
			fs.readdir(dir, function (err, files) {
				if (err) return done(err);

				return done(null, files.map(function (fileName) {
					return path.basename(fileName);
				}));
			});
		}
	}, function (err, result) {
		if (err) {
			return next(err)
		}

		req.watoData = result;
		
		next();
	});
}