/**
* Test Dependencies
*/
var test = require('./index');
var should = require('should');


describe('Article', function() {
  
  test.mount();
  
  beforeEach(function (done) {
    done();
  });

  describe('GET /', function() {
    it('Should respond', function (done) {
      this.agent
        .get(this.host + '/')
        .end(function (err, res) {
          should.not.exist(err);
          res.should.have.property('status', 200);
          done();
        });
    });
  });

  describe.skip('GET /article/:article_name', function() {
    it('should serve an article', function (done) {
      this.agent
        .get(this.host + '/article/test')
        .end(function (err, res) {
          should.not.exist(err);
          res.should.have.property('status', 200);
        });
    });
  });
});