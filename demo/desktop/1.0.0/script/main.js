requirejs.config({
    base: 'script/',
    paths: {
        archmage: '../../../../dest/Archmage-1.0.0'
    }

});
requirejs(['toolBar', 'browser'], function(toolbar, browser){
    toolbar.init();
    browser.init();
});