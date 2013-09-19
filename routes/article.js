
/*
 * GET article.
 */

var databaseUrl = "wato",
	collections = ["articles"],
	db = require("mongojs").connect(databaseUrl, collections),
	u = require("underscore");

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

exports.post = function(req,res){
	//db.article.insert()
	console.log(req.body);
}