//暴露函数
module.exports = function(grunt){
    //配置内容
    grunt.initConfig({

        //读取package.json信息
        pkg : grunt.file.readJSON('package.json'),


    });

    grunt.registerTask('default', []);
};