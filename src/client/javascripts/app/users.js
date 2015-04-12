define(function (require) {
  var $ = require('jquery')
  var ko = require('ko');
  var bindings = require('bindings');
  var EditUserViewmodel = require('viewmodels/editUser');
  var NewUserViewmodel = require('viewmodels/newUser');

  ko.applyBindings(new EditUserViewmodel(), $("#edituser").get(0));
  ko.applyBindings(new NewUserViewmodel(), $("#newuser").get(0));
});