var resPath = (function(){
    var scripts = document.getElementsByTagName("script");
    var src = scripts[scripts.length - 1].getAttribute("src");
    return src.replace(/([\w|\.]*)(\.js)$/i,"");
})();

function Keyboard(){
    var _this = $.Element("div").css({display:"none"}).addClass("customKeyboard").appendTo(document.body);
    if(!resPath)throw "can not found resource path at:" + resPath;
    var layout = resPath + "res/keyboard.xml";
    var cssPath = resPath + "res/keyboard.css";
    var style = $.Element("link").attribute("rel","stylesheet").attribute("href",cssPath);
    $("head").append(style);

    (function(){
        $.get(layout,{
            sync:true,
            dataType:"text",
            timeout:3000,
            success:function(rs){
                _this.innerHTML = rs;
            },
            error:function(){
                throw "keyboard layout load error";
            }
        })
    })();

    _this.animationDelay = 300;
    _this.option = {};
    _this.visible = false;
    var currentKeyboard;
    var _value = "";
    _this.getter("keyboard",function(){return currentKeyboard});
    _this.getter("keyboards",function(){return keyboards});
    _this.getter("value",function(){return _value});
    _this.setter("value",function(v){
        v = v || "";
        var input = currentKeyboard.input;
        if(_this.option.type == "password"){
            var arr = [];
            for(var i=0;i< v.length;i++){
                arr.push("●");
            }
            input.value = arr.join("");
        }else{
            input.value = v;
        }
        _value = v;
        if(_this.option.onvaluechange)_this.option.onvaluechange.call(_this,_value);
        checkInput();
        return v;
    });
    _this.getter("label",function(){return currentKeyboard.label.html()});
    _this.setter("label",function(l){currentKeyboard.label.html(l)});

    _this.bind("click",function(e){
        if((function(){
            var target = e.target;
            while(target){
                if(target == currentKeyboard)return false;
                target = target.parentNode;
            }
            return true;
        })()){_this.hide()}
    },false);

    var keyboards = (function init(){
        var keyboardsNodes = _this.child(".keyboard");
        var keyboards = {};
        for(var i=0;i<keyboardsNodes.length;i++){
            var keyboardNode = keyboardsNodes[i];
            var type = keyboardNode.getAttribute("type");
            if(!type)throw "keyboard type can not be null";
            keyboards[type] = keyboardNode;
            initEvent(keyboardNode);
        }

        function initEvent(keyboard){
            var input = keyboard.child(".inputBox .wordView");
            var clearButton = keyboard.child(".inputBox .clearButton");
            var keyboardBox = keyboard.child(".keyboardBox");
            keyboard.input = input;
            keyboard.inputView = keyboard.child(".inputView");
            keyboard.inputBox = keyboard.child(".inputBox");
            keyboard.keyboardBox = keyboard.child(".keyboardBox");
            keyboard.clearButton = clearButton;
            keyboard.label = keyboard.child("#tipMessage");
            keyboard.buttons = keyboard.child(".keyboardBox .cell");
            keyboard.button = {};
            for(var i=0;i<keyboard.buttons.length;i++){
                var button = keyboard.buttons[i];
                keyboard.button[button.value] = button;
            }
            keyboardBox.bind("touchend",onKeyboardClick,false);
            clearButton.bind("touchend",clearText,false);
            keyboard.bind("touchstart",function(e){e.preventDefault();e.stopPropagation()},false);
            input.getter("value",function(){return input.innerHTML});
            input.setter("value",function(v){input.innerHTML = v});
        }
        return keyboards;
    })();

    function onKeyboardClick(e){
        var button = e.target;
        if(button.getAttribute("disabled") == "disabled")return;
        var value = button.value;
        if(!value)return;
        if(actionButton[value]){
            actionButton[value].call(this,e);
            return;
        };
        var v = _this.value + value;
        var cancel = oninput(value);
        if(cancel !== false)_this.value = v;
    }

    function clearText(){
        _this.value = "";
    }

    function oninput(value){
        if(_this.option.oninput)return _this.option.oninput.call(currentKeyboard.input,value);
    }

    function checkInput(){
        var value = _this.value;
        if(value){
            currentKeyboard.clearButton.css({"display":"inline-block"});
        }else{
            currentKeyboard.clearButton.hide();
        }
        _this.trigger($.Event("input"));
    }

    var actionButton = {
        "ok":function(){
            var ok = _this.option.confirm;
            if(ok) var bool = ok.call(_this,_this.value);
            if(bool !== false)_this.hide();
        },
        "cancel":function(){
            var cancel = _this.option.cancel;
            if(cancel) var bool = cancel.call(_this,_this.value);
            if(bool !== false)_this.hide();
        },
        "del":function(){
            var value = _this.value;
            if(!value || value.length <= 0)return;
            value = value.substring(0,value.length -1);
            if(_this.option.type == "account")value = value.replace(/(\s)$/,"");
            _this.value = value;
        }
    }

    function disorderKeys(keybord,disorder){
        var keys = keybord.child(".cell");
        var numbers = [1,2,3,4,5,6,7,8,9,0];
        var count = 0;

        for(var i=0;i<keys.length;i++){
            var key = keys[i];
            if(isNaN(key.value))continue;
            if(disorder){
                var index = randomNum(0,numbers.length-1);
                var num = numbers[index];
                key.html(num).value = num;
                numbers = removeArrayIndex(numbers,index);
            }else{
                var num = numbers[count++];
                key.html(num).value = num;
            }
        }

        function removeArrayIndex(array,index){
            if(index<0){
                return array;
            }
            return array.slice(0,index).concat(array.slice(index+1,array.length));
        }

        function randomNum(minNum,maxNum){
            switch(arguments.length){
                case 1:
                    return parseInt(Math.random()*minNum+1);
                    break;
                case 2:
                    return parseInt(Math.random()*(maxNum-minNum+1)+minNum);
                    break;
                default:
                    return 0;
                    break;
            }
        }

    }

    _this.prompt = function(defaultValue,option){
        if(_this.visible)return;
        option = option || {type:"mobile"};
        _this.option = option;
        var type = option.type;
        currentKeyboard = keyboards[type];
        if(!currentKeyboard)throw "keyboard type can not found";
        if(type == "password"){
            disorderKeys(currentKeyboard,option.disorder);
        }
        _this.value = defaultValue;
        _this.label = option.label || "";
        _this.show();
        return _this;
    }

    _this.show = function(){
        document.bind("backbutton",_this.hide,false);
        currentKeyboard.css({display:"-webkit-box"}).css($.browserCore + "animation-name","keyboard_in");
        _this.css({display:"-webkit-box"});
        _this.visible = true;
        checkInput();
        return _this;
    };

    _this.hide = function(){
        currentKeyboard.css($.browserCore + "animation-name","keyboard_out");
        _this.css({background:"none"});
        setTimeout(function(){
            _this.css({"display":"none",background:""});
            currentKeyboard.css({display:"none"});
           // document.activity.registerSystemEvent(document,"backbutton",false);
            document.unbind("backbutton",_this.hide,false);
        },_this.animationDelay);
        _this.visible = false;
        return _this;
    }

    return _this;
}
