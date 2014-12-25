define(['archmage'], function(am){
    var $D = am.dom,

        __appList,

        oDock = $D.className('desktop-dock')[0];

    function domRender(){
        var oAppWrap = $D.node({
            nodeName: 'div',
            class: 'dock-app-wrap'
        }, oDock);

        am.each(__appList, function(){

        });
    }

    return {
        init: function(appList){
            __appList = appList || [];
            domRender();
        },
        add: function(oApp, index){
            if(oApp){
                index = index === undefined ? (__appList.length - 1) : index;
                __appList.splice(index, 0, oApp);
            }
        },
        remove: function(index){

        }
    };
});