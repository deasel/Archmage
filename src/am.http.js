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
