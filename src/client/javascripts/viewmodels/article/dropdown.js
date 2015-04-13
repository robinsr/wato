define(function (require) {
  var $ = require('jquery');
  var _ = require('lodash');
  var ko = require('ko');
  var FileModel = require('models/file');
  var utils = require('lib/utils');


  /**
   * DropdownVM
   *
   * Generic dropdown viewmodel for attach files (css, templates, etc.)
   * 
   * @param {ObservableArray} modelArray List of files in app model to track
   * @param {String}          title      Title of dropdown
   * @param {Array}           files      Array of fileNames (optional)
   * @param {String}          listUri    String uri where list of resources can 
   *                                     be fetched
   */
  var DropdownVM = function (modelArray, title, files, listUri) {
    var self = this;

    self.title = ko.observable(title);
    self.files = ko.observableArray([]);

    // Update the file models as the app model changes
    modelArray.subscribe(function (val) {
      _.forEach(self.files(), function (file) {
        if (val.indexOf(file.filename()) > -1) {
          file.attached(true)
        } else {
          file.attached(false)
        }
      });
    });

    /**
     * fileClicked
     * Updated the app model as files are clicked
     */
    self.fileClicked = function () {
      var file = this;

      file.attached(!file.attached())

      if (file.attached()) {
        return modelArray.push(file.filename());
      }

      return modelArray.remove(file.filename());
    }

    /**
     * init
     * load files from array or from resource URI
     */
    function init () {
      if (files && files.length) {
        self.files(_.map(files, function (file) {
          return new FileModel(file)
        }))
      }

      if (listUri) {
        utils.issue(listUri, {}, 'GET', function (err, status, data) {
          if (err) {
            return console.log(err);
          }

          self.files(_.map(data, function (file) {
            var attached = (modelArray().indexOf(file) > -1);
            return new FileModel(file, attached)
          }));
        });
      }
    }

    // load files on init
    init();
  }

  return DropdownVM;
});