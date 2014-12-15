/**
 * 移动端基础脚本库。包含dom查询，事件绑定和ajax等模块
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend
 */
(function (global) {
    var am = {
        $namespace: function (name) {
            if (!name) {
                return global;
            }

            var nsArr = name.split("."),
                ns = global;

            for (var i = 0, l = nsArr.length; i < l; i++) {
                var n = nsArr[i];
                ns[n] = ns[n] || {};
                ns = ns[n];
            }

            return ns;
        },
        $package: function (ns, func) {
            var target;
            if (typeof ns == "function") {
                func = ns;
                target = window;
            } else if (typeof ns == "string") {
                target = this.$namespace(ns);
            } else if (typeof ns == "object") {
                target = ns;
            }
            func.call(target, this);
        },
        extend: function () {
            var options, name, src, copy, copyIsArray, clone,
                $T = AM.type,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;

                // skip the boolean and the target
                target = arguments[i] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && !$T.isFunction(target)) {
                target = {};
            }

            // extend $T itself if only one argument is passed
            if (i === length) {
                target = this;
                i--;
            }

            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) !== null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && ($T.isPlainObject(copy) || (copyIsArray = $T.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && $T.isArray(src) ? src : [];

                            } else {
                                clone = src && $T.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = AM.extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        },
        bind: function (func, context, var_args) {
            var slice = [].slice;
            var a = slice.call(arguments, 2);
            return function () {
                return func.apply(context, a.concat(slice.call(arguments)));
            };
        },
        Class: function () {
            var length = arguments.length;
            var option = arguments[length - 1];
            option.init = option.init || function () {
            };

            if (length === 2) {
//                var superClass = arguments[0].extend;
                var superClass = arguments[0];
                var tempClass = function () {
                };
                tempClass.prototype = superClass.prototype;
                var subClass = function () {
                    return new subClass.prototype._init(arguments);
                };
                subClass.superClass = superClass.prototype;
                subClass.callSuper = function (context, func) {
                    var slice = Array.prototype.slice;
                    var a = slice.call(arguments, 2);

                    func = subClass.superClass[func];

                    if (func) {
                        func.apply(context, a.concat(slice.call(arguments)));
                    }
                };
                subClass.prototype = new tempClass();
                subClass.prototype.constructor = subClass;

                AM.extend(subClass.prototype, option);

                subClass.prototype._init = function (args) {
                    this.init.apply(this, args);
                };
                subClass.prototype._init.prototype = subClass.prototype;
                return subClass;

            } else if (length === 1) {
                var newClass = function () {
                    return new newClass.prototype._init(arguments);
                };
                newClass.prototype = option;
                newClass.prototype._init = function (arg) {
                    this.init.apply(this, arg);
                };
                newClass.prototype.constructor = newClass;
                newClass.prototype._init.prototype = newClass.prototype;
                return newClass;
            }
        },
        // Convert pseudo array object to real array
        toArray: function (pseudoArrayObj) {
            var arr = [],
                i, l;
            try {
                return arr.slice.call(pseudoArrayObj);
            } catch (e) {
                arr = [];
                for (i = 0, l = pseudoArrayObj.length; i < l; ++i) {
                    arr[i] = pseudoArrayObj[i];
                }
                return arr;
            }
        },
        indexOf: function (arr, elem) {
            var $T = AM.type;
            //数组或类数组对象
            if (arr.length) {
                return [].indexOf.call(arr, elem);
            } else if ($T.isObject(arr)) {
                for (var i in arr) {
                    if (arr.hasOwnProperty(i) && arr[i] === elem) {
                        return i;
                    }
                }
            }
        },
        each: function (arr, callback, context) {
            var $T = AM.type,
                i, l;
            if (arr.length) {
                for (i = 0, l = arr.length; i < l; i++) {
                    if (callback.call(context || arr[i], arr[i], i, arr) === false) {
                        return;
                    }
                }
            } else if ($T.isObject(arr)) {
                for (i in arr) {
                    if (arr.hasOwnProperty(i) && callback.call(context || arr[i], arr[i], i, arr) === false) {
                        return;
                    }
                }
            }
        },
        every: function (arr, callback, context) {
            var $T = AM.type;
            if (arr.length) {
                return [].every.call(arr, callback, context);
            } else if ($T.isObject(arr)) {
                var flag = true;
                this.each(arr, function (e, i, arr) {
                    if(callback.call(this, e, i, arr) === false){
                        flag = false;
                        return false;
                    }
                }, context);
                return flag;

            }
        },
        some: function (arr, callback, context) {
            var $T = AM.type;
            if (arr.length) {
                return [].some.call(arr, callback, context);
            } else if ($T.isObject(arr)) {
                var flag = false;
                this.each(arr, function (e, i, arr) {
                    if(callback.call(this, e, i, arr) === true){
                        flag = true;
                        return false;
                    }
                }, context);
                return flag;
            }
        },
        map: function (arr, callback, context) {
            var $T = AM.type;
            if (arr.length) {
                return [].map.call(arr, callback, context);
            } else if ($T.isObject(arr)) {
                var res = {};
                for (var i in arr) {
                    if (arr.hasOwnProperty(i)) {
                        res[i] = callback.call(context || arr[i], arr[i], i, arr);
                    }
                }
                return res;
            }
        },
        filter: function (arr, callback, context) {
            var $T = AM.type;
            if (arr.length) {
                return [].filter.call(arr, callback, context);
            } else if ($T.isObject(arr)) {
                var newObj = {};
                this.each(arr, function (e, i, arr) {
                    if(callback.call(this, e, i, arr)){
                        newObj[i] = e;
                    }
                }, context);
                return newObj;
            }
        },
        random: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        $default: function (value, defaultValue) {
            if (typeof value === 'undefined') {
                return defaultValue;
            }
            return value;
        },

        noop: function(){}
    };

    global.AM = am;

    if (typeof define === 'function') {
        define(function () {
            return am;
        });
    }
})(window);

/**
 *  类型判断模块，增加各独立类型的判断，避开typeof等常用类型检验的坑。
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend      am.base.js
 */
//type
AM.$package(function (am) {

    var _object = {};

    function isType(type) {
        return function(obj) {
            return _object.toString.call(obj) == "[object " + type + "]"
        }
    }

    am.type = {
        /**
         * 判断是否数组
         *
         * @param {Object} o 判断对象
         * @return {boolean} 是否数组
         */
        isArray: Array.isArray || isType("Array"),
        /**
         * 判断是否Object
         *
         * @param {Object} o 判断对象
         * @return {boolean} 是否Object
         */
        isObject: isType("Object"),
        /**
         * 判断是否布尔类型
         *
         * @param {Object} o 判断对象
         * @return {boolean} 是否布尔类型
         */
        isBoolean : isType('Boolean'),
        /**
         * 判断是否数值类型
         *
         * @param {Object} o 判断对象
         * @return {boolean} 是否数值类型
         */
        isNumber: isType('Number'),
        /**
         * 判断是否undefined
         *
         * @param {Object} o 判断对象
         * @return {boolean} 是否undefined
         */
        isUndefined: function (o) {
            return typeof (o) === "undefined";
        },
        /**
         * 判断是否Null
         *
         * @param {Object} o 判断对象
         * @return {boolean} 是否Null
         */
        isNull: function (o) {
            return o === null;
        },
        /**
         * 判断是否function
         *
         * @param {Object} o 判断对象
         * @return {boolean} 是否function
         */
        isFunction: isType("Function"),
        /**
         * 判断是否字符串
         *
         * @param {Object} o 判断对象
         * @return {boolean} 是否字符串
         */
        isString: isType("String"),

        /**
         * 判断是否为空对象
         *
         * @param obj   判断对象
         * @returns {boolean}   是否为空对象
         */
        isPlainObject: function (obj) {
            //首先应该判断目标是否为对象
            if(!AM.type.isObject(obj)){
                return false;
            }
            for (var n in obj) {
                return false;
            }
            return true;
        },

        /**
         * 判断是否为dom对象。
         * 因为在firefox，chrome，opera中执行（typeof HTMLElement）返回为function，
         *      IE9+和safari中返回Object，
         *      IE8-返回undefined
         *
         * @param obj   判断对象
         * @returns {boolean}   是否为dom对象
         */
        isHTMLElement: function (obj) {
            return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        }
    };
});

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
         * 是否是webkite内核
         *
         * @description {Number} 用户使用的浏览器是否为webkite内核
         * @type Number
         */
