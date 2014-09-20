var routes = require(__dirname + '/../controllers')
, article = require(__dirname + '/../controllers/article')
, category = require(__dirname + '/../controllers/category')
, css = require(__dirname + '/../controllers/css')
, template = require(__dirname + '/../controllers/template')
, auth = require(__dirname + '/../controllers/auth')
, user = require(__dirname + '/../controllers/user')


module.exports = function (app){
  // defines routes for readers
  app.get('/', routes.index);
  app.get('/article/:article_name', article.single);
  app.get('/allarticles', article.all);
  app.get('/category/:category_name', category.list);

  // defines routes for the web api
  app.get('/api/article', article.list);
  app.get('/api/article/:article_name', article.singleJson);

  // defines routes for author tools pages
  app.get('/auth', auth.index); // shows login
  app.post('/auth/login', auth.login); // takes form fields and sets cookie
  app.get('/auth/logout', auth.logout);
  app.get('/auth/article', auth.checkSession, article.articleEditor);
  app.get('/auth/all', auth.checkSession, article.allArticles);
  app.get('/auth/css', auth.checkSession, function(req,res){
    res.render('auth/notavailable', {login: true});
  });
  app.get('/auth/template', auth.checkSession, function(req,res){
    res.render('auth/notavailable', {login: true});
  });

  // defines routes for get/posting/putting/deleting resources
  app.post('/article', auth.checkSession, article.save);
  app.put('/article', auth.checkSession, article.preview);
  app.del('/article', auth.checkSession, article.del);
  app.post('/css', auth.checkSession, css.post);
  app.get('/template/:template_name', auth.checkSession, template.file);
  app.post('/template', auth.checkSession, template.post);
  app.put('/template', auth.checkSession, template.preview);
  app.get('/__template', auth.checkSession, article.templatePreview);

  // defines routes for admins
  app.get('/auth/user', auth.checkSession, user.index);
  app.post('/user', auth.checkSession, user.add);
  app.del('/user', auth.checkSession, user.del);
  app.put('/user/password', auth.checkSession, user.changePass);
  app.put('/user/permissions', auth.checkSession, user.changeLevel);

  // 404 route
  app.get('*',function(req,res){
    res.status(404);
    res.render('404');
  })
}