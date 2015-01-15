define(['archmage', 'comp/panel'], function (am, Panel) {
    var $D = am.dom,
        $E = am.event,

        _OPTION = {


            appName: 'browser',
            icon: '',

            //TODO:历史记录数据重用
            __historyIndex: 0,      //当前地址在访问历史中的索引
            __history: ['']           //历史记录
        },

        _HANDLE = {

        },

        getIndex = (function(){
            var index = 100;

            return function(){
                return index++;
            };
        })();

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
                '<a class="browser-addr-btn browser-btn-back btn-disable" href="javascript:;"><span class=""></span></a>',
                '<a class="browser-addr-btn browser-btn-go btn-disable" href="javascript:;"><span class=""></span></a>',
                '<a class="browser-addr-btn browser-btn-flush" href="javascript:;"><span class=""></span></a>',
                '<input class="browser-addr-input" placeholder="请输入网址，并单击回车键" />',
            '</div>',
            '<div class="browser-container"><iframe class="browser-content" src=""></iframe></div>'
        ].join('');

        panelWrap.setAttribute('data-mark', Math.random());
        $D.setStyle(panelWrap, {
            zIndex : getIndex()
        });

        opts.el = panelWrap;

        panel = new Panel(opts);
        opts.panel = panel;
    }

    function bindEvents(self){
        var opts = self.options,

            el = opts.el,
            panel = opts.panel,

            oIframe = $D.className('browser-content', el)[0],
            oInput = $D.className('browser-addr-input', el)[0],

            oBtnGo = $D.className('browser-btn-go', el)[0],
            oBtnBack = $D.className('browser-btn-back', el)[0],

            oAddrBtn = $D.className('browser-addr-btn', el);

        $E.on(oInput, 'keydown', function(e){
            var keyCode = e.keyCode || e.which,
                addr = oInput.value;

            if(keyCode === 13 && addr){
                addr = addr.indexOf('http://') >= 0 ? addr : 'http://' + addr;

                //加入历史记录
                opts.__history.push(addr);
                opts.__historyIndex = opts.__history.length - 1;

                oIframe.setAttribute('src', addr);
//                oInput.value = addr;

                $D.removeClass(oBtnBack, 'btn-disable');
                $D.addClass(oBtnGo, 'btn-disable');
            }

        });

        $E.on(oAddrBtn, 'click', function(){
            var target = this,
                link;


            if($D.hasClass(target, 'browser-btn-back')){            //后退
                //取history中最近访问的地址
                opts.__historyIndex--;
                link = opts.__history[opts.__historyIndex];

                if(opts.__historyIndex === 0){        //如果已回退到初始页，则置灰回退按钮
                    $D.addClass(oBtnBack, 'btn-disable');
                }

                $D.removeClass(oBtnGo, 'btn-disable');
                oIframe.setAttribute('src', link);
                oInput.value = link;

            }else if($D.hasClass(target, 'browser-btn-go')){        //前进

                opts.__historyIndex++;
                link = opts.__history[opts.__historyIndex];

                //如果已经前进到最新的地址，则置灰前进按钮
                if(opts.__historyIndex === (opts.__history.length - 1)){
                    $D.addClass(oBtnGo, 'btn-disable');
                }


                $D.removeClass(oBtnBack, 'btn-disable');
                oIframe.setAttribute('src', link);
                oInput.value = link;
            }else{                                                  //刷新
                link = oInput.value;
                if(link){
                    oIframe.setAttribute('src', '');
                    oIframe.setAttribute('src', link);
                }

            }
        });
    }

    return am.Class({
        init: function (options) {
            var self = this;
            self.options = am.extend(true, {}, _OPTION, options);

            domRender(self);
            bindEvents(self);
        },

        __config__: {
            appName: 'browser',
            icon: 'images/chrome.jpg',
            desc: '浏览器'
        }
    });
});