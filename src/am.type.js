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
