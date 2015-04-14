/**
* Test Dependencies
*/
var test = require('./index');
var should = require('should');
var supertest = require('supertest');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var helper = require('./helper');

var articleId;

describe('Edit', function() {
  
  test.mount();

  before(function () {
    this.agent = supertest.agent(this.app);
  });

  describe('Not logged in', function () {
    describe('GET /edit/article', function () {
      it('Should redirect to the edit index page (login)', function (done) {
        this.agent
          .get('/edit/article')
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });
    });
    describe('GET /edit/all', function () {
      it('Should redirect to the edit index page (login)', function (done) {
        this.agent
          .get('/edit/all')
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });
    });
    describe('GET /edit/css', function () {
      it('Should redirect to the edit index page (login)', function (done) {
        this.agent
          .get('/edit/css')
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });
    });
    describe('GET /edit/template', function () {
      it('Should redirect to the edit index page (login)', function (done) {
        this.agent
          .get('/edit/template')
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });
    });
    describe('GET /edit/users', function () {
      it('Should redirect to the edit index page (login)', function (done) {
        this.agent
          .get('/edit/users')
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });
    });
  });

  describe('Logged in', function () {
    before(function (done) {
      this.agent
        .post('/users/session')
        .field('username', 'foobar')
        .field('password', 'foobar')
        .end(done)
    });

    describe('GET /edit/article', function () {
      it('Should render the article editor page', function (done) {
        this.agent
          .get('/edit/article')
          .expect(200)
          .expect(/draftcolumn/)
          .end(done);
      });
    });

    describe('GET /edit/all', function () {
      it('Should render all articles page', function (done) {
        this.agent
          .get('/edit/all')
          .expect(200)
          .expect(/Articles/)
          .expect(/Drafts/)
          .expect(/Trash/)
          .end(done);
      });
    });

    describe('GET /edit/css', function () {
      it('Should render the "not avalable" page', function (done) {
        this.agent
          .get('/edit/css')
          .expect(200)
          .expect(/not available/)
          .end(done);
      });
    });

    describe('GET /edit/template', function () {
      it('Should render the tempalte editor page', function (done) {
        this.agent
          .get('/edit/template')
          .expect(200)
          .expect(/Template Editor/)
          .end(done);
      });
    });

    describe('GET /edit/users', function () {
      it('Should render the edit users page', function (done) {
        this.agent
          .get('/edit/users')
          .expect(200)
          .expect(/Username/)
          .expect(/Email/)
          .end(done);
      });
    });
  });



  after(function () {
    helper.clearDb();
  });


});