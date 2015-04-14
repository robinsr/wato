var async = require('async');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article = mongoose.model('Article');
var extend = require('util')._extend;
var config = require('./../config/config')

var viewsPath = path.resolve(config.appRoot, 'server/views/auth');

// GET /edit - shows login page
exports.login = function(req, res, next) {
	User.count({ permissions: 3 }, function (err, count) {
		if (err) {
			return next(err);
		}

		if (!count) {
			return res.render(viewsPath + '/welcome');
		}

    if (req.isAuthenticated()) {
      return res.redirect('/edit/article');
    }

    return res.render(viewsPath + '/index');
	});
}

// GET /edit/article - shows article edit page
exports.article = function (req, res, next) {
  return res.render(viewsPath + '/article', {
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

    return res.render(viewsPath + '/all', {
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

    return res.render(viewsPath + '/user', {
      menu: req.watoData, 
      users: users, 
      login: true
    });
  });
}

// GET /edit/templates - Loads template editor page
exports.template = function (req, res, next) {
  if (req.query.file) {
    // replace with app.get('viewsPath');
    var uri = path.resolve(res.locals.viewsPath, req.query.file);

    return fs.readFile(uri, function (err, fileContents) {
      if (err) return next(err);

      res.render(viewsPath + '/template', {
        title: 'Template Editor',
        login: true,
        menu: req.watoData,
        fileContents: fileContents
      });
    })
  }

  return res.render(viewsPath + '/template', {
    login: true,
    menu: req.watoData
  });
}

exports.notAvailable = function (req, res) {
	return res.render(viewsPath + '/notavailable', {login: true});
}
