var wato = require('./src/server/app');

wato.init({
  title: "Wato",
  location: "http://wato.ethernetbucket.com",
  demo_mode: true
}, {
  cssPath: 'sample_resources/css',
  viewsPath: 'sample_resources/view'
})
.start();
