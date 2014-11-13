var gulp = require('gulp');
var bower = require('gulp-bower');
var server = require('gulp-express');

gulp.task('default', function() {
  return bower()
    .pipe(gulp.dest('public/bower_components'));
});

gulp.task('server', function () {
    //start the server at the beginning of the task
    gulp.start('default');

    server.run({
        file: 'bin/www'
    });

    //restart the server when file changes
    gulp.watch(['views/**/*.jade'], [server.run]);
    gulp.watch(['public/css/**/*.css'], server.notify);
    //gulp.watch(['public/javascripts/**/*.js'], ['jshint']);
    gulp.watch(['public/images/**/*'], server.notify);
    gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
});
