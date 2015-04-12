define(function (require) {
  var $ = require('jquery');
  var _ = require('lodash');
  var ko = require('ko');
  var UserModel = require('models/user');
  var utils = require('utils');

  var EditUserVM = function () {
    var self = this;

    self.users = ko.observableArray();

    self.permissionsOptions = ko.observableArray([
      { display: '0 - No Permissions', value: 0 },
      { display: '1 - Read Access', value: 1 },
      { display: '2 - Read/Write Access', value: 2 },
      { display: '3 - Read/Write & Manager Users', value: 3 }
    ]);

    self.saveUser = function () {
      this.save(function (err, status, text) {
        if (err) {
          return alert(err)
        }
        alert('User updated');
        location.reload(true);
      });
    };

    // fetch users on init
    utils.issue('/users', {}, 'GET', function (err, status, users) {
      if (err) return alert('There was an error getting users');

      self.users(_.map(users, function (user) {
        return new UserModel(user);
      }));
    });
  }

  $(function(){
    $.fn.poof = function(){
      console.log('poofing started')
      var elem = this;
      elem.fadeTo(200,0,function(){
        setTimeout(function(){
          elem.remove();
        },500)
      });
    }
  });

  return EditUserVM;
});


