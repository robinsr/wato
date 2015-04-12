define(function (require) {
  var $ = require('jquery');
  var ko = require('ko');

  ko.bindingHandlers.deleteUser = {
    init: function (elem, val, all, vm, root) {
      var user = val();
      $(elem).click(function () {
        var confirmButton = $("<button type='button' class='btn btn-danger btn-block btn-sm'>OK?</button>");
        
        confirmButton.on('click', function () {
          user.deleteUser(function (err, status, text) {
            if (err) {
              return alert('There was a problem deleting this user');
            }
            root.$root.users.remove(vm);
          });
        });

        $(elem).children('span').replaceWith(confirmButton);
      });
    }
  }

  ko.bindingHandlers.saveUser = {
    init: function (elem, val, all, vm, root) {
      var user = val();
      $(elem).click(function () {
        user.save(function (err, status, text) {
          if (err) {
            return alert('There was a problem deleting this user');
          }
          
          if (status === 400) {
            return alert('You do not have sufficient permissions to make this change');
          }

          alert('User updated');
        });
      });
    }
  }
})