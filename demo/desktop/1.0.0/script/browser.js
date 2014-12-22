define(['archmage', 'panel'], function(am, Panel){
    var $D = am.dom;
//    return am.Class(Panel, {
//
//    });

    return {
        init: function(){
            var panel = $D.node({
                nodeName: 'div',
                style: 'display:none',
                class: 'browser'
            }, $D.className('desktop-wrap')[0]);

            new Panel({
                width: '800px',
                height: '400px',
                el: panel
            });
        }
    };
});