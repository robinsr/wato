/**
* Common test dependencies
*/

var app = require(__dirname + '/../../src/server/app').app;
var request = require('supertest');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.mount = function () {
  before(function (done) {
    var self = this, port = process.env.PORT || 3000;
    self.host = "http://localhost:" + port;

    async.series([
      function (next) {
        self.user = new User({
          email: 'foobar@example.com',
          name: 'Foo bar',
          username: 'foobar',
          password: 'foobar',
          permissions: 2
        });

        self.user.save(next)
      },
      function (next) {
        app.listen(port, function (err) {
          if (err) return next(err);
          console.log('App listening on ' + port);
          self.agent = request.agent(app);
          next();
        });
      }
      ], done);
  });
}