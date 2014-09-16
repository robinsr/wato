/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, path = require('path')
    , config = require(__dirname + "/config/config")
    , app = express();

// express settings
require('./config/express')(app, config);
// express routes
require('./config/routes')(app);


if (process.argv[2] == '-install'){
    //auth.createRoot();
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// expose app
exports = module.exports = app