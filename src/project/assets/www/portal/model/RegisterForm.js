function RegisterForm(_){
	
	var _this = _(this).bind('reset', function(){clearInterval(_validTimer);_validTimer=null;});
	var _validTimer;
	
	this.phone = '';
	this.validCode = '';
	this.password = '';
	this.password_ = '';
	this.nickName = '';
	this.validButton = 61;
    this.reg_ip = "192.168.1.2";
		
	this._validation = {
        phone:[function(value){
            if(!Validator.mobile(value))return "请先输入正确的手机号";
        }],
		validCode:[function(value){
            if(!Validator.required(value))return "验证码不能为空";
        }],
        password:[function(value){
			if(value=='') return '密码不能为空';
			if(value.length<6||value.length>16) return '密码长度在6到16位之间';
            if(!Validator.checkPwd(value))return "密码不能为全数字、字母或符号";
		}],
		password_:[function(value){
            if(!Validator.required(value))return "请输入两次密码";
        }]
	}
	
	this._format = {
		validButton:function(value){
			if(value>60||value<0) return '获取';
			return value+'s';
		}
	}

    //---------------------------------------------------------------
    //	获取短信注册验证码
    //---------------------------------------------------------------
    this.getRegistValidCode = function(phoneNum){
        if(!Validator.required(phoneNum))return Dialog.toast("请输入手机号");
        if(!Validator.mobile(phoneNum))return Dialog.toast("请输入正确的手机号");
        System.getIdentifyCode({
            phone : phoneNum,
            type : "register"
        },function(){
            Dialog.toast('验证码将通过短信发送到您的手机');
        },function(){Dialog.toast('验证码获取失败');_validCodeTimer = null;});
        return true;
    }

	this.getValidCode = function(number){
		if(_validTimer) return Dialog.alert('不能在一分钟内重复请求验证码');
		if(!this.getRegistValidCode(number)) return;
		_this.validButton = 60;
		_validTimer = setInterval(function(){
				_this.validButton--;
				if(_this.validButton<0){
					clearInterval(_validTimer);
					_validTimer = null;
				}
		}, 1000);
	}
	
	this.submit = function(success, failure){
		var msg = compareTwoPasswords();
		if(msg) return Dialog.alert(msg);
        encryptForDes(System.pwd_key, _this.phone, function(rs){
            _this.phoneDes = rs;
            var pwdData = {"P":_this.password,"T":Validator.getDate()};
            encryptRSA(JSON.stringify(pwdData),function(rs){
                _this.passwordDes = rs;
                var data = {phone: _this.phoneDes,password:_this.passwordDes,identify_code:_this.validCode,reg_ip: _this.reg_ip};
                service.busynessMessage = "正在注册...";
                service.get("/user/userRegister.do",data,function(rs){
					_this.reset();
                    if(success)success.apply(_this,arguments);
                },failure);
            }, function(){alert("加密错误");});
        }, function(){alert("加密错误");});
	}
	
	function compareTwoPasswords(){
		return _this.password==_this.password_?null:'两次密码输入不一致';
	}
}