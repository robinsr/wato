define(function (require) {
  var $ = require('jquery')
  var ko = require('ko');
  var bindings = require('lib/bindings');
  var TemplateVM = require('viewmodels/template/template');

  ko.applyBindings(new TemplateVM(), $("body").get(0));
});