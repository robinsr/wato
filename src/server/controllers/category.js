var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var u = require("underscore");

exports.load = function (req, res, next, id) {
	var options = {
		criteria: {
			category: id,
			destination: 'articles'
		}
	};

	Article.list(options, function (err, articles) {
		if (err) return next(err);
		if (!articles) return next(new Error("No categories found"));
		req.articles = articles;
		next();
	});
}

// GET /category/:category_name
exports.list = function(req, res, next) {
	return res.render('public/category', {
		category: req.params.category_name,  
		list: req.articles
	});
};