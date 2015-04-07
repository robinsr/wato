var fs = require('fs');
var utils = require('./../utils');

exports.load = function (req, res, next, id) {
	next();
}

exports.indexPage = function(req,res){
	utils.getMenuFileList(function(err, render_obj){
		res.render('auth/template', render_obj)
	})
}

exports.file = function(req,res){
	res.sendfile('./views/'+req.params.template_name);
}

exports.post = function(req, res){
	if (req.session.permissions <= 1){
		res.status(403).send('You do not have the necessary permissions to save')
	} else {
		fs.writeFile('./views/'+req.body.filename,req.body.content,function(err){
			if (err) {
				res.status(500).send('Error saving template')
			} else {
				res.send('Saved taemplate');
			}
		})
	}
}
exports.preview = function(req, res){
	if (!req.session){
		res.status(404).render('404');
	} else {
		fs.writeFile('./views/__preview.jade',req.body.content,function(err){
			if (err) {
				res.status(500).send('Error saving template')
			} else {
				res.send('Preview Ready');
			}
		})
	}
}

