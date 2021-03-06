
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  if (req.method == 'GET') req.session.returnTo = req.originalUrl
  res.redirect('/login')
}

/**
 * Authorization for updating articles 
 */
exports.article = {
  auth: function (req, res, next){
    if (req.user.permissions <= 1){
      return res.status(403).send('You do not have the necessary permissions to save')
    }
    next();
  }
};

/**
 * Authorization for updating users
 */
exports.user = {
  auth: function (req, res, next){
    if (req.user.permissions < 3) {
      return next(new Error('You do not have sufficient permissions to edit users'));
    }
    next();
  }
}
