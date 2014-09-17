/**
 * Module dependencies.
 */
 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
/**
 * Getters
 */
 
var getTags = function (tags) {
  return tags.join(',');
};
 
/**
 * Setters
 */
 
var setTags = function (tags) {
  return tags.split(',');
};
 
/**
 * Article Schema
 */
 
var ArticleSchema = new Schema({
  title: {type : String, default : '', trim : true},
  body: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }],
  tags: {type: [], get: getTags, set: setTags},
  image: {
    cdnUri: String,
    files: []
  },
  createdAt  : {type : Date, default : Date.now}
});
 
/**
 * Validations
 */
 
ArticleSchema.path('title').required(true, 'Article title cannot be blank');
ArticleSchema.path('body').required(true, 'Article body cannot be blank');
 
/**
 * Pre-remove hook
 */
 
ArticleSchema.pre('remove', function (next) {
  next();
});
 
/**
 * Methods
 */
 
ArticleSchema.methods = {
 

 
  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */
 
  addComment: function (user, comment, cb) {
    var notify = require('../mailer');
 
    this.comments.push({
      body: comment.body,
      user: user._id
    });
 
    if (!this.user.email) this.user.email = 'email@product.com';
    notify.comment({
      article: this,
      currentUser: user,
      comment: comment.body
    });
 
    this.save(cb);
  },
 
  /**
   * Remove comment
   *
   * @param {commentId} String
   * @param {Function} cb
   * @api private
   */
 
  removeComment: function (commentId, cb) {
    var index = utils.indexof(this.comments, { id: commentId });
    if (~index) this.comments.splice(index, 1);
    else return cb('not found');
    this.save(cb);
  }
}
 
/**
 * Statics
 */
 
ArticleSchema.statics = {
 
  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */
 
  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .populate('comments.user')
      .exec(cb);
  },
 
  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */
 
  list: function (options, cb) {
    var criteria = options.criteria || {}
 
    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
}
 
mongoose.model('Article', ArticleSchema);