var async = require('async')
	, mongoose = require('mongoose')
	, User = mongoose.model('User');


// GET /edit/users - Loads the user management page
exports.index = function(req, res, next) {
  User.load({
    criteria: {
      permissions: {
        $lte: req.session.permissions
      }
    }
  }, function (err, users){
		if (err) {
			return next(err);
		}

		return res.render('auth/user', {
      files: req.watoData, 
      users: users, 
      login:true
    });
  });
}

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

/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body);

  user.save(function (err) {
    if (err) {
      return res.render('users/signup', {
        errors: utils.errors(err.errors),
        user: user,
        title: 'Sign up'
      });
    }

    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) req.flash('info', 'Sorry! We are not able to log you in!');
      return res.redirect('/edit/article');
    });
  });
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.user;

  res.render('users/show', {
    email: user.email,
    user: user
  });
};

exports.signin = function (req, res) {};

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};


exports.destroy = function (req, res, next) {
	return next()
}