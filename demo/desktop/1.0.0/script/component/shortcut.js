define(['archmage', 'apps/app'], function(am, Application){

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
                    Factory = appConfig.constructor;
                new Factory(appConfig.options);
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