var gulp = require('gulp'),
    config = require('./config'),
    tags = require('./tags'),
    del = require('del');

function clean(){
    tags.clean();
    return del.sync(config.dest + '/**');
}

module.exports = clean;

