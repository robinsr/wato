define(function (require) {
  var ko = require('ko');
  var utils = require('lib/utils');
  var _ = require('lodash');
  var Article = require('models/article');

  var Articles = function () {
    var self = this;

    self.articles = ko.observableArray();

    self.notifications = ko.observableArray();

    /**
     * loadArticles
     * Fetches articles from the server and loads properties into the model
     */
    function loadArticles () {
      utils.issue('/api/article/raw/', {}, 'GET', function (err, status, data) {
        if (err) {
          return self.notifications.push({
            type: 'error',
            title: 'Error',
            message: err
          });
        }

        _.each(data, function (file) {
          var article = new Article();

          article._id = ko.observable(file._id);
          article.lastEditedBy = ko.observable(file.lastEditedBy);
          
          for (var n in file) {
            if (typeof article[n] != 'undefined') {
              article[n](file[n]);
            }
          }

          article.notifications.subscribe(function (val) {
            self.notifications.push(val[0]);
          });

          article.destination.subscribe(function (val) {
            article.save();
          });

          self.articles.push(article);
        });
      });
    }

    // load article on init
    loadArticles();
  }

  return Articles;
});