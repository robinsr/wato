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
	db.articles.findOne({url: req.params.article_name},function(err,result){
		if (err) {
			res.status(503).render('503')
		} else if (!result){
			res.status(404).render('404');
		} else if (!req.session.user_id && result.destination != 'articles'){
			res.status(404).render('404');
		} else if (req.session.user_id && req.query.json == 'true'){
			res.send(result);
		} else  {
			result.pagetitle = result.title + " - " + req.wato_title;
			marked(result.content, opt, function (err,mk){
				if (err && !req.query.json)
				{
					res.status(503).render('503')
				} 

				else if (err && req.query.json == 'true') 
				{
					res.status(503).send()
				} 

				else if (!err && !req.query.json) 
				{
					result.content = mk;
					res.render(req.query.render || 'article', result);
				} 

				else if (!err && req.query.json == 'true') 
				{
					res.send({
						title: result.title,
						url: req.locals.location + "/article/" + result.url,
						content: mk,
						tags: result.tags,
						category: result.category
					});
				} 

				else 
				{
					res.status(400).send();
				}
			})	
		}
	})
}
			

// GET /article
exports.list = function(req, res){
	function returnResult(err,result){
		if (err) {
			res.send(503);
		} else if (!result){
			res.send(404);
		} else {
			var return_obj = []
			result.forEach(function(thisArt){
				if (thisArt.destination == 'articles'){
					return_obj.push({
						title: thisArt.title,
						tags: thisArt.tags,
						category: thisArt.category,
						previewText: thisArt.previewtext,
						location:  req.locals.location + "/article/" + thisArt.url,
						json: req.locals.location + "/article/" + thisArt.url + "?json=true"
					})
				}
			})
			res.send(200, return_obj);
		}
	}

	if (req.query.limit){
		console.log(req.query.limit)
		db.articles.find({destination: 'articles'}).sort({publishDate: -1}).limit(parseInt(req.query.limit),function(e,r){returnResult(e,r)})
	} else {
		db.articles.find({destination: 'articles'}).sort({publishDate: -1},function(e,r){returnResult(e,r)})
	}  
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