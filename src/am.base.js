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
                var superClass = arguments[0].extend;
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
                [].map.call(arr, callback, context);
            } else if ($T.isObject(arr)) {
                for (var i in arr) {
                    if (arr.hasOwnProperty(i)) {
                        arr[i] = callback.call(context || arr[i], arr[i], i, arr);
                    }
                }
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
        }
    };

    global.AM = am;

    if (typeof define === 'function') {
        define(function () {
            return am;
        });
    }
})(window);
