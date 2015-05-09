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

  describe('Not logged in', function () {
    before(function () {
      articleId =  this.article._id;
    });

    describe('/GET /article', function () {
      it('should return a rendered article list', function (done) {
        this.agent
          .get('/article')
          .expect(200)
          .expect(/Test Article Title/)
          .end(done);
      });
    });

    describe('GET /article/:article_name', function () {
      it('should return rendered article', function (done) {
        this.agent
          .get('/article/test')
          .expect(200)
          .expect(/<h1 id="test">test<\/h1>/)
          .end(done);
      });
    });

    describe('GET /api/article/content', function () {
      it('should list articles in JSON', function (done) {
        this.agent
          .get('/api/article/content/')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(/<h1 id=\\"test\\">test<\/h1>/)
          .end(done);
      });
    });

    describe('GET /api/article/raw', function () {
      it('should redirect to login', function (done) {
        this.agent
          .get('/api/article/raw/')
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });
    });

    describe('GET /api/article/content/:article_id', function () {
      it('should return json of article with html', function (done) {
        this.agent
          .get('/api/article/content/' + this.article._id)
          .expect(200)
          .expect(/<h1 id=\\"test\\">test<\/h1>/)
          .end(done);
      });
    });

    describe('GET /api/article/raw/:article_id', function () {
      it('should redirect to login', function (done) {
        this.agent
          .get('/api/article/raw/' + this.article._id)
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });
    });

    describe('POST /article', function () {
      it('should redirect to login page', function (done) {
        this.agent
          .post('/article')
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });     
    });
    describe('PUT /article/:article_id', function () {
      it('should redirect to login page', function (done) {
        this.agent
          .put('/article/' + articleId)
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });     
    });
    describe('DEL /article/:article_id', function () {
      it('should redirect to login page', function (done) {
        this.agent
          .del('/article/' + articleId)
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });     
    });
  });

  describe('Logged in', function () {
    before(function (done) {
      // login the user
      this.agent
        .post('/users/session')
        .field('username', 'foobar')
        .field('password', 'foobar')
        .end(done)
    });

    describe('GET /api/article/raw', function () {
      it('should return json array of articles with markdown', function (done) {
        this.agent
          .get('/api/article/raw/')
          .expect(200)
          .expect(/#\stest/)
          .end(done);
      });
    });

    describe('GET /api/article/raw/:article_id', function () {
      it('should return json of article with markdown', function (done) {
        this.agent
          .get('/api/article/raw/' + this.article._id)
          .expect(200)
          .expect(/#\stest/)
          .end(done);
      });
    });

    describe('POST /article', function () {
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
    });

    describe('PUT /article/:article_id', function () {
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

    describe('DEL /article/:article_id', function () {
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