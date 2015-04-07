/**
* Common test dependencies
*/

var app = require(__dirname + '/../../src/server/app');

var request = require('supertest');

module.exports.mount = function () {
  before(function (done) {
    
    this.host = "http://localhost:" + process.env.PORT;
    this.agent = request.agent(app);
    done();
  });
}