define(function (require) {
  var ko = require('ko');
  var UserModel = require('models/user');

  var NewUserVM = function () {
    var self = this;

    self.permissionsOptions = ko.observableArray([
      { display: '0 - No Permissions', value: 0 },
      { display: '1 - Read Access', value: 1 },
      { display: '2 - Read/Write Access', value: 2 },
      { display: '3 - Read/Write & Manager Users', value: 3 }
    ]);

    self.permissions = ko.observable();
    self.username = ko.observable();
    self.password = ko.observable();
    self.name = ko.observable();
    self.email = ko.observable();

    self.errorMessage = ko.observable();

    self.resetFields = function () {
      self.permissions(null);
      self.username(null);
      self.name(null);
      self.password(null);
      self.email(null);
    }

    self.save = function () {      
      var validateFields = [
        'name',
        'username',
        'email',
        'password',
      ];

      for (var i = 0; i < validateFields.length; i++) {
        var prop = self[validateFields[i]]();
        if (!prop || !prop.length) {
          return self.errorMessage(validateFields[i] + ' must be filled');
        }
      };

      var user = new UserModel({
        permissions: self.permissions(),
        name: self.name(),
        email: self.email(),
        username: self.username(),
        password: self.password()
      });

      self.errorMessage(null);

      user.saveNew(function (err, status, data) {
        if (err) return alert(err);

        alert('User added');
        location.reload(true);
      });
    }
  }

  return NewUserVM;
});