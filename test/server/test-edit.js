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

  describe('/edit/article', function () {
    describe('not logged in', function () {
      it('Should redirect to the edit index page (login)', function (done) {
        this.agent
          .get('/edit/article')
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });
    });

    describe('logged in', function () {
      before(function (done) {
        // login the user
        this.agent
          .post('/users/session')
          .field('username', 'foobar')
          .field('password', 'foobar')
          .end(done)
      });

      it('Should render the article editor page', function (done) {
        this.agent
          .get('/edit/article')
          .expect(200)
          .expect(/draftcolumn/)
          .end(done);
      });
    });
  });



  after(function () {
    helper.clearDb();
  });


});