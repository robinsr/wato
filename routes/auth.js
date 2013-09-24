
/*
 * GET auth.
 */

var databaseUrl = "wato",
	collections = ["articles","users"],
	db = require("mongojs").connect(databaseUrl, collections),
	async = require('async'),
	moment = require('moment'),
	utils = require('./../utils');

// authentication for authors
exports.checkSession = function(req, res, next) {
	if (!req.session || !req.session.user_id) {
		req.session.error = "You are not authorized to view this page";
		res.redirect('/auth/');
	} else {
		next();
	}
}
exports.login = function (req,res){
	db.users.findOne({name: req.body.username},function(err,result){
		if (err){
			res.render('auth/error')
		} else if (!result) {
			req.session.error = "User not found";
			res.redirect('/auth/');
		} else if (result.pass == req.body.password){
			console.log('checks out')
			req.session.user_id = result.user_id;
			req.session.permissions = result.permissions;
			res.redirect('/auth/article');
		} else {
			req.session.error = "Incorrect Username or Password";
			res.redirect('/auth/');
		}
	})
}
exports.logout = function(req,res){
	req.session.user_id = null
	req.session.error = "You've been logged out";
	res.redirect('/auth/');
}


// pages
exports.index = function(req, res){
	utils.getMenuFileList(function(err,render_obj){
		render_obj.login = false;
		if (err) {
			res.render('auth/error')
		} else {
			if (req.session && req.session.error){
				render_obj.error = req.session.error
				res.render('auth/index',render_obj);
			} else {
				res.render('auth/index',render_obj);
			}
		}
	})
}


exports.article = function (req,res){
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

