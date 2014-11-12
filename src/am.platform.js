/**
 * 平台模块，用于判断当前设备的分类信息
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend      am.base.js
 */
AM.$package(function (am) {
    var ua = navigator.userAgent,
        platform = {};

    // return the IE version or -1
    function getIeVersion() {
        var retVal = -1,
            ua, re;
        if (navigator.appName === 'Microsoft Internet Explorer') {
            ua = navigator.userAgent;
            re = new RegExp('MSIE ([0-9]{1,})');
            if (re.exec(ua) !== null) {
                retVal = parseInt(RegExp.$1);
            }
        }
        return retVal;
    }

    function uaMatch(regexp) {
        return ua.match(regexp) === null ? false : true;
    }

    platform.ieVersion = getIeVersion();
    platform.ie = platform.ieVersion !== -1;
    platform.android = uaMatch(/Android/i);
    platform.iPhone = uaMatch(/iPhone/i);
    platform.iPad = uaMatch(/iPad/i);
    platform.iPod = uaMatch(/iPod/i);
    platform.windowsPhone = uaMatch(/Windows Phone/i);
    platform.IOS = platform.iPad || platform.iPhone;
    platform.touchDevice = "ontouchstart" in window;

    am.platform = platform;
});
