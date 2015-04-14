define(function (require) {
  var ko = require('ko');
  var _ = require('lodash');
  var utils = require('lib/utils');

  var TemplateVM = function (model) {
    var self = this;

    self.content = ko.observable();
    self.filename = ko.observable(utils.getQueryParams(window.location.search).file);

    self.previewFile = ko.observable();
    self.notifications = ko.observableArray();
    self.showParams = ko.observable(false);

    self.toggleParams = function () {
      self.showParams(!self.showParams());
    }

    self.dismiss = function () {
      self.notifications.remove(this);
    };

    self.save = function () {

      var filename = self.filename()

      if (!filename) return self.notifications.push({
        type: 'error',
        title: 'Error',
        message: '\'Filename\' must not be blank'
      });

      if (filename.indexOf('.jade') < 0) return self.notifications.push({
        type: 'error',
        title: 'Error',
        message: '\'Filename\' must have a \'.jade\' extension'
      });

      var saveData = JSON.stringify(_.pick(ko.toJS(self), ['filename', 'content']));

      utils.issue('/template', saveData, 'POST', function (err, status) {
        if (err) return self.notifications.push({
          type: 'error',
          title: 'Error',
          message: err
        });

        self.notifications.push({
          type: 'success',
          title: 'Success',
          message: 'Template updated'
        });

      });
    };

    self.preview = function () {
      var article = self.previewFile();
      var saveData = JSON.stringify(_.pick(ko.toJS(self), ['content']));
      var url = '/template/preview'

      utils.issue(url, saveData, 'POST', function (err, status) {
        if (err) return self.notifications.push({
          type: 'error',
          title: 'Error',
          message: err
        });

        window.open(url + '?article=' + article);
      })
    }
  }

  return TemplateVM;
});