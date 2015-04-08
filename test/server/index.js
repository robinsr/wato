/**
* Common test dependencies
*/

var app = require(__dirname + '/../../src/server/app').app;
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article= mongoose.model('Article');
var helpers = require('./helper');

module.exports.mount = function () {
  before(function (done) {
    var self = this;
    self.app = app;

    async.series([
      helpers.clearDb,
      function (next) {
        self.user = new User({
          email: 'foobar@example.com',
          name: 'Foo bar',
          username: 'foobar',
          password: 'foobar',
          permissions: 3
        });
        self.user.save(next)
      },
      function (next) {
        var article = new Article({
          title: 'test',
          url: 'test',
          content: 'test',
          destination: 'articles',
          category: 'test_category',
          cssFiles: ['test.css']
        });
        article.save(next)
      }
      ], done);
  });
}