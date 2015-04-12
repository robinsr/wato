define(function (common) {
  var ko = require('ko');
  var utils = require('utils');


  var User = function (options) {
    var self = this;

    for (var n in options) {
      if (typeof self[n] == 'undefined') {
        self[n] = ko.observable(options[n]);
      } else {
        self[n](options[n]);
      }
    }

    self.changePassField = ko.observable();

    self.save = function (next) {
      self.password = self.changePassField();
      utils.issue('/users/' + self._id(), ko.toJSON(self), 'PUT', next);
    }

    self.saveNew = function (next) {
      utils.issue('/users/', ko.toJSON(self), 'POST', next);
    }

    self.deleteUser = function (next) {
      utils.issue('/users/' + self._id(), null, 'DELETE', next);
    }
  }

  return User;

});