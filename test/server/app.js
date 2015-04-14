var app = require(__dirname + '/../../src/server/app');

app.init({
  title: 'Test App'
}, {
  cssPath: 'test/server/fixtures/css',
  viewsPath: 'sample_resources/view'
});

app.start();

module.exports = app;