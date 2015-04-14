var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var moment = require('moment');
var async = require('async');
var extend = require('util')._extend;

/*
 * GET article.
 */

exports.loadByName = function(req, res, next) {
  Article.loadSafe({ url: req.params.article_name }, function (err, article) {
    if (err) return next(err);
    if (!article)  return next(new Error('Article not found'));
    req.article = article;
    next();
  });
}

exports.loadById = function(req, res, next) {
  Article.load({ _id: req.params.article_id }, function (err, article) {
    if (err) return next(err);
    if (!article)  return next(new Error('Article not found'));
    req.article = article;
    next();
  });
}


// GET /article/:article_name
exports.single = function(req, res, next) {
  if (req.article.destination != 'articles') {
    return next(new Error('Article not found'));
  }

  req.article.getMarkup(function (err, markup) {
    if (err) {
      return next(err);
    }

    req.article.content = markup;

    return res.render(res.locals.viewsPath + '/article', req.article);
  });
}

// GET /api/article/content/:article_id
exports.singleJson = function (req, res) {
  req.article.getMarkup(function (err, markup){
    if (err) return cb(err);
    req.article.content = markup;
    return res.send(req.article);
  });
}

// GET /api/article/raw/:article_id
exports.singleJsonRaw = function (req, res) {
  return res.send(req.article);
}
      
// GET /api/article - gets list of articles in JSON
exports.listJson = function(req, res, next) {
  var options = {
    //TODO: Expand usable query param options
    criteria: {
      destination: 'articles'
    },
    perPage: req.query.limit || 15,
    page: req.query.page || 0
  };

  Article.listSafe(options, function (err, articles) {
    if (err) {
      return next(err);
    }

    return res.send(articles);
  });
};

// GET /article
exports.list = function(req, res, next) {
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30
  var options = {
    criteria: {
      destination: 'articles'
    },
    perPage: perPage,
    page: page
  };

  async.parallel({
    articles: function (done) {
      Article.listSafe(options, done);
    },
    count: function (done) {
      Article.count(options.criteria, done);
    }
  }, function (err, result) {
      if (err) {
        return next(err);
      }

      return res.render(res.locals.viewsPath + '/allarticles', { 
        articles: result.articles, 
        count: result.count,
        page: page + 1,
        pages: Math.ceil(result.count / perPage)
    });
  });
}

// POST /article
exports.create = function (req, res, next) {

  // prepare request body to save
  req.body.createdBy = req.user;
  req.body.lastEditedBy = req.user;
  req.body.saveDate = moment().utc().format("YYYY-MM-DD");

  Article.create(req.body, function (err, article) {
    if (err) {
      return next(err);
    }

    return res.status(200).send(article._id.toString());
  });
}

// PUT /article/:article_id
exports.update = function (req, res, next){
  var article = req.article;

  article.lastEditedBy = req.user;

  // make sure no one changes the user
  delete req.body.user;
  article = extend(article, req.body);

  article.save(function (err) {
    if (err) {
      return next(err);
    }
    return res.status(200).send();
  });
};

// PUT /article
exports.preview = function (req, res, next) {
  
  // Prepare request body to save
  delete req.body._id;
  req.body.url = "__preview";
  req.body.category = "dnd";
  req.body.destination = "preview";

  Article.load({ url: "__preview" }, function (err, article) {
    if (err) {
      return next(new Error("Error generating preview"));
    }

    article = article || {}; // if no article found
    extend(article, req.body);

    article.save(function (err) {
      if (err) {
        return next(new Error("Error generating preview"));
      }
      return res.send(200, "Preview ready");
    });
  });
}

// DELETE /article/:article_id
exports.del = function (req, res, next) {
  Article.remove({ _id: req.params.article_id }, function (err, article) {
    if (err) {
      return next(err);
    }
    return res.status(200).send("Article Deleted")
  });
}
