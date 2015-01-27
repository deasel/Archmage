define(['archmage', 'apps/app', 'memory'], function(am, Application, Memory){

    var $D = am.dom,
        $E = am.event,

        //默认配置项
        _OPTION = {
//            appName: 'browser',
//            el: HTMLElement,
//            options: {}           //app配置参数
        },
        _HANDLE = {
            click: function(event){
                var appConfig = this.options,
                    appName = appConfig.appName,
                    Factory = appConfig.constructor;

                //判断当前app在“内存”中是否已经存在，若已存在，则直接显示
                //  若不存在，则重新创建
                if(Memory.check(appName)){
                    
                }

                new Factory(am.extend(appConfig.options, {
                    // model: 'shortcut',
                    isActive: true
                }));
            }
        };


    function domRedner(self){
        var opts = self.options,
            el = self.el,
            appName = opts.appName,
            appConfig = Application[appName].prototype.__config__;

        el.innerHTML = [
            '<img class="shortcut-icon" src="' + appConfig.icon + '" />',
            '<span class="shortcut-status"></span>'
        ].join('');

        el.setAttribute('title', appConfig.desc);
    }

    function bindEvents(self){
        var opts = self.options;

        $E.on(self.el, 'click', am.bind(_HANDLE.click, self));
    }

    return am.Class({
        init: function(options){
            var self = this;

            self.el = options.el;
            delete options.el;

            self.options = am.extend({
                constructor: Application[options.appName]
            }, _OPTION, options);

            domRedner(self);
            bindEvents(self);
        }
    });
});