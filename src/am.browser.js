/**
 * 浏览器信息模块。用于处理浏览器类型，版本等信息
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend      am.base.js  am.type.js
 */
//browser
AM.$package(function (am) {
    var s, browser,
        EXTEND = '([\\d.]+)',
        ua = navigator.userAgent.toLowerCase(),
        plug = navigator.plugins,
        browserList;

    /**
     * @ignore
     * @param String ver
     * @param Number floatLength
     * @return Number
     */
    var toFixedVersion = function (ver, floatLength) {
        ver = ("" + ver).replace(/_/g, ".");
        floatLength = floatLength || 1;
        ver = String(ver).split(".");
        ver = ver[0] + "." + (ver[1] || "0");
        ver = Number(ver).toFixed(floatLength);
        return ver;
    };
    /**
     * browser 名字空间
     *
     * @namespace
     * @name browser
     */
    browser = {
        /**
         * @namespace
         * @name features
         * @memberOf browser
         */
        features:
        /**
         * @lends browser.features
         */
        {
            /**
             * @property xpath
             */
            xpath: !!(document.evaluate),

            /**
             * @property air
             */
            air: !!(window.runtime),

            /**
             * @property query
             */
            query: !!(document.querySelector)
        },

        /**
         * @namespace
         * @name plugins
         * @memberOf browser
         */
        plugins:
        /**
         * @lends browser.plugins
         */
        {
            flash: (function () {
                //var ver = "none";
                var ver = 0;
                if (plug && plug.length) {
                    var flash = plug['Shockwave Flash'];
                    if (flash && flash.description) {
                        ver = toFixedVersion(flash.description.match(/\b(\d+)\.\d+\b/)[1], 1) || ver;
                    }
                } else {
                    var startVer = 13;
                    while (startVer--) {
                        try {
                            new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + startVer);
                            ver = toFixedVersion(startVer);
                            break;
                        } catch (e) {}
                    }
                }

                return ver;
            })()
        },

        /**
         * 获取浏览器的userAgent信息
         *
         * @memberOf browser
         */
        getUserAgent: function () {
            return ua;
        },

        /**
         * 用户使用的浏览器的名称，如：chrome
         *
         *
         * @description {String} 用户使用的浏览器的名称，如：chrome
         * @type Number
         */
        name: "unknown",

        /**
         * @property version
         * @lends browser
         */
        version: 0,

        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         *
         *
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        //        ie: 0,

        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         *
         *
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        //        firefox: 0,

        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         *
         *
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        //        chrome: 0,


        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         *
         *
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        //        opera: 0,

        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         *
         *
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        //        safari: 0,

        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         *
         *
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        //        mobileSafari: 0,

        /**
         * 用户使用的是否是adobe 的air内嵌浏览器
         */
        //        adobeAir: 0,

        /**
         * 是否支持css3的borderimage
         *
         * @description {boolean} 检测是否支持css3属性borderimage
         */
        //borderimage: false,

        /**
         * 设置浏览器类型和版本
         *
         * @ignore
         * @private
         * @memberOf browser
         *
         */
        set: function (name, ver) {
            this.name = name;
            this.version = ver;
            //            this[name] = ver;
        }
    };

    // 探测浏览器并存入 browser 对象
    browserList = {
        'ie': 'msie ',
        'firefox': 'firefox\/',
        'chrome': 'chrome\/',
        'opera': 'opera.',
        'adobeAir': 'adobeair\/',
        'safari': 'version\/'
    };

    for (var name in browserList) {
        s = ua.match(new RegExp(browserList[name] + EXTEND));
        if (s) {
            browser.set(name, toFixedVersion(s[1]));
            break;
        }
    }

    am.browser = browser;

});
