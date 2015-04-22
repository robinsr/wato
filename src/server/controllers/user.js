var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('./../lib/utils');
var async = require('async');
var extend = require('util')._extend;


/**
 * Load
 */

exports.load = function (req, res, next, id) {
  var options = {
    criteria: { _id : id }
  };
  User.load(options, function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};

// GET /users
exports.list = function (req, res, next) {
  var permissionsLevel = req.user.permissions;

  if (!permissionsLevel) {
    return next(new Error('You do not have sufficient permissions to list users'));
  }

  var options = {
    criteria: { permissions: { $lte: permissionsLevel } }
  }

  User.list(options, function (err, users) {
    if (err) {
      return next(err);
    }

    return res.status(200).json(users);
  })
}

// POST /users
exports.create = function (req, res, next) {
  var user = new User(req.body);
  
  user.save(function (err) {
    if (err) {
      return next (err)
    }

    return res.status(200).json(user);;
  })
}

// POST /users/createRoot - creates initial user
exports.createRoot = function (req, res, next) {
  User.count({ permissions: 3 }, function (err, count) {
    if (err) {
      return next(err);
    }

    if (count > 0) {
      return next(new Error('Root user already exists'));
    }


    var user = new User(req.body);

    // root user has level 3 permissions
    user.permissions = 3;

    user.save(function (err) {
      if (err) {
        req.flash('error', utils.errors(err.errors));
        return res.redirect('/login');
      }

      // manually login the user once successfully signed up
      req.logIn(user, function(err) {
        if (err) req.flash('info', 'Sorry! We are not able to log you in!');
        return res.redirect('/edit/article');
      });
    });
  });
};

// PUT /article/:article_id
exports.update = function (req, res, next){
  var user = req.profile;

  user = extend(user, req.body);

  user.save(function (err) {
    if (err) {
      return next(err);
    }
    return res.status(200).send();
  });
};

// GET /logout
exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session/Login
 */

exports.session = function (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/edit/article';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};


exports.destroy = function (req, res, next) {
  if (req.user.permissions < 3) {
    return next(new Error('You do not have sufficient permissions to remove users'));
  }

  var user = req.profile;

  user.remove(function (err) {
    if (err) {
      return next(err);
    }
    return res.status(200).send();
  });
}