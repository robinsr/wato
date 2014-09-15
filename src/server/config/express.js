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

  // remove dev directory from request

  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  // all environments
  app.set('port', process.env.PORT || 8126);
  app.set('views', __dirname + '/../publicviews');
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
  app.use(express.static('/components', path.normalize(__dirname + '/../client/components')));
  app.use(express.static('/views', __dirname + '/views'));
  app.use(app.router);
}