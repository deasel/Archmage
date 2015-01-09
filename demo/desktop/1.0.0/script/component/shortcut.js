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
            click: function(){
                this;
                debugger;
            }
        };


    function domRedner(self){
        var opts = self.options,
            el = opts.el,
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

        $E.on(opts.el, 'click', am.bind(_HANDLE['click'], self));
    }

    return am.Class({
        init: function(options){
            var self = this;

                self.options = am.extend({}, _OPTION, options);

            domRedner(self);
            bindEvents(self);
        }
    });
});