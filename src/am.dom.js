/**
 * dom操作模块。支持“常用的”dom查询，批处理和操作等功能
 *
 * @author      deasel(deasel21@gmail.com)
 * @version     2014-10-27
 * @version     0.0.1
 *
 * @depend      am.base.js  am.type.js
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
        vendors = ['o', 'ms' , 'moz' , 'webkit'],
        div = doc.createElement('div');

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
            return context.getElementsByTagName(tagName);
        },
        /**
         *
         * @param className
         * @param context
         * @returns {NodeList|*}
         */
        className: function (className, context) {
            context = context || doc;
            if (context.getElementsByClassName) {
                return context.getElementsByClassName(className);
            } else {

                var children = context.getElementsByTagName('*'),
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
            var args = arguments, result,
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

                for (var i = 0, len = nodeList.length, node; i < len; i++) {
                    node = nodeList[i];
                    callback.call(node, i);
                }
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

                delete attrs.nodename;
            } else if ($T.isString(nodeName)) {
                attrs = {};
                name = nodeName;

            } else {
                return nodeName;
            }

            node = doc.createElement(name);

            node = am.extend(node, attrs);

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
            if (context) context.removeChild(node);
        },

        /**
         * 将样式转换为dom属性的格式
         *
         * @param cssStyle
         * @returns {*|string}
         */
        toDomStyle: function (cssStyle) {
            if (!$T.isString(cssStyle)) return;
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
            if (!$T.isString(domStyle)) return;
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
            if (prop in style) return prop;
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
                    if (!elem || !className || $D.hasClass(elem, className)) {
                        return;
                    }
                    elem.classList.add(className);
                };
            }
            else {
                return function (elem, className) {
                    if (!elem || !className || $D.hasClass(elem, className)) {
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
                    if (!elem || !className || !$D.hasClass(elem, className)) {
                        return;
                    }
                    elem.classList.remove(className);
                };
            } else {
                return function (elem, className) {
                    if (!elem || !className || !$D.hasClass(elem, className)) {
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
                    if (!elem || !className) {
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
            }
            else {
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
