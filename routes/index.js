
/*
 * GET home page.
 */

var databaseUrl = "wato",
	collections = ["articles"],
	db = require("mongojs").connect(databaseUrl, collections);

exports.index = function(req, res){
	db.articles.find({destination: 'articles'}).sort({publishDate: -1}).limit(4,function(err,result){
		if (err) {
			res.render('503', result);
		} else if (!result){
			res.render('404', result);
		} else {
			res.render('index', { title: 'Ethernet Bucket',  list: result });
		}
	})
  
};