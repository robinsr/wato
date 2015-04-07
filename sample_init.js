var wato = require('./src/server/app');

wato.init({
  title: "Wato",
  location: "http://wato.ethernetbucket.com",
  demo_mode: true
})
.start();
