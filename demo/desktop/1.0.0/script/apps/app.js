define(['apps/browser'], function(){
    var args = arguments,
        Applications = {};

    for(var i = 0, len = args.length, app; i < len; i++){
        app = args[i];
        Applications[app.prototype.__appName] = app;
    }

    return Applications;
});