var path = require('path');
var fs = require('fs');	

/*
 * GET CSS.
 */

exports.post = function(req, res, next) {
  var uri = path.resolve(res.locals.cssPath, req.body.filename);

	fs.writeFile(uri, req.body.content, function (err) {
		if (err) {
			return next(err);
		}

		res.status(200).send();
	});
}

exports.list = function (req, res, next) {
  fs.readdir(res.locals.cssPath, function (err, files) {
    if (err) {
      return next(err);
    }

    res.status(200).json(files.map(function (file) {
      return path.basename(file);
    }));
  });
}
