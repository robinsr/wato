
/*
 * GET article.
 */

var databaseUrl = "wato",
	collections = ["articles"],
	db = require("mongojs").connect(databaseUrl, collections),
	u = require("underscore");

exports.list = function(req, res){
	db.articles.find({category: req.params.category_name}).sort({publishDate: -1},function(err,result){
		if (err) {
			res.render('503', result);
		} else if (!result){
			res.render('404', result);
		} else {
			console.log(result);
			res.render('category', {category: req.params.category_name,  list: u.filter(result, function(thisArt){return thisArt.destination == 'articles'}) });
		}
	})
};