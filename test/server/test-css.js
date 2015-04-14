/**
* Test Dependencies
*/
var test = require('./index');
var should = require('should');
var supertest = require('supertest');
var fs = require('fs');
var path = require('path');

describe('CSS', function() {
  
  test.mount();

  before(function (done) {
    this.agent = supertest.agent(this.app);

    this.agent
      .post('/users/session')
      .field('username', 'foobar')
      .field('password', 'foobar')
      .end(done);
  });

  describe('GET /css', function () {
    it('should list the css files in the fixtures dir', function (done) {
      this.agent
        .get('/css')
        .expect(200)
        .expect(/\["sample\.css"\]/)
        .end(done)
    })
  });

  describe('POST /css', function () {
    it('Should update the css file on disk', function (done) { 
      this.agent
        .post('/css')
        .send({
          filename: 'sample.css',
          content: 'Updated content'
        })
        .expect(200)
        .end(done)
    });

    it('verifies the file change', function (done) {
      this.agent
        .get('/stylesheets/sample.css')
        .expect(200)
        .expect(/Updated content/)
        .end(done);
    });
  });

  after(function (done) {
    var uri = path.resolve(__dirname, 'fixtures/css/sample.css');
    fs.writeFile(uri, '/* Original CSS Content */', done);
  })
});