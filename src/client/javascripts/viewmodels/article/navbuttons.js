define(function (require) {
  var ko = require('ko');

  var NavButtonsVM = function (model) {
    this.modified = model.modified;
    
    this.preview = function () {
      model.preview();
    }
    
    this.save = function () {
      model.save();
    }
  }

  return NavButtonsVM;
});