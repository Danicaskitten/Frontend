var gulp = require('gulp'),
    tsify = require('tsify'),
    browserify = require('browserify'),
    config = require('./config'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    envify = require('envify/custom'),
    handleErrors = require('./handleErrors');


function compile(browserSync, watch, production) {


    var props = {
        entries: ['./' + config.src + 'main.ts'],
        debug: true,
        cache: {},
        packageCache: {}
    };

    if (watch) {
        props.plugin = [watchify, tsify];
    } else {
        props.plugin = [tsify];
    }

    var bundler = browserify(props);




    function rebundle() {



        if (production) {
            console.log(envify());
            var stream = bundler.transform('envify', { global: true, _: 'purge', NODE_ENV: 'production' }).bundle();
        } else {
            var stream = bundler.bundle();
        }

        return stream
            .on('error', handleErrors)
            .pipe(source('main.ts'))
            .pipe(buffer())
            .pipe(rename({
                extname: '.js'
            }))
            .pipe(gulp.dest('./' + config.dest))
            .pipe(uglify())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('./' + config.dest))
            .pipe(browserSync.stream());
    }
    bundler.on('update', function () {
        rebundle();
    });
    return rebundle();
}

module.exports = compile;