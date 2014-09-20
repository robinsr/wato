var mongoose = require('mongoose');
var Article = mongoose.model('Article');
/*
* GET home page.
*/


exports.index = function(req, res){
  Article.list({
    criteria: {
      destination: 'articles'
    },
    perPage: 4,
    page: 1,
  }, function(err, articles) {
    if (err) return res.render('503', err);
    res.render('index', articles);
  })
};