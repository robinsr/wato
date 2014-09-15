/*
 * GET CSS.
 */

var fs = require('fs');	

exports.indexPage = function(req,res){
	res.send()
}

exports.post = function(req, res){
	fs.writeFile('../public/stylesheets/'+req.body.fileName,req.body.contents,function(err){
		if (err) {
			res.status(500).send('Error saving CSS')
		} else {
			res.send('Saved CSS');
		}
	})
}
