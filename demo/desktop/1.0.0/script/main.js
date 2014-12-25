requirejs.config({
    base: 'script/',
    paths: {
        archmage: '../../../../dest/Archmage-1.0.0'
    }

});
requirejs(['toolBar', 'dock'], function(){
    var args = arguments;

    for(var i = 0, len = args.length; i < len; i++){
        args[i].init();
    }
});