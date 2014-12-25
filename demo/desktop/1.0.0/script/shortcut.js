define(['archmage'], function(am){

    var $D = am.dom,
        $E = am.event,

        //默认配置项
        _OPTION = {

        },
        _HANDLE;        //默认事件


    function domRedner(self){

    }

    function bindEvents(){

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