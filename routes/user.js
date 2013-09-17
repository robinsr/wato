var databaseUrl = "wato",
	collections = ["articles","users"],
	db = require("mongojs").connect(databaseUrl, collections),
	async = require('async'),
	utils = require('./../utils');

exports.index = function(req,res){
	var files;
	var users;
	async.parallel([
	function(cb){
		utils.getMenuFileList(function(err,_files){
			if (err){
				cb('error');
			} else {
				files = _files
				cb(null)
			}
		})
	},
	function(cb){
		db.users.find({permissions: {$lte: req.session.permissions}},function(err,result){
			if (err){
				cb('error')
			} else {
				users = result
				cb()
			}
		})
	}
	],
	function(err){
		if (err) {
			res.render('auth/error')
		} else {
			console.log(users)
			console.log(files)
			res.render('auth/user', {files: files, users: users, login:true})
		}
	})	
}

exports.add = function(req,res){

	db.users.count(function(err,result){
		console.log(result)
	})
	res.send()
}

exports.remove = function(){}

exports.changePass = function(){}
exports.changeLevel = function(){}