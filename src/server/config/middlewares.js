
exports.article = {};
exports.article.auth = function (req, res, next){
  if (req.session.permissions <= 1){
    return res.status(403).send('You do not have the necessary permissions to save')
  }
  next();
}