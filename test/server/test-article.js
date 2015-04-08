/**
* Test Dependencies
*/
var test = require('./index');
var supertest = require('supertest');
var should = require('should');
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var helper = require('./helper');

var articleId;

describe('Article', function() {
  
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

  describe('GET /api/article/', function() {
    it('should list articles in JSON', function (done) {
      this.agent
        .get('/api/article/')
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);
          res.text.should.match(/test/);
          done();
        });
    });
  });

  describe('GET /api/article/test', function() {
    it('should return json of article', function(done) {
      this.agent
        .get('/api/article/test')
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);
          res.text.should.match(/test/);
          done();
        });
    });
  });

  describe('GET /article/test', function() {
    it('should return rendered article', function(done) {
      this.agent
        .get('/article/test')
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);
          res.text.should.match(/test/);
          done();
        });
    });
  });

  describe('POST /article', function () {
    before(function (done) {
      // login the user
      this.agent
        .post('/users/session')
        .field('username', 'foobar')
        .field('password', 'foobar')
        .end(done)
    });

    it('should create a new article', function (done) {
      this.agent
        .post('/article')
        .send({
          title: 'POST test',
          url: 'post_test',
          content: '#Test Content',
          destination: 'articles',
          category: 'test_category',
          cssFiles: ['test.css']
        })
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);
          res.text.should.match(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);
          articleId = res.text;
          Article.findOne({ url: 'post_test'}, function (err, article) {
            should.not.exist(err);
            should.exist(article);
            done();
          });
        });
    });

    describe('PUT /article', function () {
      it('should update the article', function (done) {
        this.agent
          .put('/article/' + articleId)
          .send({
            title: 'Updated POST test'
          })
          .expect(200)
          .end(function (err, res) {
            should.not.exist(err);

            Article.findOne({ url: 'post_test'}, function (err, article) {
              should.not.exist(err);
              should.exist(article);
              article.title.should.equal('Updated POST test');
              done();
            });
          });
      });
    });

    describe('DEL /article', function () {
      it('should remove an article', function (done) {
        this.agent
          .del('/article/' + articleId)
          .expect(200)
          .end(function (err, res) {
            should.not.exist(err);

            Article.findOne({ url: 'post_test'}, function (err, article) {
              should.not.exist(err);
              should.not.exist(article);
              done();
            });
          });
      });
    });
  });

  after(function () {
    helper.clearDb();
  });
});