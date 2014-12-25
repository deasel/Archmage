define(['archmage'], function (am) {

    var $D = am.dom,
        $T = am.type,
        $E = am.event;

    var _OPTION = {
        /**
         * 是否初始化关闭按钮
         */
        closable: true,
        /**
         * 是否初始化最小化按钮
         */
        minimizable: true,
        /**
         * 是否初始化最大化按钮
         */
        maximizable: true,

        fit: false,

        position: 'center',

        width: 300,

        height: 300,

        isShow: true,

        __oWidth: null,
        __oHeight: null
    };

    function domRender(self) {
        var opts = self.options,
            el = opts.el,
            content = el.innerHTML;
        //add the mark
        $D.addClass(el, 'panel');

        el.innerHTML = [
            '<div class="panel-header">',
            initToolsButton(opts),
            '</div>',
                '<div class="panel-body">' + content + '</div>'
        ].join('');

        setSize(self);
    }

    function setSize(self) {
        var opts = self.options,
            el = opts.el,
            method;

        if(opts.isShow !== true){
            $D.setStyle(el, 'display', 'none');
            return;
        }

        if (opts.fit === true) {
            opts.__oWidth = opts.width;
            opts.__oHeight = opts.height;
            opts.width = '100%';
            opts.height = '100%';
            method = 'removeClass';
        } else {
            opts.width = opts.__oWidth || opts.width;
            opts.height = opts.__oHeight || opts.height;
            opts.__oWidth = '100%';
            opts.__oHeight = '100%';

            method = 'addClass';
        }
        $D.setStyle(el, {
            width: opts.width,
            height: opts.height,
            display: 'block'
        });
        $D[method](el, 'panel-center');
    }


    function initToolsButton(opts) {
        var html = [],
            mark;
        am.each({'clos': 'Close', 'minimiz': 'Minimize', 'maximiz': 'Maximize'}, function (value, key) {
            mark = key + 'able';
            if (opts[mark] === true) {
                html.push('<a href="javascript:;" title="' + value + '" class="panel-header-btn panel-btn-' + mark + '"></a>');
            }
        });

        return html.join('');
    }

    function bindEvents(self) {
        var opts = self.options,
            el = opts.el,

            CLASS_NAME = 'panel-btn-',
            oHeader = $D.className('panel-header', el)[0];

        var headerClickHandler = function (event) {
            var target = event.target;

            if ($T.isHTMLElement(target)) {


                if ($D.hasClass(target, CLASS_NAME + 'closable')) {           //关闭窗口

                    $E.off(oHeader, 'click', headerClickHandler);
                    $D.remove(el);

                } else if ($D.hasClass(target, CLASS_NAME + 'minimizable')) {  //最小化窗口

                    am.extend(opts, {
                        fit: false,
                        __oWidth: opts.width,
                        __oHeight: opts.height,
                        isShow: false
                    });
                    setSize(self);

                } else if ($D.hasClass(target, CLASS_NAME + 'maximizable')) {  //最大化/还原窗口
                    am.extend(opts, {
                        isShow: true,
                        fit: opts.fit === true ? false : true
                    });
                    setSize(self);
                }
            }
        };

        $E.on(oHeader, 'click', headerClickHandler);
    }



    return am.Class({
        init: function (options) {
            var self = this;
            self.options = am.extend({}, _OPTION, options);

            domRender(self);
            bindEvents(self);
        }
    });
});