
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var config = require('../config');
var User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    var options = {
      criteria: { username: username },
      select: 'email hashed_password salt permissions'
    };
    User.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' });
      }
      if (user.permissions === 0) {
        return done(null, false,  { message: 'Your account is disabled'});
      }
      return done(null, user);
    });
  }
);