//        webkit : false,

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
//        borderimage: false,

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
            this.version = Number(ver);
            this[name] = ver;
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
    var regMsg;
    for (var name in browserList) {
        regMsg = browserList[name] + EXTEND + (name === 'safari' ?  + '.*safari' : '');
        s = ua.match(new RegExp(regMsg));
        if (s) {
            browser.set(name, toFixedVersion(s[1]));
            break;
        }
    }

    //webkit
    (s = ua.match(/webkit\/([\d.]+)/)) ? (browser.webkit = Number(s[1])) : 0;

    am.browser = browser;

});

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
            var expire;
            if (hour) {
                var today = new Date();
                expire = new Date();
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

/**
 * http模块，增加链接的处理，ajax等功能
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend      am.base.js  am.type.js
 */
AM.$package(function (am) {

    var BUG = {'你TMD':'指什么指'},

        $T = am.type;

    var http = {
        /**
         * 生成参数串
         *
         * @param {Object} param 参数对象
         *
         * @return {string} 生成的参数串
         */
        serializeParam: function (param, prefix) {
            if (!param) {
                return '';
            }
            if (!prefix) {
                prefix = '';
            }
            var qstr = [], value;
            for (var key in param) {
                value = param[key];
                if (prefix) {
                    key = prefix + '[' + key + ']';
                }
                if (am.type.isArray(value) || am.type.isObject(value)) {
                    qstr.push(am.http.serializeParam(value, key));
                } else {
                    qstr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                }
            }
            return qstr.join('&');
        },
        /**
         * 获取url参数值
         *
         * @param {string} name 参数名
         * @param {string} href url地址
         * @param {Object} noDecode 禁用decode
         *
         * @return {string} 参数值
         */
        getUrlParam: function (name, href, noDecode) {
            var re = new RegExp('(?:\\?|#|&)' + name + '=([^&]*)(?:$|&|#)', 'i'),
                m = re.exec(href);
            var ret = m ? m[1] : '';
            return !noDecode ? decodeURIComponent(ret) : ret;
        },
        /**
         * ajax方法，支持的参数如下：
         *  AM.http.ajax({
         *      type : 'post',
         *      dataType : 'json',
         *      timeout : 10,
         *      withCredentials : false,    //是否跨域
         *      url : '',
         *      data : {},
         *      error : function(){},
         *      onSuccess : function(){},
         *      onError : function(){},
         *      onTimeout : function(){}
         *  });
         *
         *
         * @param option
         * @returns {*}
         */
        ajax: function (options) {
            options.dataType === 'jsonp' ? jsonp(options) : json(options);
        }
        // offlineSend:function(options){
        //     if(navigator.onLine){
        //         http.ajax(options);
        //     }
        //     else{
        //         saveDataLocal(options);
        //     }
        // }
    };
    am.http = http;


    function json(options){
        var dataType = options.dataType || "json";


        options = options || {};
        options.type = (options.type || "GET").toUpperCase();
        var params = http.serializeParam(options.data);

        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else { //IE6及其以下版本浏览器
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    var data = xhr.responseText;
                    data = dataType === 'json' ? eval('(' + data + ')') : data;
                    $T.isFunction(options.success) && options.success.call(BUG, data, xhr.responseXML);
                } else {
                    $T.isFunction(options.error) && options.error.call(BUG,status);
                }
            }
        }

        //连接 和 发送 - 第二步
        if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, true);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }

        return xhr;
    }

    function jsonp(options) {
        options = am.extend({data : {}}, options);
        if (!options.url || !options.callback) {
            throw new Error("参数不合法");
        }

        //创建 script 标签并加入到页面中
        var callbackName = ('jsonp_' + Math.random()).replace(".", "");
        var oHead = document.getElementsByTagName('head')[0];
        options.data[options.callback] = callbackName;
        var params = http.serializeParam(options.data);
        var oS = document.createElement('script');
        oHead.appendChild(oS);

        //创建jsonp回调函数
        window[callbackName] = function (json) {
            oHead.removeChild(oS);
            clearTimeout(oS.timer);
            window[callbackName] = null;
            $T.isFunction(options.success) && options.success(json);
        };

        //发送请求
        oS.src = options.url + '?' + params;

        //超时处理
        if (options.time) {
            oS.timer = setTimeout(function () {
                window[callbackName] = null;
                oHead.removeChild(oS);
                $T.isFunction(options.error) && options.error({ message: "out of time" });
            }, options.time);
        }
    };

    //格式化参数
//    function formatParams(data) {
//        var arr = [];
//        for (var name in data) {
//            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[i]));
//        }
//        return arr.join('&');
//    }
});

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

/**
 * dom操作模块。支持“常用的”dom查询，批处理和操作等功能
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend      am.base.js  am.type.js  am.browser.js
 */
