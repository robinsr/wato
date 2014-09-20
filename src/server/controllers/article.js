var mongoose = require('mongoose');
var Article = mongoose.model('Article');

/*
 * GET article.
 */

var utils = require(__dirname+ '/../utils'),
	config = require(__dirname + '/../sample_config'),
	db = utils.db,
	u = require("underscore"),
	objectid = require('mongodb').ObjectID,
	moment = require('moment'),
	async = require('async'),
	marked = require('marked'),
	opt = {
	  gfm: true,
	  tables: true,
	  breaks: true,
	  pedantic: false,
	  smartLists: true,
	  langPrefix: 'language-',
	  highlight: function(code,lang) {
  		return code
	  }
	}


// GET /auth/article
exports.articleEditor = function (req,res){
	utils.getMenuFileList(function(err,render_obj){
		if (err) {
			res.render('auth/error')
		} else {
			render_obj.login = true; 
			render_obj.article_editor = true;
			render_obj.today = moment().utc().format("YYYY-MM-DD")
			res.render('auth/article', render_obj);
		}
	});
}

// GET /auth/all
exports.allArticles = function (req,res){
	utils.getAllFiles(function(err,render_obj){
		if (err) {
			res.render('auth/error')
		} else {
			render_obj.login = true; 
			render_obj.article_editor = true;
			res.render('auth/all', render_obj);
		}
	});
}

// GET /article/:article_name
exports.single = function(req, res){
	Article.load(req.params.article_name, function (err, article) {
		if (err) return res.render('503', err);
		if (!article) return res.render('404');
		return res.render('article',article)
	});
}

exports.singleJson = function (req, res) {
	Article.loadSafe(req.params.article_name, function (err, article) {
		if (err) return res.render('503', err);
		if (!article) return res.render('404');
		return res.send(article);
	});
}
			

// GET /api/article - gets list of articles in JSON
exports.list = function(req, res){
	var options = {
		//TODO: Expand usable query param options
		criteria: {
			destination: 'articles'
		},
		perPage: req.query.limit || 15,
		page: req.query.page || 0
	};

	Article.listSafe(options, function (err, articles) {
		if (err) return res.render('503', err);
		return res.send(articles);
	});
};

// GET /allarticles
exports.all = function(req, res){
	db.articles.find({destination: 'articles'}).sort({publishDate: -1},function(err,result){
		if (err) {
			res.render('503', { message: err.toString() })
		} else if (!result){
			res.render('404')
		} else {
			res.render('allarticles', { list:  u.filter(result, function(thisArt){return thisArt.category != 'dnd'}),
			title: "All Articles - "+req.wato_title});
		}
	})
}

// POST /article
exports.save = function(req,res){
	if (req.session.permissions <= 1){
		res.status(403).send('You do not have the necessary permissions to save')
	} else {
		req.body._id = req.body._id ? new objectid(req.body._id) : new objectid();
		req.body.lastEdit = req.session.user_id;
		req.body.saveDate = moment().utc().format("YYYY-MM-DD");
		args = {
            'query': {_id: req.body._id},
            'update': req.body,
            'upsert':true
        }
        console.log(args.query)
        db.articles.findAndModify(args, function(err,result){
            if (err) {
                res.status(500).send('Error Saving Article')
            } else {
                res.status(200).send(req.body._id.toString());
            }
        })
	}
}

// PUT /article
exports.preview = function(req, res){
	delete req.body._id;
	req.body.url = "__preview";
	req.body.category = "dnd";
	req.body.destination = "preview";
	args = {
        'query': {url: req.body.url},
        'update': req.body,
        'upsert':true
    }
    console.log(args.query)
    db.articles.findAndModify(args, function(err,result){
        if (err) {
        	console.log(err);
            res.status(500).send('Error Saving Article')
        } else {
            res.status(200).send('Preview ready');
        }
    })
}

// DELETE /article
exports.del = function(req,res){
	if (req.session.permissions <= 1){
		res.status(403).send('You do not have the necessary permissions to save')
	} else {
		var articleId = new objectid(req.body._id)
		db.articles.remove({_id: articleId},function(err){
			if (err) {
				res.status(500).send("Could not delete articles")
			} else {
				res.status(200).send("Article Deleted")
			}
		})
	}
}

// GET /__template (special route for previewing a template with the data from a specific article)
exports.templatePreview = function(req, res){
	console.log(req.query.previewFile);
	if (!req.session){
		res.status(404).render('404');
	} else {
		db.articles.findOne({url: req.query.previewFile},function(err,result){
			result.title = result.title + " - " + req.wato_title;
			marked(result.content, opt, function (err,mk){
				if (err){
					console.log('error')
				} else {
					result.content = mk;
					res.render('__preview', result);
				}
			})	
		})
	}
}