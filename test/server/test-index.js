/**
* Test Dependencies
*/
var test = require('./index');
var supertest = require('supertest');

describe('Index', function () {
  
  test.mount();

  before(function () {
    this.agent = supertest.agent(this.app);
  });

  describe('GET /', function() {
    it('Should respond', function (done) {
      this.agent
        .get('/')
        .expect(200)
        .end(done);
    });
  });
});