AM.$package(function (am) {
    var global = window,
        doc = global.document,
        $T = am.type,
        //        tagNameExpr = /^[\w-]+$/,
        //        idExpr = /^#([\w-]*)$/,
        //        classExpr = /^\.([\w-]+)$/,
        //        selectorEngine,

        hasClassListProperty = 'classList' in doc.documentElement,
        vendors = ['o', 'ms', 'moz', 'webkit'],
        div = doc.createElement('div'),

        QUERY_TAG_NAME = 'getElementsByTagName',
        QUERY_CLS_NAME = 'getElementsByClassName';

    var queryModule = {
        /**
         * 根据ID获取页面元素
         *
         * @param domId     标签ID
         *
         * @returns {HTMLElement}
         */
        id: function (domId) {
            return doc.getElementById(domId);
        },
        /**
         *
         * @param tagName
         * @param context
         * @returns {NodeList|*}
         */
        tagName: function (tagName, context) {
            context = context || doc;
            return context[QUERY_TAG_NAME](tagName);
        },
        /**
         *
         * @param className
         * @param context
         * @returns {NodeList|*}
         */
        className: function (className, context) {
            context = context || doc;
            if (context[QUERY_CLS_NAME]) {
                return context[QUERY_CLS_NAME](className);
            } else {

                var children = context[QUERY_TAG_NAME]('*'),
                    elements = [],
                    i, l, classNames;

                for (i = 0, l = children.length; i < l; ++i) {
                    if (classNames = children[i].className && am.indexOf(classNames.split(' '), className) >= 0) {
                        elements.push(children[i]);
                    }
                }
                return elements;
            }
        }
    };

    /**
     *  工厂函数，负责统一抽离查询逻辑，增加一个回调函数的支持，用于对查询结果做统一处理
     *
     * @param queryEngine       查询引擎
     * @returns {Function}      返回包装后的函数体
     */
    function queryFactory(queryEngine) {
        return function () {
            var args = arguments,
                result,
                argsLen = args.length,
                selector = args[0],
                context = args[1] || doc,
                callback = args[2] || null;

            if (argsLen <= 0) {
                return null;
            } else if (argsLen == 2) {
                if ($T.isFunction(context)) {
                    context = doc;
                    callback = args[1];
                }
            }

            result = queryEngine.call(global, selector, context);

            if (callback && result) {
                //这里需要将HTML Collection转换为数组
                var nodeList = result.length ? am.toArray(result) : [result];

                $T.isFunction(callback) && am.each(nodeList, callback);
//                for (var i = 0, len = nodeList.length, node; i < len; i++) {
//                    node = nodeList[i];
//                    callback.call(node, i);
//                }
            }

            return result;

        };
    }

    //包装所有的查询函数，增加统一的事件回调
    am.map(queryModule, function (fn, name) {
        return queryFactory(fn);
    });


    var domExtend = {

        /**
         * 新建节点。支持传入节点名称（字符串）和包含节点属性的键值对。同时支持创建完后，直接插入指定dom结构中（默认为向最后插入）
         *
         * @param {String/Object} nodeName
         * @param {HTMLElement} parent
         *
         * @returns {HTMLElement}
         */
        node: function (nodeName, parent) {
            var attrs, name, node;

            if ($T.isObject(nodeName)) {
                attrs = nodeName;
                name = attrs.nodeName;

                delete attrs.nodeName;
            } else if ($T.isString(nodeName)) {
                attrs = {};
                name = nodeName;

            } else {
                return nodeName;
            }

            node = doc.createElement(name);

            am.each(attrs, function(val, key){
                if(val && key){
                    node.setAttribute(key, val);
                }
            });

            if ($T.isHTMLElement(parent)) {
                parent.appendChild(node);
            }

            return node;
        },

        /**
         * 移除指定dom结构
         *
         * @param {HTMLElement} node
         */
        remove: function (node) {
            var context = node.parentNode;
            if (context) {
                context.removeChild(node);
            }
        },

        /**
         * 将样式转换为dom属性的格式
         *
         * @param cssStyle
         * @returns {*|string}
         */
        toDomStyle: function (cssStyle) {
            if (!$T.isString(cssStyle)) {
                return;
            }
            return cssStyle.replace(/\-[a-z]/g, function (m) {
                return m.charAt(1).toUpperCase();
            });
        },

        /**
         * 将样式转换为css标准的格式
         *
         * @param domStyle
         * @returns {*|string}
         */
        toCssStyle: function (domStyle) {
            if (!$T.isString(domStyle)) {
                return;
            }
            return domStyle.replace(/[A-Z]/g, function (m) {
                return '-' + m.toLowerCase();
            });
        },
        /**
         * 为元素设置样式
         *
         * @param {HTMLElement} elem
         * @param {string/object} styleName
         * @param {string} styleValue
         */
        setStyle: function (elem, styleName, styleValue) {
            var self = this;
            if (elem.length) {
                AM.each(elem, function (e) {
                    self.setStyle(e, styleName, styleValue);
                });
            } else if ($T.isObject(styleName)) {
                for (var n in styleName) {
                    if (styleName.hasOwnProperty(n)) {
                        elem.style[n] = styleName[n];
                    }
                }
            } else if ($T.isString(styleName)) {
                elem.style[styleName] = styleValue;
            }
        },
        /**
         *
         * 获取元素的当前实际样式，css 属性需要用驼峰式写法，如：fontFamily
         *
         * @param {Element} el 元素
         * @param {String} styleName css 属性名称
         * @return {String} 返回元素样式
         */
        getStyle: function (el, styleName) {
            if (!el) {
                return;
            }
            if (styleName === "float") {
                styleName = "cssFloat";
            }
            if (el.style[styleName]) {
                return el.style[styleName];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(el, null)[styleName];
            } else if (doc.defaultView && doc.defaultView.getComputedStyle) {
                styleName = styleName.replace(/([/A-Z])/g, "-$1");
                styleName = styleName.toLowerCase();
                var style = document.defaultView.getComputedStyle(el, '');
                return style && style.getPropertyValue(styleName);
            } else if (el.currentStyle) {
                return el.currentStyle[styleName];
            }

        },
        /**
         * 获取带有出产商的属性名
         *
         * @param {string} prop
         * @returns {string}
         */
        getVendorPropertyName: function (prop) {
            var style = div.style;
            var _prop;
            if (prop in style) {
                return prop;
            }
            // _prop = prop;
            _prop = prop.charAt(0).toUpperCase() + prop.substr(1);
            for (var i = vendors.length; i--;) {
                var v = vendors[i];
                var vendorProp = v + _prop;
                if (vendorProp in style) {
                    return vendorProp;
                }
            }
        },
        /**
         * 判断是否支持3D
         *
         * @returns {*|boolean}
         */
        isSupprot3d: function () {
            // var transformStr = $D.getVendorPropertyName("transform");
            // $D.setStyle(div ,transformStr ,"rotatex(90deg)");
            // if(div.style[transformStr] == "") return false;
            // return true;
            var p_prop = this.getVendorPropertyName("perspective");
            return p_prop && p_prop in div.style;
        },

        /**
         * 新增样式
         *
         * @param {HTMLElement} elem
         * @param {string}  className
         */
        addClass: (function () {
            if (hasClassListProperty) {
                return function (elem, className) {
                    if (!elem || !className || AM.dom.hasClass(elem, className)) {
                        return;
                    }
                    elem.classList.add(className);
                };
            } else {
                return function (elem, className) {
                    if (!elem || !className || AM.dom.hasClass(elem, className)) {
                        return;
                    }
                    elem.className += " " + className;
                };
            }
        })(),
        /**
         * 移除指定样式
         *
         * @param {HTMLElement} elem
         * @param {string}  className
         */
        removeClass: (function () {
            if (hasClassListProperty) {
                return function (elem, className) {
                    if (!elem || !className || !AM.dom.hasClass(elem, className)) {
                        return;
                    }
                    elem.classList.remove(className);
                };
            } else {
                return function (elem, className) {
                    if (!elem || !className || !AM.dom.hasClass(elem, className)) {
                        return;
                    }
                    elem.className = elem.className.replace(new RegExp('(?:^|\\s)' + className + '(?:\\s|$)'), ' ');
                };
            }
        })(),
        /**
         * 判断元素是否有此样式
         *
         * @param {HTMLElement} elem
         * @param {string}  className
         */
        hasClass: (function () {
            if (hasClassListProperty) {
                return function (elem, className) {
                    if (!elem || !className || !elem.classList) {
                        return false;
                    }
                    return elem.classList.contains(className);
                };
            } else {
                return function (elem, className) {
                    if (!elem || !className) {
                        return false;
                    }
                    return -1 < (' ' + elem.className + ' ').indexOf(' ' + className + ' ');
                };
            }
        })(),
        /**
         * 样式切换
         *
         * @param {HTMLElement} ele
         * @param {string} className
         */
        toggleClass: function (ele, className) {
            var $D = AM.dom;
            if ($D.hasClass(ele, className)) {
                $D.removeClass(ele, className);
            } else {
                $D.addClass(ele, className);
            }
        },

        /**
         * 向指定节点后追加dom结构
         *
         * @param {HTMLElement} parentNode    容器对象
         * @param {HTMLElement} targetNode    需要追加的对象
         * @param {HTMLElement} refernceElement   追加到该dom之后（可选）
         */
        append: function (parentNode, targetNode, refernceElement) {
            if (!parentNode || !targetNode) {
                return;
            }

            if (refernceElement && refernceElement.nextSibling) {
                parentElement.insertBefore(newElement, refernceElement.nextSibling);
            } else {
                parentNode.appendChild(targetNode);
            }

        },

        /**
         * 向指定节点前追加dom节点
         *
         * @param {HTMLElement} parentNode    容器对象
         * @param {HTMLElement} targetNode    需要追加的对象
         * @param {HTMLElement} refernceElement   追加到该dom之后（可选）
         */
        prepend: function (parentNode, targetNode, refernceElement) {
            if (!parentNode || !targetNode) {
                return;
            }
            parentElement.insertBefore(newElement, refernceElement || parentNode.firstChild);
        }
    };

    //合并查询模块
    am.dom = am.extend(domExtend, queryModule);
});

