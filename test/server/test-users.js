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

describe('User', function() {
  
  test.mount();

  before(function () {
    this.agent = supertest.agent(this.app);
  });

  describe('POST /users/sessions', function () {
    it('Should log in a user', function (done) { 
      done();
    });
  });

  describe('POST /users', function () {
    it('Should create a user, login, and redirect', function (done) {
      this.agent
        .post('/users')
        .send({
          email: 'test-post-create@example.com',
          name: 'Foo bar',
          username: 'foobar',
          password: 'foobar',
          permissions: 3
        })
        .expect(302)
        .expect('Location', '/edit/article')
        .end(function (err) {
          should.not.exist(err);

          User.findOne({ email: 'test-post-create@example.com' }, function (err, user) {
            should.not.exist(err);
            should.exist(user);
            done()
          });
        });
    });
  });

  describe('GET /logout', function () {
    it('should logout and redirect to edit', function (done) {
      this.agent
        .get('/logout')
        .expect(302)
        .expect('Location', '/login')
        .end(done)
    });

    it('Verifies session is no longer valid', function (done) {
      this.agent
        .get('/edit/article')
        .expect(302)
        .expect('Location', '/login')
        .end(done)
    });
  });

  after(function () {
    helper.clearDb();
  });


});