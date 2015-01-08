requirejs.config({
    baseUrl: 'script/',
    paths: {
        archmage: '../../../../dest/Archmage-1.0.0',
        apps: 'apps/',
        comp: 'component/'
    }

});
requirejs(['env', 'comp/toolBar', 'comp/dock'], function(){
    var args = arguments;

    for(var i = 0, len = args.length; i < len; i++){
        args[i].init();
    }
});