var gulp = require('gulp'),
    through2 = require('through2'),
    path = require('path'),
    riot = require('riot'),
    jsesc = require('jsesc'),
    gutil = require('gulp-util'),
    File = require('vinyl'),
    handleErrors = require('./handleErrors');

function cleanTags() {

    function string_src(filename, string) {
        var src = require('stream').Readable({ objectMode: true });
        src._read = function () {
            this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
            this.push(null);
        }
        return src;
    }

    var content = '/*** This file is auto-generated. ***/\n\nexport var precompiledTags: {[fileName: string]: { tagName: string, html: string, css: string, attribs: string, js: string } } = { };\n\n';
    return string_src('compiledTags.ts', content)
        .pipe(gulp.dest('src/'));
}

function tagsBuild(fileName) {
    var firstFile;

    return through2.obj(function (file, enc, callback) {
        try {

            var content;

            function compile(content) {

                var compiledTag = riot.compile(content);

                var compiled = [];

                compiledTag.match(/'(.*?)',/g).forEach(function (value) {
                    compiled.push(jsesc(value.replace("',", "").replace("'", "")));
                });

                return 'precompiledTags["' + compiled[0] + '"] = { tagName: \'' + compiled[0] + '\', html: \'' + compiled[1] + '\', css: \'' + compiled[2] + '\', attribs: \'' + compiled[3] + '\', js: \'\' }\n\n';
            }

            if (!firstFile) {
                content = file.contents.toString(enc);
                var comment = '/*** This file is auto-generated. ***/\n\n';
                var pre = 'export var precompiledTags: {[fileName: string]: { tagName: string, html: string, css: string, attribs: string, js: string } } = { };\n\n';
                content = comment + pre + compile(content);
                file.contents = new Buffer(content, enc);
                firstFile = file;
                callback();
                return;
            } else {
                content = file.contents.toString(enc);
                content = compile(content);
                file.contents = new Buffer(content, enc);
                firstFile.contents = Buffer.concat([
                    firstFile.contents,
                    file.contents
                ]);
                callback();
            }

        } catch (error) {
            callback(error, null);
        }
    }, function (callback) {
        firstFile.path = path.join(firstFile.base, fileName);
        this.push(firstFile);
        callback();
    });
}

function compileTags() {
    return gulp.src('src/tags/**/*.html')
        .pipe(tagsBuild('compiledTags.ts'))
        .pipe(gulp.dest('src/'))
        .on('error', handleErrors);
}

module.exports = {
    compile: compileTags,
    clean: cleanTags
}