/**
 * 支持模块，用于判断当前设备是否支持指定特性
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend      am.base.js  am.type.js  am.dom.js
 */
AM.$package(function(am) {
    var win = window,
        doc = win.document,
        nav = win.navigator,
        $D = am.dom;

    am.support = {
        /**
         * 判断是否支持fixed
         *
         * @return {boolean} 是否支持fixed
         */
        fixed: (function() {
            var container = document.body;
            var el = $D.node('div');
            $D.setStyle(el, {
                position: "fixed",
                top: "100px"
            });
            container.appendChild(el);

            var originalHeight = container.style.height,
                originalScrollTop = container.scrollTop;

            $D.setStyle(container, "height", "3000px");
            container.scrollTop = 500;

            var elementTop = el.getBoundingClientRect().top;
            if (originalHeight) {
                $D.setStyle(container, "height", originalHeight + "px");
            } else {
                $D.setStyle(container, "height", "");
            }

            container.removeChild(el);
            container.scrollTop = originalScrollTop;
            return elementTop === 100;
        })(),
        /**
         * 判断是否支持transitionend并返回可用事件名
         *
         * @return {string} 可用事件名
         */
        transitionend: (function() {
            var ret, endEventNames, div, handler, i;

            if ('ontransitionend' in win) {
                return 'transitionend';
            } else if ('onwebkittransitionend' in win) {
                return 'webkitTransitionEnd';
            }
            // IE10+
            else if ('transition' in doc.body.style) {
                return 'transitionend';
            }
            // 模拟transition，异步得出检测结果
            else if ('addEventListener' in win) {
                endEventNames = [
                    'transitionend',
                    'webkitTransitionEnd',
                    'MozTransitionEnd',
                    'MSTransitionEnd',
                    'otransitionend',
                    'oTransitionEnd'
                ];
                div = doc.createElement('div');
                handler = function(e) {
                    var i = endEventNames.length;
                    while (i--) {
                        this.removeEventListener(endEventNames[i], handler);
                    }
                    support.transitionend = e.type;
                    handler = null;
                };
                $D.setStyle(div, {
                    'position': 'absolute',
                    'top': '0px',
                    'left': '-99999px',
                    'transition': 'top 1ms',
                    'WebkitTransition': 'top 1ms',
                    'MozTransition': 'top 1ms',
                    'MSTransitionEnd': 'top 1ms',
                    'OTransitionEnd': 'top 1ms'
                });
                i = endEventNames.length;
                while (i--) {
                    div.addEventListener(endEventNames[i], handler, false);
                }
                doc.documentElement.appendChild(div);
                setTimeout(function() {
                    div.style.top = '100px';
                    setTimeout(function() {
                        div.parentNode.removeChild(div);
                        div = null;
                        handler = null;
                    }, 100);
                }, 0);
            }
            return false;
        })(),
        /**
         * 判断支持的audio格式列表
         *
         * @return {Object} 可用audio格式列表
         */
        audio: (function() {
            var elem = document.createElement('audio'),
                result,
                NOT_SUPPORT_RE = /^no$/i,
                EMPTY_STR = '';

            try {
                if (elem.canPlayType) {
                    result = {};
                    result.mp3 = elem.canPlayType('audio/mpeg;').replace(NOT_SUPPORT_RE, EMPTY_STR
);
                    result.wav = elem.canPlayType('audio/wav; codecs="1"').replace(NOT_SUPPORT_RE, EMPTY_STR);
                    result.ogg = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(NOT_SUPPORT_RE, EMPTY_STR);
                    result.m4a = (elem.canPlayType('audio/x-m4a;') || elem.canPlayType('audio/aac;')).replace(NOT_SUPPORT_RE, EMPTY_STR);
                }
            } catch (e) {}

            return result;
        })(),
        /**
         * 判断是否安装了flash插件
         *
         * @return {boolean} 是否安装了flash插件
         */
        flash: (function() {
            if (nav.plugins && nav.plugins.length && nav.plugins['Shockwave Flash']) {
                return true;
            } else if (nav.mimeTypes && nav.mimeTypes.length) {
                var mimeType = nav.mimeTypes['application/x-shockwave-flash'];
                return mimeType && mimeType.enabledPlugin;
            } else {
                var ax;
                try {
                    if (ActiveXObject) {
                        ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                        return true;
                    }
                } catch (e) {}
            }
            return false;
        })()
    };
});

/**
 * 事件模块
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend      am.base.js  am.type.js  am.support.js   am.browser.js   am.platform.js
 */
