define(['archmage','env', 'comp/shortcut'], function(am, Env, Shortcut){
    var $D = am.dom,

        __appList,

        oDock = $D.className('desktop-dock')[0];

    function domRender(){
        var oAppWrap = $D.node({
            nodeName: 'div',
            class: 'dock-app-wrap'
        }, oDock);

        am.each(__appList, function(appOpts){
            var oShortcut = $D.node({
                nodeName: 'a',
                href: 'javascript:;',
                class: 'app'
            }, oAppWrap);

            new Shortcut(am.extend({
                el: oShortcut
            }, appOpts));
        });
    }

    return {
        init: function(){

            var ENV = Env.getENV();
            __appList = ENV.env4dock || [];

            domRender();
        },
        add: function(appOpts, index){
            if(appOpts){
                index = index === undefined ? (__appList.length - 1) : index;
                __appList.splice(index, 0, appOpts);
            }
        },
        remove: function(index){

        }
    };
});