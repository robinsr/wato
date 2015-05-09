define(function (require) {
  var $ = require('jquery');
  var _ = require('lodash');
  var ko = require('ko');
  var utils = require('lib/utils');

  var AllArticlesVM = function (model) {
    var self = this;

    self.moveOptions = ko.observableArray([
      'articles',
      'drafts',
      'trash'
    ]);

    self.notifications = model.notifications;

    self.dismiss = function () {
      model.notifications.remove(this);
    }

    self.articles = ko.computed(function () {
      var articles = model.articles();
      return _.filter(articles, function (article) {
        return article.destination() == 'articles';
      });
    });

    self.drafts = ko.computed(function () {
      var articles = model.articles();
      return _.filter(articles, function (article) {
        return article.destination() == 'drafts';
      });
    });

    self.trash = ko.computed(function () {
      var articles = model.articles();
      return _.filter(articles, function (article) {
        return article.destination() == 'trash';
      });
    });
  }
      
  return AllArticlesVM;
});


