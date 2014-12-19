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

        //add the mark
        $D.addClass(el, 'panel');

        setSize(opts);
    }

    function setSize(opts){
        var el = opts.el,
            width, height;

        if(opts.fit === true){
            width =  '100%';
            height = '100%';
        }else{
            width = opts.width + 'px';
            height = opts.height + 'px';

            $D.addClass(el, 'panel-center');
        }


        $D.setStyle(el, {
            width: width,
            height: height
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