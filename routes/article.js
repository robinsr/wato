
/*
 * GET article.
 */

var databaseUrl = "wato",
	collections = ["articles"],
	db = require("mongojs").connect(databaseUrl, collections),
	u = require("underscore"),
<<<<<<< HEAD
	objectid = require('mongodb').ObjectID;
=======
	objectid = require('mongodb').ObjectID,
	moment = require('moment');
>>>>>>> 9915b53cb02c2f5de0769a4dc2b9da1b038c4110

exports.single = function(req, res){
	db.articles.findOne({url: req.params.article_name},function(err,result){
		if (err) {
			res.status(503).render('503')
		} else if (!result){
			res.status(404).render('404');
		} else if (!req.session.user_id && result.destination != 'articles'){
			res.status(404).render('404');
		} else if (req.session.user_id && req.query.json == 'true'){
			res.send(200, result);
		} else {
			res.render('article', result);
		}
	})
}
exports.list = function(req, res){
	db.articles.find({},function(err,result){
		if (err) {
			res.send(503);
		} else if (!result){
			res.send(404);
		} else {
			var return_obj = []
			result.forEach(function(thisArt){
				console.log(thisArt)
				if (thisArt.destination == 'articles'){
					return_obj.push({
						title: thisArt.title,
						tags: thisArt.tags,
						category: thisArt.category,
						previewText: thisArt.previewtext,
						url: thisArt.url
					})
				}
			})
			res.send(200, return_obj);
		}
	})  
};
exports.all = function(req, res){
	db.articles.find({destination: 'articles'}).sort({publishDate: -1},function(err,result){
		if (err) {
			res.render('503')
		} else if (!result){
			res.render('404')
		} else {
			res.render('allarticles', { list:  u.filter(result, function(thisArt){return thisArt.category != 'dnd'}) });
		}
	})
}

exports.save = function(req,res){
	if (req.session.permissions <= 1){
		res.status(403).send('You do not have the necessary permissions to save')
	} else {
		req.body._id = req.body._id ? new objectid(req.body._id) : new objectid();
		req.body.lastEdit = req.session.user_id;
<<<<<<< HEAD
=======
		req.body.saveDate = moment().utc().format("YYYY-MM-DD");
>>>>>>> 9915b53cb02c2f5de0769a4dc2b9da1b038c4110
		args = {
            'query': {_id: req.body._id},
            'update': req.body,
            'upsert':true
        }
        console.log(args.query)
        db.articles.findAndModify(args, function(err,result){
            if (err) {
                res.status(500).send('Error Saving Article')
<<<<<<< HEAD
                return
            } else {
                res.status(200).send(req.body._id.toString());
                return
            }
        })
=======
            } else {
                res.status(200).send(req.body._id.toString());
            }
        })
	}
}
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
>>>>>>> 9915b53cb02c2f5de0769a4dc2b9da1b038c4110
	}
}
exports.preview = function(req, res){
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
            res.status(500).send('Error Saving Article')
            return
        } else {
            res.status(200).send(req.body._id.toString());
            return
        }
    })
}
exports.del = function(req,res){

}