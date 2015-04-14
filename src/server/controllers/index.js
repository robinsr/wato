var mongoose = require('mongoose');
var Article = mongoose.model('Article');
/*
* GET home page.
*/


exports.index = function (req, res, next) {
  Article.list({
    criteria: {
      destination: 'articles'
    },
    perPage: 4,
    page: 1,
  }, function(err, articles) {
    if (err) return next(err);
    res.render(res.locals.viewsPath + '/index', {
      articles: articles
    });
  })
};