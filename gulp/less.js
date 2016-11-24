var less = require('gulp-less'),
    gulp = require('gulp'),
    stripCss = require('gulp-strip-css-comments'),
    minifyCss = require('gulp-minify-css'),    
    config = require('./config'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename');



function compile() {
    return gulp.src(config.less.src)
        .pipe(less())
        .pipe(concat(config.less.name))
        .pipe(gulp.dest(config.less.dest))
        .pipe(minifyCss())
        .pipe(stripCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(config.less.dest))
}

module.exports = compile;