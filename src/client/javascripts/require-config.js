requirejs.config({
  baseUrl: '/javascripts/',
  paths: {
    jquery: '../components/jquery/dist/jquery.min',
    ko: '../components/knockout/dist/knockout',
    lodash: '../components/lodash/lodash.min',
    codemirror: '../components/requirejs-codemirror/src/code-mirror'
  },
  cm: {
    // baseUrl to CodeMirror dir
    baseUrl: '../components/codemirror/',
    // path to CodeMirror lib
    path: 'lib/codemirror',
    // path to CodeMirror css file
    css: '../components/codemirror/lib/codemirror.css',
    modes: {
      // modes dir structure
      path: 'mode/{mode}/{mode}'
    }
  }
});