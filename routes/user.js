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
	if (req.session.permissions <= 2){
		res.status(403).send('You do not have the necessary permissions to save')
	} else {
		req.body.permissions = parseInt(req.body.permissions)
		db.users.count({},function(err,count){
			req.body.user_id = count + 1;
			db.users.insert(req.body,function(err){
				if (err) {
					res.status(500).send("Could not add User")
				} else {
					res.status(200).send("User Added")
				}
			})
		})
	}
}

exports.del = function(req,res){
	if (req.session.permissions <= 2){
		res.status(403).send('You do not have the necessary permissions to save')
	} else if (req.body.user_id == 1) {
		res.status(400).send('Cannot remove root user');
	} else {
		db.users.remove({user_id: req.body.user_id},function(err){
			if (err) {
				res.status(500).send("Could not delete user")
			} else {
				res.status(200).send("User Deleted")
			}
		})
	}
}

exports.changePass = function(req,res){
	if (req.session.permissions <= 2){
		res.status(403).send('You do not have the necessary permissions to save')
	} else {
		args = {
	        'query': {user_id: parseInt(req.body.user_id)},
	        'update': {$set: {pass: req.body.password}},
	        'upsert':false
	    }
	    db.users.findAndModify(args, function(err,result){
	        if (err) {
	            res.status(500).send('Error changing pass')
	        } else {
	            res.status(200).send('Pass Changed');
	        }
	    })
	}
}
exports.changeLevel = function(req,res){
	if (req.session.permissions <= 2){
		res.status(403).send('You do not have the necessary permissions to save')
	} else {
		args = {
	        'query': {user_id: parseInt(req.body.user_id)},
	        'update': {$set: {permissions: parseInt(req.body.permissions)}},
	        'upsert':false
	    }
	    db.users.findAndModify(args, function(err,result){
	        if (err) {
	            res.status(500).send('Error changing permissions level')
	        } else {
	            res.status(200).send('Permission Level Changed');
	        }
	    })
	}
}