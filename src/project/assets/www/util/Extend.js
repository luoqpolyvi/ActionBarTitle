(function(_){
    xmesh.broadcast = new function Broadcast(){
        var _this = $(this);
        //事件触发
        _this.emit = function(broadcastName,data){
            var evt = $.Event(broadcastName);
            evt._data = data;
            _this.trigger(evt);
        };

        //事件绑定监听
        _this.listen = function(broadcastName,callback){
            _this.bind(broadcastName,function(e){
                if(callback)callback.call(_this, e._data,e);
            });
        }
    };

    _.formatDate = function (date,pattern) {
        if(!(date instanceof Date)){
            var _date = new Date();
            _date.setTime(date);
            date = _date;
        }
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(pattern)) pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(pattern)) pattern = pattern.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return pattern;
    };

    _.copyObject = function(objA,objB){
        for(var key in objA){
            if(objB.hasOwnProperty(key) && typeof objA[key] !== "function"){
                var valueA = objA[key],valueB = objB[key];
                if(typeof valueA == "object" || typeof valueB == "object" || typeof valueA == typeof valueB || valueB == null || valueB == undefined){
                    objA[key] = objB[key];
                }else{
                    var type = (typeof valueA).replace(/^[a-z]/i,function(letter){
                        return letter.toUpperCase();
                    });
                    var value = eval(type+"("+objB[key]+")");
                    objA[key] = value;
                }
            }
        }
        return objA;
    };

    HTMLInputElement.prototype.fixKeyboard = FixKeyboard;
    HTMLTextAreaElement.prototype.fixKeyboard = FixKeyboard;
    function FixKeyboard(){
        var _self = this;
        _self.bind("focus",function(){
            setTimeout(function(){
                window.scrollTo(0,_self.clientY-10);
            },300);
        });
    }
})($);