define(function (require) {

  var ToggleParamsVM = function (model) {
    var self = this;

    self.showParams = model.showParams;

    self.toggleParams = function () {
      model.showParams(!model.showParams());
    };
  }

  return ToggleParamsVM;
});