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

// Bootstrap db connection
// Connect to mongodb
var connect = function() {
  var options = {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  }
  mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/test', options)
}
connect()

// Error handler
mongoose.connection.on('error', function(err) {
  console.log(err)
})

// Reconnect when closed
mongoose.connection.on('disconnected', function() {
  connect()
})

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function(file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

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