define(['archmage'], function(am){
    var MEMORY = {},

        $T = am.type;

    return {
        memory: function(key, value){
            if($T.isObject(key)){
                am.extend(MEMORY, key);
            }else if($T.isString(key) && value){
                MEMORY[key] = value;
            }else{
                //此处只返回对象的拷贝，不直接返回引用
                return am.extend({}, MEMORY);
            }
        }
    };
});