/**
* load.js
* script to load up a database with dummy data
*/

var app = require('./../app').app;
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article= mongoose.model('Article');

var categories = ['Cat1', 'Cat2', 'Cat3']

var rand = Math.floor(Math.random() * 1000);

var user = new User({
  email: 'foobar' + rand + '@example.com',
  name: 'Foo bar ' + rand,
  username: 'foobar ' + rand,
  password: 'foobar ' + rand,
  permissions: 3
});

user.save(function (err) {
  if (err) throw err;
  
  async.times(30, function (id, next) {
    var article = new Article({
      title: 'Test Article Title' + id,
      url: 'test' + id,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio rem quae reprehenderit accusamus, est ducimus, nostrum dicta laudantium, et aliquid suscipit, repudiandae nulla. Dicta sed quaerat reprehenderit corrupti, rerum ex?',
      destination: 'articles',
      category: categories[id % 3],
      cssFiles: ['test.css'],
      createdBy: user,
      lastEditedBy: user
    });
    article.save(function (err) {
      if (err) throw err;
      console.log('done')
      process.exit(0);
    });
  });
})
