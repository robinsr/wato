/**
* Test Dependencies
*/
var test = require('./index');
var should = require('should');
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var helper = require('./helper');


describe('Article', function() {
  
  test.mount();

  before(function (done) {
    var article = new Article({
      title: 'test',
      url: 'test',
      content: 'test',
      destination: 'articles',
      cssFils: ['test.css']
    });
    article.save(function () {
      Article.count(function(err,count){
        if (count !== 1) {
          throw new Error("Count does not equal expected");
        }
        done();
      });
    });
  });
  
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

  describe('GET /api/article/', function() {
    it('should list articles in JSON', function (done) {
      this.agent
        .get(this.host + '/api/article/')
        .end(function (err, res) {
          should.not.exist(err);
          res.should.have.property('status', 200);
          res.text.should.match(/test/);
          done();
        });
    });
  });

  describe('GET /api/article/test', function() {
    it('should return json of article', function(done) {
      this.agent
        .get(this.host + '/api/article/test')
        .end(function (err, res) {
          should.not.exist(err);
          res.should.have.property('status', 200);
          res.text.should.match(/test/);
          done();
        });
    });
  });

  describe('GET /article/test', function() {
    it('should return rendered article', function(done) {
      this.agent
        .get(this.host + '/article/test')
        .end(function (err, res) {
          should.not.exist(err);
          res.should.have.property('status', 200);
          res.text.should.match(/test/);
          done();
        });
    })
  })

  after(function () {
    helper.clearDb();
  })
});