var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    ts = require('./gulp/ts'),
    config = require('./gulp/config'),
     less = require('./gulp/less'),
    tags = require('./gulp/tags'),
    clean = require('./gulp/clean')
    runSequence = require('run-sequence'),
    handleErrors = require('./gulp/handleErrors');



gulp.task('build', function (cb) {
    return runSequence('clean', ['ts','tags','less','copy-cordova-files'], cb);
});

gulp.task('copy-cordova-files', function(cb){
    gulp.src(config.cordova.src).pipe(gulp.dest(config.cordova.dest));
});


gulp.task('watch', function (cb) {

    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    runSequence('clean', ['less','ts-watch', 'tags'], cb);


    try {
        gulp.watch(config.tags.src + '/**/*.html', ['less','tags']);
    } catch (err) {
        handleErrors(err);
    }

});

gulp.task('less',  function () {
    return less();
});

gulp.task('clean', function () {
    return clean();
});

gulp.task('ts-watch', ['tags'], function () {
    return ts(browserSync, true, false);
});

gulp.task('ts', ['tags'], function () {
    return ts(browserSync, false, false);
});

gulp.task('tags', function () {
    return tags.compile();
});