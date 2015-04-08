var async = require('async')
	, moment = require('moment')
	, fs = require('fs')
	, mongoose = require('mongoose')
	, User = mongoose.model('User')
  , Article = mongoose.model('Article')
  , extend = require('util')._extend;

// GET /edit - shows login page
exports.login = function(req, res, next) {
	User.count({ permissions: 3 }, function (err, count) {
		if (err) {
			return next(err);
		}

		if (!count) {
			return res.render('auth/welcome');
		}

    if (req.isAuthenticated()) {
      return res.redirect('/edit/article');
    }

    return res.render('auth/index');
	});
}

// GET /edit/article - shows article edit page
exports.article = function (req, res, next) {
  return res.render('auth/article', extend({
    today: moment().utc().format("YYYY-MM-DD")
  }, req.watoData));
}

// GET /edit/all - shows all article page
exports.all = function (req, res, next) {
  Article.list(function (err, articles) {
    if (err) {
      return next(err);
    }

    return res.render('auth/all', {
      files: articles,
      login: true,
      article_editor: true
    });
  });
}

/**
 * POST /edit/createRoot
 * create a user bypassing auth middleware if no users exist
 */
exports.createRoot = function (req, res, next) {

	var options = { 
		criteria: { 
			permissions: 3
		} 
	};

	User.find(options, function (err, users) {
		if (err) {
			return next(err);
		}

		if (users.length) {
			return next(new Error("Cannot create a root account if one already exists"));
		}

		User.create(req.body, function (err, result) {
			if (err) {
				return next(err);
			}

			req.session.user_id = result.user_id;
			req.session.permissions = result.permissions;
			return res.redirect('/edit/article');
		});
	});
}

exports.notAvailable = function (req, res) {
	return res.render('auth/notavailable', {login: true});
}
