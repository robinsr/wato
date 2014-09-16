var path = require('path');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    wiredep: {
      options: {
        //cwd: path.join(process.cwd(),'src/client'),
      },
      app: {
        src: [
          'src/server/publicviews/**/*.jade'
        ],
        ignorePath: /\.\.\/\.\.\/client/
      }
    }
  });

  grunt.loadNpmTasks('grunt-wiredep');

  grunt.registerTask('default', ['wiredep:app']);

};