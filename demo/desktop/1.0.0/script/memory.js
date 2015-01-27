define(['archmage'], function(am){
    var MEMORY = {
            //格式要求如下：
            //  key必须是app的名称，即与app的__config__.appName保持一致
            //  value必须是数组类型，默认为空数组
            // appName: []
        },
        $T = am.type;

    return {
        memory: function(key, value){
            // if($T.isString(key) && value){
            //     MEMORY[key] = value;
            // }else{
            //     return MEMORY;
            // }
            var args = arguments,
                argsLen = args.length;

            if(argsLen <= 0){       //直接获取“内存”信息
                return MEMORY;
            } else if(argsLen === 1){       //获取内存中指定app的信息，若结果为undefine，表示当前并未占用“内存”
                return MEMORY[key];
            } else {
                if(!$T.isArray(MEMORY[key])){
                    MEMORY[key] = [];
                }

                if($T.isArray(value)){
                    MEMORY[key] = MEMORY[key].concat(value);
                }else{
                    MEMORY.push(value);
                }
            }
        },

        check: function(key){
            var threads = MEMORY.key;
            return ($T.isArray(threads) && threads.length > 0);
        }
    };
});