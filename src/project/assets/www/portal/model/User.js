/**
 * 用户对象
 * @constructor
 */
function User(){
    var _this = this;
    this.merchantCode = "";//商户编号
    this.code = "";//员工工号
    this.password = "";//登录密码
    this.type = "";//用户类型
    this.name = "";//用户名称
    this.id = "";//用户id
    this.state = "";//用户状态
    this.createTime = "";
    this.lastLoginTime = "";
    this.address = "";
    this.gender = "";
    this.email = "";
    this.avatar = "";
    this.nickName = "";
    this.phone = "";
    this.m_id = "";//银联用户ID
    this.cpwd="";//接口用户密码MD5加密
    this.idNumber = "";           //身份证号码
    this.balance = "";            //帐户余额（单位分）
    this.frozenBalance = "";      //冻结金额（单位分）
    this.extractiveBalance = "";  //账户可提现余额（单位分）
    this.balanceYuan = "";            //帐户余额（单位元）
    this.frozenBalanceYuan = "";      //冻结金额（单位元）
    this.extractiveBalanceYuan = "";  //账户可提现余额（单位元）
    this.idNumberFormat = "";           //身份证号码（格式化）
    this.nameFormat = "";               //用户名称（格式化）
    this.phoneFormat = "";              //电话号码（格式化）
    this.bankCardId = "";                    //提现卡号
    this.bankName = "";               //提现卡名字
    this.bankCardImage = "";               //提现卡图片
    this.isLogin = false;  //是否登录
    this.user_name = "";
    this.id_number = "";
    this.validity = "";
    this.phone_back = "";
    this.cardFlag = false;
    this.u_id = "";
    this.u_s = "";

    this.phone_format = "";
    this.id_number_format = "";
    this.phone_back_format = "";


    this._format = {
        phone_format : function(){
            return Validator.formatPhone(xmesh.model["User"].phone);
        },
        id_number_format : function(){
            return Validator.formatIdCard(xmesh.model["User"].id_number);
        },
        phone_back_format : function(){
            return Validator.formatPhone(xmesh.model["User"].phone_back);
        }
    }

    this.setLastUserPhone = function(userPhone){
        return localStorage.setItem("userPhone",userPhone);
    }

    this.getLastUserPhone = function(){
        return localStorage.getItem("userPhone");
    }

    /**
     * 登录13980820935
     123qwe

     * @param data
     * @param success
     * @param error
     */
    this.login = function(data,success,error){
        var checkResult = _check();
        if(checkResult !== true)return error.call(this,new ValidateError(checkResult));
        encryptForDes(System.pwd_key, data.phone, function(rs){
            data.phone = rs;
            var pwdData = {"P":data.password,"T":Validator.getDate()};
            encryptRSA(JSON.stringify(pwdData),function(rs){
                data.password = rs;data.token = device.imsi || "123213";data.sys_type = $.isIOS ? 2: 1;
                service.get("/user/userLogin.do",data,function(rs){
                    $.copyObject(_this,rs.data);_this.isLogin = true;
                    _this.setLastUserPhone(rs.data.phone);
                    _this.phoneFormat = Validator.formatPhone(rs.data.phone);
                    if(success)success.apply(_this,arguments);
                },error);
            },function(){alert("加密错误");});
        }, function(){alert("加密错误");});
        function _check(){
            if(!Validator.required(data.phone))return "请输入手机号";
            if(!Validator.mobile(data.phone))return "请输入正确的手机号";
            if(!Validator.required(data.password))return "请输入密码";
            if(!Validator.pwd(data.password))return "请输入正确的登录密码";
            return true;
        }
    };

    /**
     * 获取用户消息
     * @param success
     * @param error
     */
    _this.getUserInfo = function (success,error){
        encryptForDes(System.pwd_key, _this.id, function(rs){
            service.post("/user/getUserInfo.do",{u_id:rs},function(rs){
                if(rs.data != null){$.copyObject(_this,rs.data);}
                if(success)success.apply(_this,arguments);
            },error);
        }, function(){alert("加密错误");});
    }

    /**
     * 修改用户信息
     * @param data
     * @param success
     * @param error
     */
    _this.updateUserInfo = function(data,success,error){
        encryptForDes(System.pwd_key, _this.id, function(da){
            service.post("/user/updateUserInfo.do",{u_id : da,user_name:data.user_name,id_number:data.id_number,name:data.name,email:data.email,phone_back:data.phone_back},function(rs){
                with(_this){
                    user_name = data.user_name
                    id_number = data.id_number
                    name = data.name
                    email = data.email
                    phone_back = data.phone_back
                }
                if(success)success.apply(_this,arguments);
            },error);
        }, function(){alert("加密错误");});
    }

    /**
     * 修改用户密码
     * @param success
     * @param error
     */
    _this.resetPassword = function (oldPwd,newPwd,rePwd,success,error){
        var checkResult = _check();
        if(checkResult !== true)return error.call(this,new ValidateError(checkResult));
        var data = {};
        encryptForDes(System.pwd_key, _this.id, function(rs){
            data.u_id = rs;
            var pwdData = {"P":oldPwd,"T":Validator.getDate()};
            encryptRSA(JSON.stringify(pwdData),function(rs){
                data.old_password = rs;
                pwdData.P = newPwd;
                encryptRSA(JSON.stringify(pwdData),function(rs){
                    data.new_password = rs;
                    service.get("/user/resetPassword.do",{u_id:data.u_id,old_password:data.old_password,new_password:data.new_password},function(rs){
                        if(rs.data != null){$.copyObject(_this,rs.data);}
                        if(success)success.apply(_this,arguments);
                    },error);
                }, function(){alert("加密错误");});
            }, function(){alert("加密错误");});
        }, function(){alert("加密错误");});
        function _check(){
            if(!Validator.required(oldPwd))return "请输入当前密码";
            if(!Validator.required(newPwd))return "请输入新密码";
            if(!Validator.required(rePwd))return "请再次输入新密码";
            if(!Validator.equal(newPwd,rePwd))return "两次输入的密码不一致，请重新输入";
            return true;
        }
    }


    /*用户资料查询
     * @param data
     * @param success
     * @param error
     * */
    this.search = function(data,success,error){
        encryptForDes(System.pwd_key,data.phone, function(rs){
            data.phone = rs;
            service.get("/lottery/getUserInfo.do",{phone:data.phone},function(rs){
                if(rs.data != null){
                    _this.name = rs.data.name;
                    _this.extractiveBalance = rs.data.extractiveBalance;
                    _this.balanceYuan = Validator.convertFenToYuan(rs.data.balance);
                    _this.frozenBalanceYuan = Validator.convertFenToYuan(rs.data.frozenBalance);
                    _this.extractiveBalanceYuan = Validator.convertFenToYuan(rs.data.extractiveBalance);
                    _this.idNumberFormat = Validator.formatIdCard(rs.data.idNumber);
                    _this.idNumber = rs.data.idNumber;
                    _this.id_number = rs.data.idNumber;
                    _this.nameFormat = Validator.formatName(rs.data.name);
                    _this.phoneFormat = Validator.formatPhone(rs.data.phone);
                }
                else{
                    _this.balance = "未注册！";
                }
                if(success)success.apply(_this,arguments);
            },error);
        }, function(){Dialog.alert("加密错误");});
    }

    /*补充用户信息
     * @param data
     * @param success
     * @param error
     * */
    this.supplement = function(data,success,error){
        var checkResult = _check();
        if(checkResult !== true)return error.call(this,new ValidateError(checkResult));
        encryptForDes(System.pwd_key, data.u_id, function(rs){
            data.u_id = rs;
            encryptForDes(System.pwd_key, data.name, function(rs){
                data.name = rs;
                encryptForDes(System.pwd_key, data.id_number, function(rs){
                    data.id_number = rs;
                    encryptForDes(System.pwd_key, data.phone, function(rs){
                        data.phone = rs;
                        service.post("/lottery/userReg.do",data,function(rs){
                            $.copyObject(_this,rs.data);
                            _this.idNumber = rs.data.idNumber;
                            _this.id_number = rs.data.idNumber;
                            if(success)success.apply(_this,arguments);
                        },error);
                    }, function(){Dialog.alert("加密错误");});
                }, function(){Dialog.alert("加密错误");});
            }, function(){Dialog.alert("加密错误");});
        }, function(){Dialog.alert("加密错误");});
        function _check(){
            if(!Validator.required(data.name))return "请输入姓名";
            if(!Validator.required(data.id_number))return "请输入身份证号码";
            return Validator.checkIdCardNum(data.id_number);
            return true;
        }
    }
}

User.GENERAL_TYPE = 0;
User.ADMINISTRATOR_TYPE = 1;