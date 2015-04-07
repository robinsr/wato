var routes = require(__dirname + '/../controllers')
, article = require(__dirname + '/../controllers/article')
, category = require(__dirname + '/../controllers/category')
, css = require(__dirname + '/../controllers/css')
, template = require(__dirname + '/../controllers/template')
, edit = require(__dirname + '/../controllers/edit')
, users = require(__dirname + '/../controllers/user')
, auth = require('./middlewares/authorization')
, resources = require('./middlewares/resources');

var articleAuth = auth.article.auth;
var userAuth = auth.user.auth;

var menuFileList = resources.getMenuFileList;

module.exports = function (app, passport) {

  // params
  app.param('userId',         users.load);
  app.param('article_name',   article.loadByName);
  app.param('article_id',     article.loadById)
  app.param('category_name',  category.load);
  app.param('template_name',  template.load);


  // defines routes for readers
  app.get('/',                        routes.index);

  // article & category routes 
  app.get('/article/:article_name',     article.single);
  app.get('/allarticles',               article.all);
  app.get('/api/article',               article.list);
  app.get('/api/article/:article_name', article.singleJson);
  app.get('/category/:category_name',   category.list);

    // user routes
  app.get('/login',  users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.del( '/users/:userId', auth.requiresLogin, users.destroy);

  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);

  // defines routes for author tools pages
  app.get( '/edit',          edit.index); // shows login
  app.get( '/edit/article',  auth.requiresLogin, menuFileList, edit.article);
  app.get( '/edit/all',      auth.requiresLogin, menuFileList, edit.all);
  app.get( '/edit/css',      auth.requiresLogin, menuFileList, edit.notAvailable);
  app.get( '/edit/template', auth.requiresLogin, menuFileList, edit.notAvailable);

  // defines routes for get/posting/putting/deleting resources
  app.post('/article',                 auth.requiresLogin, article.create);
  app.put( '/article/:article_id',     auth.requiresLogin, article.update);
  app.del( '/article/:article_id',     auth.requiresLogin, articleAuth, article.del);
  app.post('/css',                     auth.requiresLogin, css.post);
  app.get( '/template/:template_name', auth.requiresLogin, template.file);
  app.post('/template',                auth.requiresLogin, template.post);
  app.put( '/template/:template_name', auth.requiresLogin, template.preview);
  app.get( '/__template',              auth.requiresLogin, article.templatePreview);

  // defines routes for admins
  app.get( '/edit/users',         auth.requiresLogin, users.index);

  // initial create user
  app.post('/edit/createAdmin', edit.createRoot);
  
  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {

    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    console.error(err.stack);
    // error page
    res.status(500).render('public/503', { error: err });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('public/404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
}