var app = require(__dirname + '/../../src/server/app');

app.init({
  title: 'Test App'
}, {
  cssPath: 'test/server/fixtures/css'
});

app.start();

module.exports = app;