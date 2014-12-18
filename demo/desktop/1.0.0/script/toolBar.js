define(['archmage', 'menuButton', 'timer'], function(am, MenuButton, Timer){
    var $D = am.dom,

        oDesktop = $D.className('desktop')[0];


    function domRender(){

        //初始化dom结构
        var oBar = $D.className('toolbar')[0];

        oBar.innerHTML = [
            '<a class="toolbar-sys-icon menu-btn" href="javascript:;">系统</a>',
            '<span class="toolbar-app-tool"></span>',
            '<span class="toolbar-app-env">',
                '<span class="env-timer"></span>',
            '</span>'
        ].join('');

        new Timer({
            el: $D.className('env-timer')[0]
        });

        //左侧系统菜单
        new MenuButton({
            el: $D.className('toolbar-sys-icon', oBar)[0],
            items: [{
                text: '关于本系统',
                handle: function(){
                    alert('WebOS Doraemo. Version 0.0.1.That\'s all');
                }
            },'split',{
                text: '系统偏好设置'
            },{
                text: 'App store'
            },'split',{
                text: '最近使用的项目',
                items: [{
                    text: '快播',
                    handle: function(){
                        alert('还看？撸死你啊，屌丝！');
                    }
                }, {
                    text: '浏览器',
                    handle: function(){

                    }
                }]
            },'split',{
                text: '关机',
                desc: 'Win+Q'
            },'split',{
                text: '注销'
            }]
        });
    }

    return {
        init : function(){
            domRender();

        }
    };
});