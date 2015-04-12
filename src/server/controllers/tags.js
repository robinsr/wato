var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var u = require("underscore");

// GET /tags/:tag
exports.list = function (req, res, next) {
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