AM.$package(function (am) {

    var $T = am.type,
        $S = am.support,
        browser = am.browser,
        win = window,
        doc = win.document,

        isReady = false;


    // 如果是DOM事件，返回正确的事件名；否则返回布尔值 `false`
    var isDomEvent = function (obj, evtType) {
        if (("on" + evtType).toLowerCase() in obj) {
            return evtType;
        } else if ($S.transitionend && (evtType === 'transitionend' || evtType === $S.transitionend)) {
            return $S.transitionend;
        }
        return false;
    };
    // 封装绑定和解除绑定DOM事件的方法以兼容低版本IE
    var bindDomEvent = function (obj, evtType, handler) {
        var oldHandler;
        if (obj.addEventListener) {
            obj.addEventListener(evtType, handler, false);
        } else {
            evtType = evtType.toLowerCase();
            if (obj.attachEvent) {
                obj.attachEvent('on' + evtType, handler);
            } else {
                oldHandler = obj['on' + evtType];
                obj['on' + evtType] = function () {
                    if (oldHandler) {
                        oldHandler.apply(this, arguments);
                    }
                    return handler.apply(this, arguments);
                };
            }
        }
    };
    var unbindDomEvent = function (obj, evtType, handler) {
        if (obj.removeEventListener) {
            obj.removeEventListener(evtType, handler, false);
        } else {
            evtType = evtType.toLowerCase();
            if (obj.detachEvent) {
                obj.detachEvent('on' + evtType, handler);
            } else {
                // TODO: 对特定handler的去除
                obj['on' + evtType] = null;
            }
        }
    };
    var $E = {
        on: function (obj, evtType, handler) {
            var tmpEvtType, i;
            //update by deasel  2014-12-12
            //对于常见的集合性查询结果（即类数组对象），这里的判断是不太理想的。这里其实只需要判断对象是否具有数组特性即可
//            if ($T.isArray(obj)) {
            if (obj.length >= 0) {
                for (i = obj.length; i--;) {
                    $E.on(obj[i], evtType, handler);
                }
                return;
            }
            //evtType is a string split by space
            if ($T.isString(evtType) && evtType.indexOf(" ") > 0) {
                evtType = evtType.split(" ");
                for (i = evtType.length; i--;) {
                    $E.on(obj, evtType[i], handler);
                }
                return;
            }
            //handler is an array
            if ($T.isArray(handler)) {
                for (i = handler.length; i--;) {
                    $E.on(obj, evtType, handler[i]);
                }
                return;
            }
            //evtType is an object
            if ($T.isObject(evtType)) {
                for (var eName in evtType) {
                    $E.on(obj, eName, evtType[eName]);
                }
                return;
            }
            //is dom event support
            tmpEvtType = isDomEvent(obj, evtType);
            if (tmpEvtType) {
                evtType = tmpEvtType;
                bindDomEvent(obj, evtType, handler);
                return;
            }
            //dom event in origin element
            if (obj.elem && (tmpEvtType = isDomEvent(obj.elem, evtType))) {
                evtType = tmpEvtType;
                bindDomEvent(obj.elem, evtType, handler);
                return;
            }
            //is specific custom event
            if (customEvent[evtType]) {
                customEvent[evtType](obj, handler);
                return;
            }
            //other custom event
            if (!obj.events) {
                obj.events = {};
            }
            if (!obj.events[evtType]) {
                obj.events[evtType] = [];
            }

            obj.events[evtType].push(handler);


        },
        once: function (obj, evtType, handler) {
            var f = function () {
                handler.apply(win, arguments);
                $E.off(obj, evtType, f);
            };
            $E.on(obj, evtType, f);
        },
        off: function (obj, evtType, handler) {
            //evtType is a string split by space
            if ($T.isString(evtType) && evtType.indexOf(" ") > 0) {
                evtType = evtType.split(" ");
                for (var i = evtType.length; i--;) {
                    $E.off(obj, evtType[i], handler);
                }
                return;
            }
            //handler is an array
            if ($T.isArray(handler)) {
                for (var i = handler.length; i--;) {
                    $E.off(obj, evtType, handler[i]);
                }
                return;
            }
            //evtType is an object
            if ($T.isObject(evtType)) {
                for (var eName in evtType) {
                    $E.off(obj, eName, evtType[eName]);
                }
                return;
            }
            tmpEvtType = isDomEvent(obj, evtType);
            if (tmpEvtType) {
                evtType = tmpEvtType;
                unbindDomEvent(obj, evtType, handler);
                return;
            }
            //dom event in origin element
            tmpEvtType = isDomEvent(obj.elem, evtType)
            if (obj.elem && tmpEvtType) {
                evtType = tmpEvtType;
                unbindDomEvent(obj.elem, evtType, handler);
                return;
            }
            //is specific custom event
            if (customEvent[evtType]) {
                customEvent._off(obj, evtType, handler);
                return;
            }

            if (!evtType) {
                obj.events = {};
                return;
            }

            if (obj.events) {
                if (!handler) {
                    obj.events[evtType] = [];
                    return;
                }
                if (obj.events[evtType]) {
                    var evtArr = obj.events[evtType];
                    for (var i = evtArr.length; i--;) {
                        if (evtArr[i] == handler) {
                            evtArr.splice(i, 1);
                            return;
                        }
                    }
                }
            }
        },
        fire: function (obj, evtType) {
            var arg = [].slice.call(arguments, 2),
                evt, tmpEvtType;
            //obj is dom element
            if (tmpEvtType = isDomEvent(obj, evtType)) {
                evtType = tmpEvtType;
                evt = doc.createEvent('HTMLEvents');
                evt.initEvent(evtType, true, true);
                obj.dispatchEvent(evt);
                return;
            }
            //dom event in origin element
            if (obj.elem && (tmpEvtType = isDomEvent(obj.elem, evtType))) {
                evtType = tmpEvtType;
                evt = doc.createEvent('HTMLEvents');
                evt.initEvent(evtType, true, true);
                obj.elem.dispatchEvent(evt);
                return;
            }
            if (obj.events && obj.events[evtType]) {
                var handler = obj.events[evtType];
                for (var i = 0, l = handler.length; i < l; i++) {
                    // if(!arg[0]) arg[0] = {};
                    // arg[0].type = evtType;
                    // try{
                    handler[i].apply(obj, arg);
                    // } catch(e){ window.console && console.log && console.log(e.message); };

                }
            }
        },
        /**
         * 获取点击的事件源, 该事件源是有 cmd 属性的 默认从 event.target 往上找三层,找不到就返回null
         *
         * @param {Event}
         *            event
         * @param {Int}
         *            level 指定寻找的层次
         * @param {String}
         *            property 查找具有特定属性的target,默认为cmd
         * @param {HTMLElement} parent 指定查找结束点, 默认为document.body
         * @return {HTMLElement} | null
         */
        getActionTarget: function (event, level, property, parent) {
            var t = event.target,
                l = level || 3,
                s = level !== -1,
                p = property || 'cmd',
                end = parent || doc.body;
            if (t === end) {
                return t.getAttribute(p) ? t : null;
            }
            while (t && (t !== end) && (s ? (l-- > 0) : true)) {
                if (t.getAttribute(p)) {
                    return t;
                } else {
                    t = t.parentNode;
                }
            }
            return null;
        },
        /**
         * @example
         * bindCommands(cmds);
         * bindCommands(el, cmds);
         * bindCommands(el, 'click', cmds);
         *
         * function(param, target, event){
         * }
         */
        bindCommands: function (targetElement, eventName, commands, commandName) {
            var defaultEvent = am.platform.touchDevice ? "tap" : "click";
            if (arguments.length === 1) {
                commands = targetElement;
                targetElement = doc.body;
                eventName = defaultEvent;
            } else if (arguments.length === 2) {
                commands = eventName;
                eventName = defaultEvent;
            }
            if (!targetElement._commands) {
                targetElement._commands = {};
            }
            if (targetElement._commands[eventName]) { //已经有commands 就合并
                am.extend(targetElement._commands[eventName], commands);
                return;
            }
            targetElement._commands[eventName] = commands;
            commandName = commandName || 'cmd';
            if (!targetElement.getAttribute(commandName)) {
                targetElement.setAttribute(commandName, 'void');
            }
            am.event.on(targetElement, eventName, function (e) {
                var target = am.event.getActionTarget(e, -1, commandName, this.parentNode);
                if (target) {
                    var cmd = target.getAttribute(commandName);
                    var param = target.getAttribute('param');
                    if (target.href && target.getAttribute('href').indexOf('#') === 0) {
                        e.preventDefault();
                    }
                    if (this._commands[eventName][cmd]) {
                        this._commands[eventName][cmd](param, target, e);
                    }
                }
            });
        },

        /**
         * dom资源加载完成后触发的方法
         *
         * @param {function} handle
         */
        domReady: function (handle) {
            if ($T.isFunction(handle)) {
                if(isReady === true){
                    handle.call(win);
                }else{
                    am.event.on(doc, '_domRender', handle);
                }
            }
        }
    };

    var startEvt, moveEvt, endEvt;
    //选择不同事件
    if (am.platform.touchDevice) {
        startEvt = "touchstart";
        moveEvt = "touchmove";
        endEvt = "touchend";
    } else {
        startEvt = "mousedown";
        moveEvt = "mousemove";
        endEvt = "mouseup";
    }

    var getTouchPos = function (e) {
        var t = e.touches;
        if (t && t[0]) {
            return {
                x: t[0].clientX,
                y: t[0].clientY
            };
        }
        return {
            x: e.clientX,
            y: e.clientY
        };
    };
    //计算两点之间距离
    var getDist = function (p1, p2) {
        if (!p1 || !p2) {
            return 0;
        }
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));

    };
    //计算两点之间所成角度
    var getAngle = function (p1, p2) {
        var r = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        var a = r * 180 / Math.PI;
        return a;
    };


    var customEventHandlers = [];
    var isCustomEvtMatch = function (ch, ele, evtType, handler) {
        return ch.ele == ele && evtType == ch.evtType && handler == ch.handler;
    };
    //自定义事件
    var customEvent = {
        _fire: function (ele, evtType, handler) {
            am.each(customEventHandlers, function (ch) {
                if (isCustomEvtMatch(ch, ele, evtType, handler)) {
                    handler.call(ele, {
                        type: evtType
                    });
                }
            });
        },
        _off: function (ele, evtType, handler) {
            am.each(customEventHandlers, function (ch, i) {
                var at = ch.actions;
                if (isCustomEvtMatch(ch, ele, evtType, handler)) {
                    //删除辅助处理程序
                    for (var n in at) {
                        var h = at[n];
                        if ($T.isObject(h)) {
                            //非绑定在该元素的handler
                            $E.off(h.ele, n, h.handler);
                        } else {
                            $E.off(ele, n, h);
                        }
                    }
                    //删除本处理程序数据
                    customEventHandlers.splice(i, 1);
                    return;
                }
            });
        },
        tap: function (ele, handler) {
            //按下松开之间的移动距离小于10，认为发生了tap
            var TAP_DISTANCE = 10;
            //双击之间最大耗时
            var DOUBLE_TAP_TIME = 300;
            var pt_pos;
            var ct_pos;
            var pt_up_pos;
            var pt_up_time;
            var evtType;
            var startEvtHandler = function (e) {
                // e.stopPropagation();
                var touches = e.touches;
                if (!touches || touches.length == 1) { //鼠标点击或者单指点击
                    ct_pos = pt_pos = getTouchPos(e);
                }
            };
            var moveEvtHandler = function (e) {
                // e.stopPropagation();
                e.preventDefault();
                ct_pos = getTouchPos(e);
            };
            var endEvtHandler = function (e) {
                // e.stopPropagation();
                var now = Date.now();
                var dist = getDist(ct_pos, pt_pos);
                var up_dist = getDist(ct_pos, pt_up_pos);

                if (dist < TAP_DISTANCE) {
                    if (pt_up_time && now - pt_up_time < DOUBLE_TAP_TIME && up_dist < TAP_DISTANCE) {
                        evtType = "doubletap";
                    } else {
                        evtType = "tap";
                    }
                    handler.call(ele, {
                        target: e.target,
                        oriEvt: e,
                        type: evtType
                    });
                }
                pt_up_pos = ct_pos;
                pt_up_time = now;
            };

            $E.on(ele, startEvt, startEvtHandler);
            $E.on(ele, moveEvt, moveEvtHandler);
            $E.on(ele, endEvt, endEvtHandler);

            var evtOpt = {
                ele: ele,
                evtType: "tap",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions[startEvt] = startEvtHandler;
            evtOpt.actions[moveEvt] = moveEvtHandler;
            evtOpt.actions[endEvt] = endEvtHandler;

            customEventHandlers.push(evtOpt);

        },
        hold: function (ele, handler) {
            //按下松开之间的移动距离小于20，认为点击生效
            var HOLD_DISTANCE = 20,
                //按下两秒后hold触发
                HOLD_TIME = 2000,
                holdTimeId,
                pt_pos,
                ct_pos,
                pt_time;
            var startEvtHandler = function (e) {
                e.stopPropagation();
                var touches = e.touches;
                if (!touches || touches.length == 1) { //鼠标点击或者单指点击
                    pt_pos = ct_pos = getTouchPos(e);
                    pt_time = Date.now();

                    holdTimeId = setTimeout(function () {
                        if (touches && touches.length != 1) {
                            return;
                        }
                        if (getDist(pt_pos, ct_pos) < HOLD_DISTANCE) {
                            handler.call(ele, {
                                oriEvt: e,
                                target: e.target,
                                type: "hold"
                            });
                        }
                    }, HOLD_TIME);
                }
            };
            var moveEvtHandler = function (e) {
                e.stopPropagation();
                e.preventDefault();
                ct_pos = getTouchPos(e);
            };
            var endEvtHandler = function (e) {
                e.stopPropagation();
                clearTimeout(holdTimeId);
            };

            $E.on(ele, startEvt, startEvtHandler);
            $E.on(ele, moveEvt, moveEvtHandler);
            $E.on(ele, endEvt, endEvtHandler);

            var evtOpt = {
                ele: ele,
                evtType: "hold",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions[startEvt] = startEvtHandler;
            evtOpt.actions[moveEvt] = moveEvtHandler;
            evtOpt.actions[endEvt] = endEvtHandler;

            customEventHandlers.push(evtOpt);
        },
        swipe: function (ele, handler) {
            //按下之后移动30px之后就认为swipe开始
            var SWIPE_DISTANCE = 30;
            //swipe最大经历时间
            var SWIPE_TIME = 500;
            var pt_pos;
            var ct_pos;
            var pt_time;
            var pt_up_time;
            var pt_up_pos;
            //获取swipe的方向
            var getSwipeDirection = function (p2, p1) {
                var angle = getAngle(p1, p2);

                if (angle < 45 && angle > -45) {
                    return "right";
                }
                if (angle >= 45 && angle < 135) {
                    return "top";
                }
                if (angle >= 135 || angle < -135) {
                    return "left";
                }
                if (angle >= -135 && angle <= -45) {
                    return "bottom";
                }

            };
            var startEvtHandler = function (e) {
                // e.stopPropagation();
                var touches = e.touches;
                if (!touches || touches.length == 1) { //鼠标点击或者单指点击
                    pt_pos = ct_pos = getTouchPos(e);
                    pt_time = Date.now();

                }
            };
            var moveEvtHandler = function (e) {
                // e.stopPropagation();
                e.preventDefault();
                ct_pos = getTouchPos(e);
            };
            var endEvtHandler = function (e) {
                // e.stopPropagation();
                var dir;
                pt_up_pos = ct_pos;
                pt_up_time = Date.now();

                if (getDist(pt_pos, pt_up_pos) > SWIPE_DISTANCE && pt_up_time - pt_time < SWIPE_TIME) {
                    dir = getSwipeDirection(pt_up_pos, pt_pos);
                    handler.call(ele, {
                        oriEvt: e,
                        target: e.target,
                        type: "swipe",
                        direction: dir
                    });
                }
            };

            $E.on(ele, startEvt, startEvtHandler);
            $E.on(ele, moveEvt, moveEvtHandler);
            $E.on(ele, endEvt, endEvtHandler);

            var evtOpt = {
                ele: ele,
                evtType: "swipe",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions[startEvt] = startEvtHandler;
            evtOpt.actions[moveEvt] = moveEvtHandler;
            evtOpt.actions[endEvt] = endEvtHandler;

            customEventHandlers.push(evtOpt);
        },
        transform: function (ele, handler) {
            var pt_pos1;
            var pt_pos2;
            var pt_len; //初始两指距离
            var pt_angle; //初始两指所成角度
            var startEvtHandler = function (e) {
                var touches = e.touches;
                if (!touches) {
                    return;
                }

                if (touches.length == 2) { //双指点击
                    pt_pos1 = getTouchPos(e.touches[0]);
                    pt_pos2 = getTouchPos(e.touches[1]);
                    pt_len = getDist(pt_pos1, pt_pos2);
                    pt_angle = getAngle(pt_pos1, pt_pos2);
                }
            };
            var moveEvtHandler = function (e) {
                e.preventDefault();
                var touches = e.touches;
                if (!touches) {
                    return;
                }
                if (touches.length == 2) { //双指点击

                    var ct_pos1 = getTouchPos(e.touches[0]);
                    var ct_pos2 = getTouchPos(e.touches[1]);
                    var ct_len = getDist(ct_pos1, ct_pos2);
                    var ct_angle = getAngle(ct_pos1, ct_pos2);
                    var scale = ct_len / pt_len;
                    var rotation = ct_angle - pt_angle;

                    handler.call(ele, {
                        oriEvt: e,
                        target: e.target,
                        type: "transform",
                        scale: scale,
                        rotate: rotation
                    });
                }
            };

            $E.on(ele, startEvt, startEvtHandler);
            $E.on(ele, moveEvt, moveEvtHandler);
            var evtOpt = {
                ele: ele,
                evtType: "transform",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions[startEvt] = startEvtHandler;
            evtOpt.actions[moveEvt] = moveEvtHandler;

            customEventHandlers.push(evtOpt);
        },
        scrollstart: function (ele, handler) {
            var isScrolling;
            var scrollTimeId;
            var scrollHandler = function (e) {
                if (!isScrolling) {
                    isScrolling = true;
                    handler.call(ele, {
                        oriEvt: e,
                        target: e.target,
                        type: "scrollstart"
                    });
                }
                clearTimeout(scrollTimeId);
                scrollTimeId = setTimeout(function () {
                    isScrolling = false;
                }, 250);
            };

            $E.on(ele, "scroll", scrollHandler);

            var evtOpt = {
                ele: ele,
                evtType: "scrollstart",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions.scroll = scrollHandler;
            customEventHandlers.push(evtOpt);
        },
        scrollend: function (ele, handler) {
            var scrollTimeId;
            var scrollHandler = function (e) {
                clearTimeout(scrollTimeId);
                scrollTimeId = setTimeout(function () {
                    handler.call(ele, {
                        oriEvt: e,
                        target: e.target,
                        type: "scrollend"
                    });
                }, 250);
            };
            $E.on(ele, "scroll", scrollHandler);

            var evtOpt = {
                ele: ele,
                evtType: "scrollend",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions.scroll = scrollHandler;
            customEventHandlers.push(evtOpt);
        },
        scrolltobottom: function (ele, handler) {
            var body = doc.body;
            var scrollHandler = function (e) {
                if (body.scrollHeight <= body.scrollTop + window.innerHeight) {
                    handler.call(ele, {
                        oriEvt: e,
                        target: e.target,
                        type: "scrolltobottom"
                    });

                }
            };
            $E.on(ele, "scroll", scrollHandler);

            var evtOpt = {
                ele: ele,
                evtType: "scrolltobottom",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions.scroll = scrollHandler;
            customEventHandlers.push(evtOpt);
        },
        //兼容性更好的orientationchange事件，这里使用resize实现。不覆盖原生orientation change 和 resize事件
        ortchange: function (ele, handler) {
            var pre_w = window.innerWidth;
            var resizeHandler = function (e) {
                var current_w = window.innerWidth,
                    current_h = window.innerHeight,
                    orientation;

                if (pre_w == current_w) {
                    return;
                }
                if (current_w > current_h) {
                    orientation = "landscape";
                } else {
                    orientation = "portrait";
                }
                handler.call(ele, {
                    oriEvt: e,
                    target: e.target,
                    type: "ortchange",
                    orientation: orientation
                });
                pre_w = current_w;
            };
            $E.on(window, "resize", resizeHandler);

            var evtOpt = {
                ele: ele,
                evtType: "ortchange",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions.resize = resizeHandler;
            customEventHandlers.push(evtOpt);
        }
    };

    var transitionEndNames = [
        'transitionend',
        'webkitTransitionEnd',
        'MozTransitionEnd',
        'MSTransitionEnd'
    ];

    (function(){
        //注册domReady事件
        var conf = {enableMozDOMReady: true};
        doReady = function () {
            if (isReady) return;
            //确保onready只执行一次
            isReady = true;
            am.event.fire(doc, '_domRender');
        };

        //如果是IE，则通过轮询判断doScroll方法，以判断是否触发domRender事件
        if (browser.name === 'ie') {        /* IE */
            (function () {
                if (isReady) return;
                try {
                    doc.documentElement.doScroll("left");
                } catch (error) {
                    setTimeout(arguments.callee, 0);
                    return;
                }
                doReady();
            })();
            window.attachEvent('onload', doReady);

        } else if (browser.webkit && browser.webkit < 525) {        /* Webkit and version < 525 */

            (function () {
                if (isReady) return;
                if (/loaded|complete/.test(doc.readyState)) {
                    doReady();
                } else {
                    setTimeout(arguments.callee, 0);
                }
            })();
            window.addEventListener('load', doReady, false);

        } else {          /* FF Opera 高版webkit 其他 */

            if (!browser.name === 'firefox' || browser.version != 2 || conf.enableMozDOMReady)
                doc.addEventListener("DOMContentLoaded", function () {
                    doc.removeEventListener("DOMContentLoaded", arguments.callee, false);
                    doReady();
                }, false);
            window.addEventListener('load', doReady, false);
        }
    })();


    am.event = $E;
});

//function ready(readyFn) {
//    //非IE浏览器
//    if (document.addEventListener) {
//        document.addEventListener('DOMContentLoaded', function () {
//            readyFn && readyFn();
//        }, false);
//    } else {
//        //方案1和2  哪个快用哪一个
//        var bReady = false;
//        //方案1
//        document.attachEvent('onreadystatechange', function () {
//            if (bReady) {
//                return;
//            }
//            if (document.readyState == 'complete' || document.readyState == "interactive") {
//                bReady = true;
//                readyFn && readyFn();
//            };
//        });
//
//        //方案2
//        //jquery也会担心doScroll会在iframe内失效，此处是判断当前页是否被放在了iframe里
//        if (!window.frameElement) {
//            setTimeout(checkDoScroll, 1);
//        }
//        function checkDoScroll() {
//            try {
//                document.documentElement.doScroll("left");
//                if (bReady) {
//                    return;
//                }
//                bReady = true;
//                readyFn && readyFn();
//            }
//            catch (e) {
//                // 不断检查 doScroll 是否可用 - DOM结构是否加载完成
//                setTimeout(checkDoScroll, 1);
//            }
//        };
//    }
//};

/**
 * 动画模块
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend      am.base.js  am.type.js  am.event.js am.dom.js
 */
//animation time, runType ,scale, rotate, rotateX, rotateY, translateX, translateY, skewX, skewY
AM.$package(function (am) {
    var $D = am.dom,
        $E = am.event,
        $T = am.type;

    //3d支持
    var support3d = $D.isSupprot3d();
    var finishedCount = 0;

    var Animation = am.Class({
        init: function (options) {

            this.setElems(options.selector);
            this.setDuration(options.duration || 1000);
            this.setRunType(options.runType || "ease-in-out");
            this.setDelay(options.delay || 0);
            this.setUsed3d(options.use3d);
            this.transformArr = [];
        },
        setDuration: function (duration) {
            this.duration = duration;
            return this;
        },
        setDelay: function (delay) {
            this.delay = delay;
            return this;
        },
        setElems: function (selector) {
            if ($T.isString(selector)) {
                this.elems = $D.$(selector);
            } else if ($T.isArray(selector)) {
                this.elems = selector;
            } else if (selector.tagName) {
                this.elems = [selector];
            }
            return this;
        },
        setRunType: function (runType) {
            this.runType = runType;
            return this;
        },
        setUsed3d: function (use3d) {
            this.use3d = use3d;
            return this;
        },
        scale: function (scale) {
            this.transformArr.push("scale(" + scale + ")");
            return this;
        },
        scaleX: function (scaleX) {
            this.transformArr.push("scalex(" + scaleX + ")");
            return this;
        },
        scaleY: function (scaleY) {
            this.transformArr.push("scaley(" + scaleY + ")");
            return this;
        },
        rotate: function (rotate) {
            this.transformArr.push("rotate(" + rotate + "deg)");
            return this;
        },
        rotateX: function (rotateX) {
            this.transformArr.push("rotatex(" + rotateX + "deg)");
            return this;
        },
        rotateY: function (rotateX) {
            this.transformArr.push("rotatey(" + rotateY + "deg)");
            return this;
        },
        rotateZ: function (rotateZ) {
            this.transformArr.push("rotatez(" + rotateZ + "deg)");
            return this;
        },
        translate: function (translateX, translateY, translateZ) {
            if (support3d && translateZ) {
                this.transformArr.push("translate3d" + '(' + translateX + ',' + translateY + ',' + translateZ + ')');
            } else {
                this.transformArr.push("translate" + '(' + translateX + ',' + translateY + ')');
            }
            return this;
        },
        translateX: function (translateX) {
            this.translate(translateX, 0);
            return this;
        },
        translateY: function (translateY) {
            this.translate(0, translateY);
            return this;
        },
        skew: function (x, y) {
            this.transformArr.push("skew(" + x + "deg," + y + "deg)");
            return this;
        },
        skewX: function (x) {
            this.transformArr.push("skewx(" + x + "deg)");
            return this;
        },
        skewY: function (y) {
            this.transformArr.push("skewy(" + y + "deg)");
            return this;
        },
        setStyle: function (styleName, styleValue) {
            var s = "";
            if ($T.isUndefined(this.styleStr)) {
                this.styleStr = "";
            }
            //样式变化
            if ($T.isObject(styleName)) {
                am.each(styleName, function (sv, sn) {
                    s += $D.toCssStyle($D.getVendorPropertyName(sn)) + ":" + sv + ";";
                });
            } else if ($T.isString(styleName)) {
                s += $D.toCssStyle($D.getVendorPropertyName(styleName)) + ":" + styleValue + ";";
            }
            this.styleStr += s;
            return this;

        },
        toOrigin: function () {
            this.transformArr = [];
            return this;
        },
        transit: function (onFinished) {
            var self = this;
            var elems = this.elems;
            am.each(elems, function (e) {
                self._transit(e);
            });
            window.setTimeout(function () {
                $E.fire(self, "end");
                am.each(elems, function (elem) {
                    $D.setStyle(elem, $D.getVendorPropertyName("transition"), "");
                });

                if ($T.isFunction(onFinished)) {
                    onFinished.call(self);
                }
            }, this.duration);
            return this;
        },
        _transit: function (elem) {

            var self = this;
            var transformStr = this.transformArr.join(" ");
            if (support3d && this.use3d) {
                transformStr += " translatez(0)";
            }

            var aStr = "all" + ' ' + this.duration / 1000 + 's ' + this.runType + ' ' + this.delay / 1000 + 's';

            $D.setStyle(elem, $D.getVendorPropertyName("transition"), aStr);

            elem.style[$D.getVendorPropertyName("transform")] = transformStr;
            elem.style.cssText += this.styleStr;

            $E.fire(this, "start");
        }
    });
    am.Animation = Animation;
});

/**
 * 通用模块。
 *  提供常用的功能函数:隐藏Url栏，禁止滚动等
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend      am.base.js  am.type.js  am.event.js am.dom.js  am.animation.js
 */
//util
AM.$package(function (am) {
    var $D = am.dom,
        $E = am.event,
        $T = am.type;

    var preventScroll = function (e) {
        if (e.target.type === 'range') {
            return;
        }
        e.preventDefault();
    };
    var hideScroll = function () {
        setTimeout(function () {
            if (!location.hash) {
                var ph = window.innerHeight + 60;
                if (document.documentElement.clientHeight < ph) {
                    $D.setStyle(document.body, "minHeight", ph + "px");
                }
                window.scrollTo(0, 1);
            }
        }, 200);
    };

    var util = {
        /**
         * 隐藏Url栏
         *
         */
        hideUrlBar: function () {
            $E.on(window, "load", hideScroll);
        },
        /**
         * 禁止滚动
         *
         */
        preventScrolling: function () {
            $E.on(document, 'touchmove', preventScroll);
        },
        /**
         * 启用滚动
         *
         */
        activeScrolling: function () {
            $E.off(document, 'touchmove', preventScroll);
        },
        /**
         * 滚动到顶部动画(css3动画)
         *
         */
        scrollToTop: function (duration, runType) {
            var $A = am.Animation;
            var body = document.body;
            var scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;

            $D.setStyle(body, $D.getVendorPropertyName("transform"), "translate3d(0," + (-scrollTop) + "px,0)");
            body.scrollTop ? body.scrollTop = 0 : document.documentElement.scrollTop = 0;

            new $A({
                selector: body,
                duration: duration,
                runType: runType,
                use3d: true
            }).translateY(0).transit();

        },
        /**
         * 兼容浏览器的fixed定位
         *
         */
        fixElement: function (ele, options) {
                var iu = $T.isUndefined;
                var wh = window.innerHeight;
                var ww = window.innerWidth;
                var eh = ele.clientHeight;
                var ew = ele.clientWidth;
                var top;
                var left;

                //支持原生fixed
                if (am.support.fixed) {
                    $D.setStyle(ele, {
                        position: "fixed",
                        top: options.top + "px",
                        left: options.left + "px",
                        bottom: options.bottom + "px",
                        right: options.right + "px"
                    });
                    return;
                }
                //fixed模拟
                $E.on(window, "scrollend", function () {

                    top = window.pageYOffset + (iu(options.top) ? (iu(options.bottom) ? "" : wh - options.bottom - eh) : options.top);
                    left = window.pageXOffset + (iu(options.left) ? (iu(options.right) ? "" : ww - options.right - ew) : options.left);

                    $D.setStyle(ele, {
                        position: "absolute",
                        top: top + "px",
                        left: left + "px"
                    });
                });
            }
            //hover效果
            // hoverEffect:function(ele,className){
            //     var startEvt,moveEvt,endEvt;
            //     var touchDevice = J.platform.touchDevice;
            //     var upTarget;

        //     //选择不同事件
        //     if(touchDevice){
        //         startEvt="touchstart";
        //         moveEvt="touchmove";
        //         endEvt="touchend";
        //         upTarget = ele;
        //     }
        //     else{
        //         startEvt="mousedown";
        //         moveEvt="mousemove";
        //         endEvt="mouseup";
        //         upTarget = document.body;
        //     }
        //     $E.on(ele,startEvt,function(){
        //         $D.addClass(ele,className);
        //     });
        //     $E.on(ele,moveEvt,function(e){
        //         e.preventDefault();
        //     });
        //     $E.on(upTarget,endEvt,function(){
        //         $D.removeClass(ele,className);
        //     });
        // }

    };
    am.util = util;
});
