define(['archmage'], function(am){

    var $D = am.dom,
        $E = am.event;

    var _option = {
        /**
         * 是否初始化关闭按钮
         */
        closable: false,
        /**
         * 是否初始化最小化按钮
         */
        minimizable: false,
        /**
         * 是否初始化最大化按钮
         */
        maximizable: false,

        fit: false,

        position: 'center',

        width: 300,

        height: 300
    };

    function domRender(self){
        var opts = self.options,
            el = opts.el,
            content = el.innerHTML;

        el.innerHTML = [
            '<div class="panel-header">',
                initToolsButton(opts),
            '</div>',
            '<div class="panel-body">' + content + '</div>'
        ].join('');

        $D.addClass(el, 'panel');

        $D.setStyle(el, {
            width: opts.width + 'px',
            height: opts.height + 'px'
        });
    }


    function initToolsButton(opts){
        var html = [],
            mark;
        am.each(['clos', 'minimiz', 'maximiz'], function(item){
            mark = item + 'able';
            if(opts[mark] === true){
                html.push('<a href="javascript:;" class="panel-header-btn panel-' + mark + '"></a>');
            }
        });

        return html.join('');
    }

    return am.Class({
        init: function(options){
            var self = this;
            self.options = am.extend({}, _option, options);

            domRender(self);
        }
    });
});