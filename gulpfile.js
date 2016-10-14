'use strict';

var gulp = require('gulp');
var props2json = require('gulp-props2json');

gulp.task('default', function () {
    gulp.src('src/*.properties')
        .pipe(props2json())
        .pipe(gulp.dest('dist/'));

});