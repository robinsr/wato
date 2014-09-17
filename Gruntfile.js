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
    },
    watch: {
      app: {
        files: ['src/**/*.js'],
        tasks: ['wiredep:app']
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'src/server/app.js',
        options: {
          env: {
            NODE_ENV: 'development'
          }
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent')

  grunt.registerTask('default', ['wiredep:app', 'watch:app']);
  grunt.registerTask('server:dev', ['concurrent:dev']);

};