var app = require(__dirname + '/../../src/server/app');
var path = require('path');

app.init({
  title: 'Test App',
  appRoot: path.resolve(__dirname, '../../')
}, {
  cssPath: 'test/server/fixtures/css',
  viewsPath: 'sample_resources/view'
});

app.start();

module.exports = app;