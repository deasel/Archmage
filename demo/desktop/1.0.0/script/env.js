define([], function(){


    var ENV = {
        env4dock: [{
            appName: 'browser',
            options: {
                fit: false,
                width: '800px',
                height: '400px'
            }
        }]
    };


    return {
        init: function(){
            if(window.localStorage){
                var env2str = localStorage.getItem('__ENV__') || JSON.stringify(ENV);
                localStorage.setItem('__ENV__', env2str);
            }
        },
        /**
         *
         * @returns {Object}
         */
        getENV: function(){
            return JSON.parse(localStorage.getItem('__ENV__'));
        }
    };
});