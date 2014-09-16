/**
 * Module dependencies.
 */

var express = require('express'),
  path = require('path');


module.exports = function(app, config) {
  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }

  app.use('/components', express.static(config.appRoot + 'client/components'));
  app.use('/stylesheets', express.static(config.appRoot + 'client/stylesheets'));
  app.use('/bootstrap', express.static(config.appRoot + 'client/bootstrap'));
  app.use('/fonts', express.static(config.appRoot + 'client/fonts'));
  app.use('/images', express.static(config.appRoot + 'client/images'));
  //TODO remove javascripts static route
  app.use('/javascripts', express.static(config.appRoot + 'client/javascripts'));

  // remove dev directory from request

  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  // all environments
  app.set('port', process.env.PORT || 8126);
  app.set('views', config.appRoot + 'server/publicviews/');
  app.set('view engine', 'jade');
  app.use(express.cookieParser('some secret'));
  app.use(express.session())
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.locals({
      title: "Wato",
      location: "http://wato.ethernetbucket.com",
      demo_mode: true
  })
  app.use(function(req,res,next){ req.locals = app.locals;next()});
  app.use(app.router);
}