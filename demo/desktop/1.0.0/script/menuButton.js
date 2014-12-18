/**
 * 菜单按钮。
 *
 */
define(['archmage'], function(am){

    var _option,
        CACHE = {},

        $T = am.type,
        $E = am.event,
        $D = am.dom;

    _option = {
        el: null,
        width: 300,
        height: 'auto'
    };

    function domRender(self){
        var opts = self.options,
            el = opts.el,
            txt = el.innerHTML;

        el.innerHTML = '<span class="menu-btn-text-top">' + txt + '</span>' + initItems(opts.items);
        $D.addClass($D.className('menu-btn-wrap', el)[0], 'menu-btn-wrap-top');
    }

    function initItems(items){
        var content = ['<ul class="menu-btn-wrap">'];
        for(var i = 0,item, len = items.length; i < len; i++){
            item = items[i];

            if(item === 'split'){
                content.push('<li class="menu-btn-split"></li>');
            }else{
                content.push('<li class="menu-btn-item"><span class="menu-btn-text">' + (item.text || '') + '</span>');

                if(item.desc){
                    content.push('<span class="menu-btn-desc">' + item.desc + '</span>');
                }

                if($T.isArray(item.items)){
                    content.push(initItems(item.items));
                }

                content.push('</li>');

            }

        }

        content.push('</ul>');
        return content.join('');
    }

    function bindEvents(self){
        var opts = self.options,
            el = opts.el,
            oTitle = $D.className('menu-btn-item', el),
            oTopTitle = $D.className('menu-btn-text-top', el);

        $E.on(oTopTitle, 'click', function(){
            am.each(this.parentNode.children, function(){
                if($D.hasClass(this, 'menu-btn-wrap')){
                    $D.addClass(this, 'show');
                    el.focus();
                }
            });
        });
        $E.on(el, 'blur', function(){
            am.each(oTopTitle[0].parentNode.children, function(){
                if($D.hasClass(this, 'menu-btn-wrap')){
                    $D.removeClass(this, 'show');
                }
            });
        });

        var menuToggle = function(){
            am.each(this.children, function(){
                $D.toggleClass(this, 'show');
            });
        };
        $E.on(oTitle, 'mouseover', menuToggle);
        $E.on(oTitle, 'mouseout', menuToggle);

    }

    return am.Class({
        init: function(options){
            var self = this;
            if(options){
                self.options = am.extend({}, _option, options);
                domRender(self);
                bindEvents(self);
            }

        }
    });
});