define(['archmage'], function(am){
    var timer,
        WEEK = '一二三四五六日'.split('');

    function domRender(self){
        var date = new Date(),
            el = self.options.el;

        //year
        el.innerHTML = [
            date.getFullYear() + '-',           //year
            (date.getMonth() + 1) + '-',        //month
            date.getDate() + ' ',               //day
            '星期' + WEEK[date.getDay()] + ' ',
            (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':',
            (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()) + ':',
            date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
        ].join('');
    }

    function bindEvents(self){
        if(timer){
            clearInterval(timer);
        }else{
            timer = setInterval(function(){
                domRender(self);
            }, 1000);
        }
    }

    return am.Class({
        init: function(options){
            var self = this;
            if(options){
                self.options = options;
                domRender(self);
                bindEvents(self);
            }
        }
    });
});