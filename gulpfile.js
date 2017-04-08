'use strict';

var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    nodemon     = require('gulp-nodemon');

// we'd need a slight delay to reload browsers. connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'index.js', // nodemon our expressjs server
    watch: ['index.js'] // watch core server file(s) that require server restart on change
  })
  .on('start', function onStart() {
    // ensure start only got called once
    if (!called) { cb(); }
    called = true;
  })
  .on('restart', function onRestart() {
    // reload connected browsers after a slight delay
    setTimeout(function reload() {
      browserSync.reload({stream: false});
    }, BROWSER_SYNC_RELOAD_DELAY);
  });
});

gulp.task('browser-sync', ['nodemon'], function () { // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync.init({
    files: ['views/**/*.*', 'menu-files/**/*.*'], // watch the following files; changes will be injected (css & images) or cause browser to refresh
    proxy: 'http://localhost:4000', // informs browser-sync to proxy our expressjs app which would run at the following location
    port: 8080 // informs browser-sync to use the following port for the proxied app. notice that the default port is 3000, which would clash with our expressjs
  });
});

gulp.task('default', ['browser-sync']);