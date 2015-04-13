var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var u = require("underscore");

// GET /tags/?tags=tag1,tag2
exports.list = function (req, res, next) {
  if (!req.query.tags) {
    return res.render('public/category', {
      tags: [],  
      articles: []
    });
  }

  var tags = req.query.tags.split(',') || '';
  var options = {
    criteria: {
      tags: { $in: tags },
      destination: 'articles'
    }
  };

  Article.list(options, function (err, articles) {
    if (err) return next(err);
    req.articles = articles;
    res.render('public/category', {
      tags: tags,  
      articles: req.articles
    });
  });
};
