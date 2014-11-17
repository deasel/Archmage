/**
 * http模块，增加链接的处理，ajax等功能
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend      am.base.js  am.type.js
 */
//http
AM.$package(function (am) {

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
         *      method : 'post',
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
        ajax: function (option) {
                var o = option;
                var m = o.method.toLocaleUpperCase();
                var isPost = 'POST' == m;
                var isComplete = false;
                var timeout = o.timeout;
                var withCredentials = o.withCredentials; //跨域ajax
                var async = ('async' in option) ? option.async : true; //默认为异步请求, 可以设置为同步

                var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : false;
                if (!xhr) {
                    o.error && o.error.call(null, {
                        ret: 999,
                        msg: 'Create XHR Error!'
                    });
                    return false;
                }

                var qstr = http.serializeParam(o.data);

                // get 请求 参数处理
                !isPost && (o.url += (o.url.indexOf('?') > -1 ? '&' : '?') + qstr);

                xhr.open(m, o.url, async);
                if (withCredentials) {
                    xhr.withCredentials = true;
                }

                isPost && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                var timer = 0;

                xhr.onreadystatechange = function () {
                    if (4 == xhr.readyState) {
                        var status = xhr.status;
                        if ((status >= 200 && status < 300) || status === 304 || status === 0) {
                            var response = xhr.responseText.replace(/(\r|\n|\t)/gi, '');
                            // var m = /callback\((.+)\)/gi.exec( response );
                            // var result = { ret : 998, msg : '解析数据出错，请稍后再试' };
                            // try{ result = eval( '(' + m[1] + ')' ) } catch ( e ) {};
                            // result = eval( '(' + m[1] + ')' )
                            var json = null;
                            try {
                                json = JSON.parse(response);
                            } catch (e) {}
                            o.onSuccess && o.onSuccess(json, xhr);
                        } else {
                            o.onError && o.onError(xhr, +new Date() - startTime);
                        }
                        isComplete = true;
                        if (timer) {
                            clearTimeout(timer);
                        }
                    }

                };

                var startTime = +new Date();
                xhr.send(isPost ? qstr : void(0));

                if (timeout) {
                    timer = setTimeout(function () {
                        if (!isComplete) {
                            xhr.abort(); //不abort同一url无法重新发送请求？
                            o.onTimeout && o.onTimeout(xhr);
                        }
                    }, timeout);
                }

                return xhr;
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
});
