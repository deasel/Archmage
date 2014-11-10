/**
 * cookie模块
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend      am.base.js  am.type.js
 */
AM.$package(function (am) {
    var win = window,
        domainPrefix = win.location.hostname,
        HOUR2SEC = 3600000;
    var cookie = {
        set: function (name, value, domain, path, hour) {
            if (hour) {
                var today = new Date();
                var expire = new Date();
                expire.setTime(today.getTime() + HOUR2SEC * hour);
            }
            win.document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
            return true;
        },
        get: function (name) {
            var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
            var m = win.document.cookie.match(r);
            return (!m ? "" : m[1]);
        },
        remove: function (name, domain, path) {
            win.document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
        }
    };
    am.cookie = cookie;

});
