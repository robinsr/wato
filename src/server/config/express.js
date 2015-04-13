/**
 * Module dependencies.
 */

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var csrf = require('csurf');
var multer = require('multer');
var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var helpers = require('view-helpers');
var morgan = require('morgan');
var config = require('./config');
var pkg = require(config.appRoot + '../package.json');


module.exports = function(app, passport) {
  // development only
  if ('development' == app.get('env')) {
    app.use(morgan('dev'))
  }

  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', config.appRoot + '/server/views/');
  app.set('view engine', 'jade');
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());
  app.use(multer());
  app.use(methodOverride());
  app.use(function (req, res, next){ 
    res.locals = app.locals;
    next()
  });
  // CookieParser should be above session
  app.use(cookieParser());
  app.use(cookieSession({ secret: 'secret' }));
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: pkg.name,
    store: new mongoStore({
      url: config.db,
      collection : 'sessions'
    })
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  app.use(helpers(pkg.name));

  console.log(app.get('cssPath'))

  // static files
  app.use('/components', express.static(config.appRoot + 'client/components'));
  app.use('/stylesheets', express.static(app.get('cssPath')));
  app.use('/bootstrap', express.static(config.appRoot + 'client/bootstrap'));
  app.use('/fonts', express.static(config.appRoot + 'client/fonts'));
  app.use('/images', express.static(config.appRoot + 'client/images'));
  //TODO remove javascripts static route
  app.use('/javascripts', express.static(config.appRoot + 'client/javascripts'));
  app.use('/edit/stylesheets', express.static(config.appRoot + 'client/stylesheets'));

  // CORS 
  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  // adds CSRF support
  if (process.env.NODE_ENV !== 'test') {
    app.use(csrf());

    // This could be moved to view-helpers :-)
    app.use(function (req, res, next) {
      res.locals.csrf_token = req.csrfToken();
      next();
    });
  }
}