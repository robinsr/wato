define(function () {
  var NotificationsVM = function (model) {
    this.notifications = model.notifications;

    this.dismiss = function () {
      model.notifications.remove(this);
    }
  };

  return NotificationsVM;
})