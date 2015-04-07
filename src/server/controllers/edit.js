var async = require('async')
	, moment = require('moment')
	, fs = require('fs')
	, mongoose = require('mongoose')
	, User = mongoose.model('User');

/**	
 * GET /edit
 */
exports.index = function(req, res, next) {
	var options = { 
		criteria: { 
			permissions: 3
		} 
	};

	User.find(options, function (err, users) {
		if (err) {
			return next(err);
		}

		if (!users.length) {
			return res.render('auth/welcome');
		}
		
		return res.render('auth/index');
	});
}

// GET /edit/article
exports.article = function (req, res, next) {
  var render_obj = {
    today: moment().utc().format("YYYY-MM-DD")
  }

  extend(render_obj, req.wato_data);
  
  return res.render('auth/article', render_obj);
}

// GET /edit/all
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
