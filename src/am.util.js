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
