define(function (require) {
  var ko = require('ko');

  var File = function (filename, attached) {
    var self = this;

    self.filename = ko.observable(filename);
    self.attached = ko.observable(attached || false);
  }

  return File;
});