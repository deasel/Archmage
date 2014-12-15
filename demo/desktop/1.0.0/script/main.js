requirejs.config({
    base: 'script/',
    paths: {
        archmage: '../../../../dest/Archmage-1.0.0'
    }

});
requirejs(['toolBar'], function(toolbar){
    toolbar.init();
});