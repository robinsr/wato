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

  before(function (done) {
    this.agent = supertest.agent(this.app);
    helper.clearDb(done);
  });

  describe('GET /login', function () {
    describe('Admin user does not exist', function () {
      it('should render the welcome page, prompt to create admin', function (done) {
        this.agent
          .get('/login')
          .expect(200)
          .expect(/Create a admin account/i)
          .end(done)
      });
    });

    describe('Admin user exists', function () {
      before(function (done) {
        var user = new User({
          email: 'adminUser@example.com',
          name: 'Admin User',
          username: 'admin',
          password: 'foobar',
          permissions: 3
        });
        user.save(done)
      });

      it('should render the regular login page', function (done) {
        this.agent
          .get('/login')
          .expect(200)
          .expect(/Login/i)
          .end(done)
        });
    });
  });

  describe('POST /users/session', function () {
    it('Should log in a user and get a session cookie', function (done) { 
      this.agent
        .post('/users/session')
        .field('username', 'foobar')
        .field('password', 'foobar')
        .expect('Set-Cookie', /express:sess/)
        .end(done)
    });

    after(function (done) {
      this.agent.get('/logout').end(done);
    });
  });

  describe('POST /users/createRoot', function () {
    it('Should create a user, login, and redirect', function (done) {
      this.agent
        .post('/users/createRoot')
        .send({
          email: 'test-post-create-root@example.com',
          name: 'Foo bar',
          username: 'foobar',
          password: 'foobar'
        })
        .expect(302)
        .expect('Location', '/edit/article')
        .end(function (err) {
          should.not.exist(err);

          User.findOne({ email: 'test-post-create-root@example.com' }, function (err, user) {
            should.not.exist(err);
            should.exist(user);
            user.permissions.should.equal(3);
            done()
          });
        });
    });
  });

  describe('POST /users', function () {
    it('should create a user', function (done) {
      this.agent
        .post('/users/createRoot')
        .send({
          email: 'test-post-create@example.com',
          name: 'Foo bar 1',
          username: 'foobar1',
          password: 'foobar1',
          permissions: 0
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
  })

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