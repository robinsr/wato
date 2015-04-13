define(function (require) {
  var ko = require('ko');
  var _ = require('lodash');
  var utils = require('utils');

  var ParametersVM = function (model) {
    var self = this;

    // observables for this VM
    self.showParams = model.showParams;
    self.allCategories = ko.observableArray();

    // Shared model observables
    self.title = model.title;
    self.url = model.url;
    self.destination = model.destination;
    self.publishDate = model.publishDate;
    self.tags = model.tags;
    self.headertags = model.headertags;
    self.previewText = model.previewText;
    self.category = model.category

    // Tags
    self.newTagField = ko.observable();
    
    self.deleteTag = function () {
      model.tags.remove(this);
    };

    self.addTag = function () {
      model.tags.push(self.newTagField());
      self.newTagField(null);
    };

    // Category
    self.newCategoryField = ko.observable();
    
    self.addCategory = function () {
      self.allCategories.push(self.newCategoryField());
      self.newCategoryField(null);
    };

    /**
     * selectCategory
     * click handler for categories. Adds the clicked category to model
     */
    self.selectCategory = function (val) {
      model.category(val);
    };

    /**
     * fetchTags
     * fetches array of tags from server and adds to model
     */
    function fetchTags () {
      utils.issue('/api/category/', null, 'GET', function (err, status, categories) {
        if (err) {
          return model.notifications.push({
            type: 'error',
            title: 'Error!',
            message: err
          })
        }

        self.allCategories(categories);
      })
    }

    // load categories on init
    fetchTags();
  }

  return ParametersVM;
});