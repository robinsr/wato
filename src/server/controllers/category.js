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
exports.getByName = function(req, res, next) {
	return res.render(res.locals.viewsPath + '/category', {
		category: req.params.category_name,  
		articles: req.articles
	});
};

// GET /category
exports.list = function (req, res, next) {
	Article.getCategories(function (err, categories) {
		if (err) return next(err);
		return res.status(200).json(categories);
	})
}