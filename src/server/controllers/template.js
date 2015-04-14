var fs = require('fs');
var path = require('path');
var config = require('./../config/config');
var mongoose = require('mongoose');
var Article = mongoose.model('Article');

// POST /template
exports.post = function(req, res, next) {
  var uri = path.resolve(res.locals.viewsPath, req.body.filename);

  fs.writeFile(uri, req.body.content, function (err) {
    if (err) {
      return next(err);
    }

    res.status(200).send();
  });
}

// GET /template
exports.list = function (req, res, next) {
  fs.readdir(res.locals.viewsPath, function (err, files) {
    if (err) {
      return next(err);
    }

    res.status(200).json(files.map(function (file) {
      return path.basename(file);
    }));
  });
}

// POST /template/preview
exports.postPreview = function (req, res, next) {
  var uri = path.resolve(res.locals.viewsPath, '__preview.jade');

  fs.writeFile(uri, req.body.content, function (err) {
    if (err) return next(err);

    res.status(200).send('Preview Ready');
  });
}

// GET /template/preview
exports.getPreview = function (req, res, next) {
  var articleId = req.query.article

  Article.load({ _id: articleId }, function (err, article) {
    if (err) return next(err);

    if (!article) return next(new Error('Article not found'));

    article.getMarkup(function (err, markup) {
      if (err) return next(err);
      article.content = markup;
      res.render(res.locals.viewsPath + '/__preview', article);
    });
  });
}

