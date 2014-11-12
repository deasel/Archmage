//暴露函数
module.exports = function (grunt) {
    //可以在这里配置需要打包的模块，在删减的时候，最好不要破坏合并顺序
    var modules = ['base', 'type', 'browser', 'cookie', 'http', 'platform', 'support', 'event', 'dom', 'animation', 'util'];

    for(var i = 0, len = modules.length; i < len; i++){
        modules[i] = 'src/am.' + modules[i] + '.js';
    }

    //配置内容
    grunt.initConfig({

        //读取package.json信息
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            combine: {
                files: [{
                    src: modules,
                    dest: 'dest/<%= pkg.name %>-<%= pkg.version %>.js'
                }]
            }
        },
        jshint: {
            all: ['src/*.js']
        },
        uglify: {
            my_target: {
                files: {
                    'dest/<%= pkg.name %>-<%= pkg.version %>.min.js': ['dest/<%= pkg.name %>-<%= pkg.version %>.js']
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat', 'uglify']);

    grunt.registerTask('jshint', ['jshint']);

};