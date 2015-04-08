var app = require(__dirname + '/../../src/server/app').app;
var port = process.env.PORT || 3000;
app.listen(port);

module.exports = app;