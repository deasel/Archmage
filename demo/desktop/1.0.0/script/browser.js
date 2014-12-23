define(['archmage', 'panel'], function (am, Panel) {
    var $D = am.dom,
        $E = am.event;

    function domRender(self){
        var panelWrap,
            panel,
            opts = self.options = {};

        panelWrap = $D.node({
            nodeName: 'div',
            style: 'display:none',
            class: 'browser'
        }, $D.className('desktop-wrap')[0]);

        panelWrap.innerHTML = [
            '<div class="browser-address">',
                '<span class="browser-addr-btn browser-btn-back"></span>',
                '<span class="browser-addr-btn browser-btn-go"></span>',
                '<span class="browser-addr-btn browser-btn-flush"></span>',
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
            oInput = $D.className('browser-addr-input', el)[0],
            oIframe = $D.className('browser-content', el)[0];

        $E.on(oInput, 'keydown', function(e){
            var keyCode = e.keyCode || e.which,
                addr = oInput.value;

            if(keyCode === 13 && addr){
                addr = addr.indexOf('http://') >= 0 ? addr : 'http://' + addr;
                oIframe.setAttribute('src', addr);
            }

        });

    }

    return {
        init: function () {
            domRender(this);
            bindEvents(this);
        }
    };
});