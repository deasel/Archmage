define(['archmage', 'panel'], function(am, Panel){
    var $D = am.dom;
//    return am.Class(Panel, {
//
//    });

    return {
        init: function(){
            var panel = $D.node({
                nodeName: 'div',
                class: 'browser'
            }, $D.className('desktop-wrap')[0]);

            new Panel({
                el: panel
            });
        }
    };
});