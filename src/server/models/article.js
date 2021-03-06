/**
 * Module dependencies.
 */
 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var marked = require('marked');
var async = require('async');

var markedOptions = {
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    smartLists: true,
    highlight: function(code, lang) {
      return require('highlight.js').highlightAuto(code).value;
    }
  }
 
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
  title: {
    type: String,
    default: '',
    trim: true
  },
  url: {
    type: String,
    default: '',
    trim: true,
    unique: true,
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  //author: {type : Schema.ObjectId, ref : 'User'},
  category: {
    type: String,
    default: ''
  },
  hideTitle: {
    type: Boolean,
    default: false
  },
  previewText: {
    type: String,
    default: ''
  },
  headertags: {
    type: String,
    default: ''
  },
  destination: {
    type: String,
    enum: ['articles', 'drafts', 'trash', 'preview'],
    default: 'drafts'
  },
  cssFiles: {
    type: [],
    default: []
  },
  comments: [{
    body: {
      type: String,
      default: ''
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: {
    type: []
  },
  image: {
    cdnUri: String,
    files: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type : Schema.ObjectId, 
    ref : 'User'
  },
  lastEditedBy : {
    type : Schema.ObjectId, 
    ref : 'User'
  }
});

/**
 * safe fields
 */
var safeFields = [
    'category',
    'content',
    'cssFiles',
    'destination',
    'json',
    'location',
    'previewText',
    'tags',
    'title',
    'url'
].join(' ');
/**
 * Adds a full url to retrieve this article
 */
ArticleSchema.virtual('location')
  .set(function () {
    return '/article/' + this.url
  });

/**
 * Adds the web api url 
 */
ArticleSchema.virtual('json')
  .set(function() {
    return '/article/' + this.url + '?json=true'
  });

/**
 * Validations
 */
 
ArticleSchema.path('title').required(true, 'Article title cannot be blank');
ArticleSchema.path('content').required(true, 'Article content cannot be blank');
 
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
   * get markup 
   */
  getMarkup: function (cb) {
    marked(this.content, markedOptions, cb);
  },
 
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
 
  load: function (criteria, cb) {
    this.findOne(criteria)
      .populate('createdBy', 'name username')
      .populate('lastEditedBy', 'name username')
      .exec(cb);
  },

  loadSafe: function (criteria, cb) {
    this.findOne(criteria)
      .select(safeFields)
      .populate('createdBy', 'name username')
      .populate('lastEditedBy', 'name username')
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
      .select(options.select)
      .populate('createdBy', 'name username')
      .populate('lastEditedBy', 'name username')
      .sort({'publishDate': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  },

  listSafe: function (options, cb) {
    var criteria = options.criteria || {}
 
    this.find(criteria)
      .select(safeFields)
      .populate('createdBy', 'name username')
      .populate('lastEditedBy', 'name username')
      .sort({'publishDate': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(function (err, articles) {
        if (err) return cb(err);

        async.each(articles, function (article, nextArticle) {
          article.getMarkup(function (err, markup) {
            if (err) return nextArticle(err);
            article.content = markup;
            nextArticle(null);
          });
        }, function (err) {
          cb(err, articles);
        });
      });
  },

  getCategories: function (next) {
    this.find().distinct('category').exec(next);
  }
}
 
mongoose.model('Article', ArticleSchema);