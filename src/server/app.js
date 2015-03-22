/**
* Module dependencies.
*/

var express = require('express')
  , http = require('http')
  , path = require('path')
  , config = require(__dirname + '/config/config')
  , mongoose = require('mongoose')
  , fs = require('fs')
  , app = express();

console.log("NODE_ENV " + process.env.NODE_ENV);

// Bootstrap db connection
// Connect to mongodb
var connect = function() {
  console.log("mongo url: " + config.db);
  var options = {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  }
  mongoose.connect(config.db, options)
}
connect()

// Error handler
mongoose.connection.on('error', function(err) {
  console.log(err)
})

// Reconnect when closed
mongoose.connection.on('disconnected', function() {
  console.log("mongo disconnected. Reconnecting.")
  connect()
})

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function(file) {
  console.log("loading model " + file);
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

// express settings
require('./config/express')(app, config);
// express routes
require('./config/routes')(app);


if (process.argv[2] == '-install'){
//auth.createRoot();
}

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port');

// expose app
exports = module.exports = app