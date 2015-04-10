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
  return res.render('auth/article', {
    login: true,
    article_editor: true,
    menu: req.watoData,
    today: moment().utc().format("YYYY-MM-DD")
  });
}

// GET /edit/all - shows all article page
exports.all = function (req, res, next) {
  Article.list({}, function (err, articles) {
    if (err) {
      return next(err);
    }

    return res.render('auth/all', {
      menu: req.watoData,
      files: articles,
      login: true,
      article_editor: true
    });
  });
}

// GET /edit/users - Loads the user management page
exports.users = function (req, res, next) {
  var options = {
    criteria: {
      permissions: {
        $lte: req.user.permissions || 1
      }
    }
  };

  User.list(options, function (err, users){
    if (err) {
      return next(err);
    }

    return res.render('auth/user', {
      menu: req.watoData, 
      users: users, 
      login:true
    });
  });
}

exports.notAvailable = function (req, res) {
	return res.render('auth/notavailable', {login: true});
}
