var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var utils = require(__dirname+ '/../utils');
var moment = require('moment');
var extend = require('util')._extend;

/*
 * GET article.
 */



// GET /auth/article
exports.articleEditor = function (req,res){
  utils.getMenuFileList(function(err,render_obj){
    if (err) {
      res.render('auth/error')
    } else {
      render_obj.login = true; 
      render_obj.article_editor = true;
      render_obj.today = moment().utc().format("YYYY-MM-DD")
      res.render('auth/article', render_obj);
    }
  });
}

// GET /auth/all
exports.allArticles = function (req,res){
  utils.getAllFiles(function(err,render_obj){
    if (err) {
      res.render('auth/error')
    } else {
      render_obj.login = true; 
      render_obj.article_editor = true;
      res.render('auth/all', render_obj);
    }
  });
}

// GET /article/:article_name
exports.single = function(req, res){
  Article.load(req.params.article_name, function (err, article) {
    if (err) return res.render('503', err);
    if (!article) return res.render('404');
    return res.render('article',article)
  });
}

exports.singleJson = function (req, res) {
  Article.loadSafe(req.params.article_name, function (err, article) {
    if (err) return res.render('503', err);
    if (!article) return res.render('404');
    return res.send(article);
  });
}
      

// GET /api/article - gets list of articles in JSON
exports.list = function(req, res){
  var options = {
    //TODO: Expand usable query param options
    criteria: {
      destination: 'articles'
    },
    perPage: req.query.limit || 15,
    page: req.query.page || 0
  };

  Article.listSafe(options, function (err, articles) {
    if (err) return res.render('503', err);
    return res.send(articles);
  });
};

// GET /allarticles
exports.all = function(req, res){
  var options = {
    criteria: {
      destination: 'articles'
    },
    perPage: 999,
    page: 0
  };

  Article.listSafe(options, function (err, articles) {
    if (err) return res.render('503', err);
    return res.send(articles);
  });
}

// POST /article
exports.save = function(req,res){

  // prepare request body to save
  req.body.lastEdit = req.session.user_id;
  req.body.saveDate = moment().utc().format("YYYY-MM-DD");

  Article.load({ url: "__preview" }, function (err, article){
    if (err) return res.send(500, "Error generating preview");
    article = article || {}; // if no article found
    extend(article, req.body);
    article.save(function (err) {
      if (err) return res.send(500, "Error saving");
      res.send(200, article._id.toString());
    })
  });
}

// PUT /article
exports.preview = function(req, res){
  
  // Prepare request body to save
  delete req.body._id;
  req.body.url = "__preview";
  req.body.category = "dnd";
  req.body.destination = "preview";

  Article.load({ url: "__preview" }, function (err, article){
    if (err) return res.send(500, "Error generating preview");
    article = article || {}; // if no article found
    extend(article, req.body);
    article.save(function (err) {
      if (err) return res.send(500, "Error generating preview");
      res.send(200, "Preview ready");
    })
  });
}

// DELETE /article
exports.del = function(req, res){
  Article.remove({ url: url}, function (err, article) {
    if (err) return res.status(500).send("Could not delete articles");
    res.status(200).send("Article Deleted")
  });
}

// GET /__template (special route for previewing a template with the data from a specific article)
exports.templatePreview = function(req, res){
  Article.load({url: req.query.previewFile}, function (err, article) {
    if (err) return res.render('503', err);
    if (!article) return res.render('503', 
      new Error('Could not find article for preview'));
    return res.render('__preview', result);
  });
}