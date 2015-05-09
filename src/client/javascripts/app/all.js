define(function (require) {
  var $ = require('jquery')
  var ko = require('ko');
  var bindings = require('lib/bindings');
  
  var Articles = require('models/articles')
  var articlesModel = new Articles();

  var AllArticlesVM = require('viewmodels/allArticles/allArticles');
  ko.applyBindings(new AllArticlesVM(articlesModel), $("body").get(0));
});