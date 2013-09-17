var fs = require('fs'),
	path = require('path');
var databaseUrl = "wato",
	collections = ["articles"],
	db = require("mongojs").connect(databaseUrl, collections);


fs.readdir("../customCMS/drafts",function(err,files){
	files.forEach(function(file){
		var filepath = "../customCMS/drafts/" + file
		if (path.extname(filepath) == '.json'){
			fs.readFile(filepath, function(err,content){
				var article = JSON.parse(content.toString());
				article.url = article.url.replace('.json','');
				article.fromFile = true;
				article.destination = 'drafts';
				delete article.html;
				article.css.forEach(function(css){
					if (css.file == 'newstyle.css') css.file = 'style.css';
				})
				console.log(article.url);
				db.articles.insert(article)
			})
		} else {
			console.log('not json');
		}
		
	})

})
fs.readdir("../customCMS/jsondocs",function(err,files){
	files.forEach(function(file){
		var filepath = "../customCMS/jsondocs/" + file
		if (path.extname(filepath) == '.json'){
			fs.readFile(filepath, function(err,content){
				var article = JSON.parse(content.toString());
				article.url = article.url.replace('.json','');
				article.fromFile = true;
				article.destination = 'articles';
				delete article.html;
				article.css.forEach(function(css){
					if (css.file == 'newstyle.css') css.file = 'style.css';
				})
				console.log(article.url);
				db.articles.insert(article)
			})
		} else {
			console.log('not json');
		}
		
	})

})