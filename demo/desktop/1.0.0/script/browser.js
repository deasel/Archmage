define(['archmage', 'panel'], function (am, Panel) {
    var $D = am.dom,
        $E = am.event,

        _option = {


            __history: []
        };

    function domRender(self){
        var panelWrap,
            panel,
            opts = self.options;

        panelWrap = $D.node({
            nodeName: 'div',
            style: 'display:none',
            class: 'browser'
        }, $D.className('desktop-wrap')[0]);

        panelWrap.innerHTML = [
            '<div class="browser-address">',
                '<a class="browser-addr-btn browser-btn-back" href="javascript:;"><span class=""></span></a>',
                '<a class="browser-addr-btn browser-btn-go" href="javascript:;"><span class=""></span></a>',
                '<a class="browser-addr-btn browser-btn-flush" href="javascript:;"><span class=""></span></a>',
                '<input class="browser-addr-input" placeholder="请输入网址，并单击回车键" />',
            '</div>',
            '<div class="browser-container"><iframe class="browser-content" src=""></iframe></div>',
        ].join('');

        opts.el = panelWrap;

        panel = new Panel({
            width: '800px',
            height: '400px',
            fit: true,
            el: panelWrap
        });
        opts.panel = panel;
    }

    function bindEvents(self){
        var opts = self.options,
            el = opts.el,
            panel = opts.panel,

            oIframe = $D.className('browser-content', el)[0],
            oInput = $D.className('browser-addr-input', el)[0],

            oAddrBtn = $D.className('browser-addr-btn', el);

        $E.on(oInput, 'keydown', function(e){
            var keyCode = e.keyCode || e.which,
                addr = oInput.value;

            if(keyCode === 13 && addr){
                addr = addr.indexOf('http://') >= 0 ? addr : 'http://' + addr;
                oIframe.setAttribute('src', addr);
            }

        });

        $E.on(oAddrBtn, 'click', function(){
        });
    }

    return {
        init: function (options) {
            var self = this;
            self.options = am.extend({}, _option, options);

            domRender(self);
            bindEvents(self);
        }
    };
});