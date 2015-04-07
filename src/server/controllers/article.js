var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var utils = require(__dirname+ '/../utils');
var moment = require('moment');
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
exports.single = function(req, res) {
  return res.render('public/article', req.article);
}

// GET /api/article/:article_id
exports.singleJson = function (req, res) {
  return res.send(req.article);
}
      
// GET /api/article - gets list of articles in JSON
exports.list = function(req, res, next) {
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

// GET /allarticles
exports.all = function(req, res, next) {
  var options = {
    criteria: {
      destination: 'articles'
    },
    perPage: 999,
    page: 0
  };

  Article.listSafe(options, function (err, articles) {
    if (err) {
      return next(err);
    }

    return res.send(articles);
  });
}

// POST /article
exports.create = function (req, res, next) {

  // prepare request body to save
  req.body.lastEdit = req.session.user_id;
  req.body.saveDate = moment().utc().format("YYYY-MM-DD");

  Article.create(req.body, function (err, article) {
    if (err) {
      return next(err);
    }

    return res.send(200, article._id.toString());
  });
}

// PUT /article/:article_id
exports.update = function (req, res, next){
  var article = req.article;

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

// DELETE /article
exports.del = function (req, res, next) {
  Article.remove({ _id: req.params.article_id }, function (err, article) {
    if (err) {
      return next(err);
    }
    return res.status(200).send("Article Deleted")
  });
}

// GET /__template (special route for previewing a template with the data from a specific article)
exports.templatePreview = function (req, res, next){
  Article.load({url: req.query.previewFile}, function (err, article) {
    if (err) {
      return next(err);
    }

    if (!article) {
      return next(Error('Could not find article for preview'));
    }

    return res.render('public/__preview', result);
  });
}