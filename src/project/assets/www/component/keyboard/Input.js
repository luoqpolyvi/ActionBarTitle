function Input(_,param){
    var _this = this;

    var _param = param || {};
    var DEFAULT_CONFIG = {
        MOBILE:{
            maxlength:11,
            minlength:11,
            regexp:/^1[3|4|5|8][0-9]\d{4,8}$/,
            validateMessage:"请输入正确手机号"
        },
        PASSWORD:{
            maxlength:6,
            minlength:6,
            validateMessage:"请输入六位数密码"
        },
        IDCARD:{
            maxlength:18,
            minlength:18,
            regexp:/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/,
            validateMessage:"请输入正确的18位身份证号"
        },
        AMOUNT:{
            maxlength:12,
            minlength:1,
            regexp:/^([1-9][\d]{0,12}|0)(\.[\d]{1,2})?$/,
            validateMessage:"请输入正确的金额"
        },
        ACCOUNT:{
            maxlength:19,
            minlength:6,
            validateMessage:"账号不合法"
        }
    }

    _param.type = getParam('type','password');
    _param.disabled = getParam('disabled','false');
    var _type = _param.type.toUpperCase();
    _param.placeholder = getParam('placeholder','');
    _param.required = getParam('required','');
    _param.value = getParam('value','');
    _param.label = getParam('label','');
    _param.oninput = getParam('oninput',_doNothing);
    _param.required = getParam('required',false);
    _param.max = getParam('max',999999999.99);
    _param.min = getParam('min',0.01);
    var _onconfim = _param.onconfim = getParam('onconfirm',_doNothing);
    _param.oncancel = getParam('oncancel',_doNothing);
    _param.disorder = getParam('disorder',_param.type == "password");

    _this.html = undefined;
    (function(){
        if(_this.tagName == "INPUT"){
            _this.attribute("contenteditable","false");
            _this.attribute("readonly","readonly");
            _this.css({"-webkit-user-modify":"read-only"});
            return;
        }
        var _value = "";
        _this.getter("value",function(){
            if(_type == "account")return _value.replace(/\s/g,"");
            return _value;
        });
        _this.setter("value",function(v){
            _value = v.toString() || "";
            if(!_value){
                _this.innerHTML = _param.placeholder;
                _this.addClass("placeholder");
                return;
            }else{
                if(_this.hasClass("placeholder"))_this.removeClass("placeholder");
            }
            if(_param.type == "password"){
                var arr = []
                for(var i=0;i< _value.length;i++){
                    arr.push("●");
                }
                _this.innerHTML = arr.join("");
            }else{
                _this.innerHTML = _value;
            }
        });
    })();

    validate(DEFAULT_CONFIG[_type.toUpperCase()]);

    function validate(validation){
        _param.maxlength = getParam('maxlength',validation.maxlength);
        _param.minlength = getParam('minlength',validation.minlength);
        _param.regexp = getParam('pattern',validation.regexp);
        _param.validateMessage = getParam('validateMessage',validation.validateMessage);
        _param.oninput = function(v){
            var value = document.keyboard.value;
            if(!value && _param.required)return true;
            if(_type == "ACCOUNT"){
                value = rejectBlank(value);
                return formatAccount(value+v || "");
            }
            if(value.length >= _param.maxlength)return false;
            if(_type == "AMOUNT"){
                if(v == "."){
                    if(value){
                        if(value == "0")return;
                        var amount = parseFloat(value);
                        if(_param.max && amount > _param.max){
                            return false;
                        }
                    }else{
                        return false;
                    }
                }
                if(value == "0" && v != "."){
                    document.keyboard.value = v;
                    return false;
                }
                var index = value.indexOf(".");
                if(index != -1){
                    if(v==".")return false;
                    if((value.substring(index+1, value.length)+v).length>2)return false;
                }
                var amount = parseFloat(value + v);
                if(value && !isNaN(amount) && v !="."){
                    if(_param.max && amount > _param.max){
                        Dialog.toast("金额不能高于 "+_param.max);
                        return false;
                    }
                }
            }
        }
        _param.onvaluechange = function(value){
            _checkInput(_param,value);
        }
        _param.onconfim = function(){
            var value = document.keyboard.value;
            if(!value && _param.required)return true;
            if(_type == "ACCOUNT")value = rejectBlank(value);
            if(value.length > _param.maxlength || value.length < _param.minlength)return false;
            if(_param.regexp && !_param.regexp.test(value))return false;
            return true;
        }
    }

    function formatAccount(value){
        var rv = rejectBlank(value);
        var newVal = rv.replace(/\w/gi, function (d,i) {
            if (i > 0 && (i+1)%4 === 0) {
                return d + " "
            }else{
                return d;
            }
        });
        if(rv.length <= _param.maxlength)document.keyboard.value = newVal;
        return false;
    }

    function rejectBlank(str){
        return str.replace(/\s/g,"");
    }

    function _checkInput(_param,value){
        if(!value && _param.required)return;
        if(_type == "ACCOUNT"){value = value.replace(/\s/g,"")}
        if(value.length <= _param.maxlength && value.length >= _param.minlength){
            if(_param.pattern){
                if(_param.pattern.test(value)){
                    _success();
                }else{
                    _error();
                }
            }else{
                _success();
            }
        }else{
            _error();
        }
        if(_type == "AMOUNT"){
            if(/\.$/.test(value)){
                _error();
            }else if(!value){
                _error();
            }else{
                _success();
            }
        }

        function _success(){
            var button = document.keyboard.keyboard.button["ok"];
            button.removeAttribute("disabled");
        }

        function _error(){
            var button = document.keyboard.keyboard.button["ok"];
            button.setAttribute("disabled","disabled");
        }
    }

    _this.bind("click", function (e) {
        var target = _this;
        var option = {
            type: _param.type,
            label:_param.label,
            confirm: function (value) {
                if(_type == "AMOUNT"){
                    var amount = parseFloat(value);
                    if(_param.min && amount < _param.min){
                        Dialog.toast("金额不能低于 "+_param.min);
                        return false;
                    }
                    value = parseFloat(value).toFixed(2);
                    if(isNaN(value))value="";
                }
                if(_param.onconfim)var bool = _param.onconfim.call(this,value);
                if(bool == false){
                    if(_param.validateMessage)Dialog.toast(_param.validateMessage);
                }else{
                    target.value = value;
                    if(_onconfim)var flag = _onconfim.call(this,value);
                }

                _this.trigger(_.Event("close"));
                return typeof flag == "boolean" ? flag : bool;
            },
            disorder:_param.disorder,
            onvaluechange:_param.onvaluechange,
            oninput:_param.oninput,
            cancel:function(){
                if(_param.cancel)_param.cancel.call(this);
                _this.trigger(_.Event("close"));
            }
        }
        document.keyboard.prompt(target.value, option);
    }, false);

    _this.prompt = function(){
        _this.click();
    }

    _this.close = function(){
        document.keyboard.hide();
    }

    _this.value = _param.value;
    function _doNothing(){};
}