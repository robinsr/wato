/**
* load.js
* script to load up a database with dummy data
*/

var app = require('./../app').app;
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article= mongoose.model('Article');

var categories = ['Cat1', 'Cat2', 'Cat3'];

var destinations = ['articles', 'drafts', 'trash'];

var tags = ['tag1','tag2','tag3','tag4','tag5'];

var user;

async.series([

function (next) {
  async.parallel([
    function (cb) {
      User.collection.remove(cb)
    },
    function (cb) {
      Article.collection.remove(cb)
    }
  ], next);
},

function (next) {
  user = new User({
    email: 'foobar@example.com',
    name: 'Foo bar',
    username: 'foobar',
    password: 'foobar',
    permissions: 3
  });

  user.save(next)
},

function (next) {
  async.times(100, function (id, nextArticle) {
    var article = new Article({
      title: 'Test Article Title' + id,
      url: 'test' + id,
      content: '#Sed \r\n\r\n##ut \r\n\r\n### perspiciatis unde omnis\r\n\r\niste natus error sit voluptatem accusantium \r\n\r\n* doloremque \r\n* laudantium\r\n* totam\r\n\r\n[rem aperiam]() eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim [ipsam voluptatem quia voluptas]() sit aspernatur aut odit aut fugit, sed quia consequuntur **magni dolores eos qui ratione** voluptatem sequi nesciunt. Neque porro _quisquam est, qui dolorem ipsum quia_ dolor sit amet, consectetur\r\n\r\n![Lorem](http:\/\/placehold.it\/200x200)\r\n \r\n```\r\nadipisci velit, sed quia non numquam \r\n```\r\n\r\n`eius` modi `tempora` incidunt `ut labore et` dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem \r\n\r\n1. ullam corporis \r\n2. suscipit laboriosam\r\n\r\nnisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
      previewText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio rem quae reprehenderit accusamus, est ducimus, nostrum dicta laudantium, et aliquid suscipit, repudiandae nulla. Dicta sed quaerat reprehenderit corrupti, rerum ex?',
      destination: destinations[(Math.floor(Math.random() * 100) % 3)],
      category: categories[Math.floor(Math.random() * 100) % 3],
      tags: tags.filter(function () {
        return !(Math.floor(Math.random() * 100) % 3)
      }),
      cssFiles: ['style.css'],
      createdBy: user,
      lastEditedBy: user
    });
    article.save(nextArticle);
  }, next);
}


], function (err) {
  if (err) throw err;
  console.log('done. exiting');
  process.exit(0)
});
