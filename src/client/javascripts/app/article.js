define(function (require) {
  var $ = require('jquery')
  var ko = require('ko');
  var bindings = require('lib/bindings');
  
  // Shared app model
  var AppModel = require('models/article');
  var appModel = new AppModel();

  // Dropdowns ('attach css')
  var DropdownVM = require('viewmodels/article/dropdown');
  ko.applyBindings(new DropdownVM(appModel.cssFiles, 'Attach CSS', null, '/css'), 
    $("#attach-css").get(0));
  
  // Nav Buttons ('save', 'preview')
  var NavButtonsVM = require('viewmodels/article/navbuttons');
  ko.applyBindings(new NavButtonsVM(appModel), $("#nav-buttons").get(0));

  // Notifications
  var NotifyVM = require('viewmodels/article/notifications');
  ko.applyBindings(new NotifyVM(appModel), $("#notifications").get(0));

  // Draft Space
  var DraftVM = require('viewmodels/article/draftSpace');
  ko.applyBindings(new DraftVM(appModel), $("#articledraft").get(0));

  // ToggleParams
  var ToggleParamsVM = require('viewmodels/article/toggleParameters');
  ko.applyBindings(new ToggleParamsVM(appModel), $("#toggle-params").get(0));

  // Params
  var ParamsVM = require('viewmodels/article/parameters');
  ko.applyBindings(new ParamsVM(appModel), $("#params").get(0));
});