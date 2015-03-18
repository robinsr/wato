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

  console.log(config.appRoot);

  // all environments
  app.use(express.logger('dev'));
  app.set('port', process.env.PORT || 3000);
  app.set('views', config.appRoot + 'server/publicviews/');
  app.set('view engine', 'jade');
  app.use(express.cookieParser('some secret'));
  app.use(express.session())
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.locals({
      title: "Wato",
      location: "http://wato.ethernetbucket.com",
      demo_mode: true
  })
  app.use(function(req,res,next){ req.locals = app.locals;next()});
  
  // static files
  app.use('/components', express.static(config.appRoot + 'client/components'));
  app.use('/stylesheets', express.static(config.appRoot + 'client/stylesheets'));
  app.use('/bootstrap', express.static(config.appRoot + 'client/bootstrap'));
  app.use('/fonts', express.static(config.appRoot + 'client/fonts'));
  app.use('/images', express.static(config.appRoot + 'client/images'));
  //TODO remove javascripts static route
  app.use('/javascripts', express.static(config.appRoot + 'client/javascripts'));

  // CORS 
  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  app.use(app.router);
}