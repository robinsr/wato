define(function (require) {
  var ko = require('ko');
  var utils = require('lib/utils');
  var _ = require('lodash');

  var Article = function () {
    var self = this;

    self.modified = ko.observable(true);
    self.notifications = ko.observableArray();
    self.showParams = ko.observable(false);

    // article observables
    self.content = ko.observable();
    self.category = ko.observable();
    self.title = ko.observable();
    self.url = ko.observable();
    self.destination = ko.observable();
    self.publishDate = ko.observable();
    self.tags = ko.observableArray([]);
    self.headertags = ko.observable();
    self.previewText = ko.observable();
    self.cssFiles = ko.observableArray([]);

    self.save = function () {
      var url = '/article/';
      var method = 'POST';

      if (typeof self._id != 'undefined') {
        url = url + self._id();
        method = 'PUT';
      }

      var saveData = JSON.stringify(_.pick(ko.toJS(self), [
        '_id', 'category', 'content', 'cssFiles', 'destination',
        'headertags', 'hideTitle', 'previewText', 'tags', 'title', 'url'
      ]));

      utils.issue(url, saveData, method, function (err, status) {
        if (err) {
          return self.notifications.push({
            type: 'error',
            title: 'Error',
            message: err
          });
        }

        self.notifications.push({
          type: 'success',
          title: 'Success',
          message: 'Article saved'
        });
      });
    }

    self.preview = function () {
      console.log('article previewing');
    }

    /**
     * loadArticle
     * Fetches an article from the server and loads properties into the model
     */
    function loadArticle () {
      var query = utils.getQueryParams(window.location.search);

      if (query.file) {
        utils.issue('/api/article/raw/' + query.file, {}, 'GET', function (err, status, data) {
          if (err) {
            return self.notifications.push({
              type: 'error',
              title: 'Error',
              message: err
            });
          }

          for (var n in data) {

            if (typeof self[n] !== 'undefined') {
              self[n](data[n]);
              continue;
            }

            if (_.isArray(data[n])) {
              self[n] = ko.observableArray(data[n]);
              continue;
            } 
            
            self[n] = ko.observable(data[n]);
          }

        });
      }
    }

    // load article on init
    loadArticle();
  }

  return Article;
});