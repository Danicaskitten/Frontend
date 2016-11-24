module.exports = {
    tags: {
        src: 'src/tags'
    },
    cordova:{
        src:'src/cordova/**/*',
        dest: 'www/'
    },
    less: {
        src: ['src/less/index.less'],
        name: 'bundle.css',
        dest: 'www/'
    },
    src: 'src/',
    dest: 'www/'
}