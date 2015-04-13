define(function (require) {
  var $ = require('jquery')
  var ko = require('ko');
  var bindings = require('lib/bindings');
  var EditUserViewmodel = require('viewmodels/user/editUser');
  var NewUserViewmodel = require('viewmodels/user/newUser');

  ko.applyBindings(new EditUserViewmodel(), $("#edituser").get(0));
  ko.applyBindings(new NewUserViewmodel(), $("#newuser").get(0));
});