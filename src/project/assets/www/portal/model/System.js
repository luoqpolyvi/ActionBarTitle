var System ={
    user_id : "",//客户端的用户id
    user_id_des : "",//客户端的用户id 经过des加密后
    clientId : "",//客户端id
    channelId : 1,//渠道id
    version : 1.0,//版本号
    build : 1.0,//构建号
    data : {},//参数的地方
    auth_key : "",
    pwd_key : "",
    appName : "智慧雅安",
    RSA_Modulus : "104847128449430579184014780294490033196043953230662756206100618937825307824995427383348347508569814609599912949434509587284095390859651544212237935019726443216207510532722352997941258211573916298088422682826227519134069593503308131331745344679366764148825489440921177120484534847236678909253660059983530217363",
    RSA_Exponent : "3",
    //---------------------------------------------------------------
    //	退出应用
    //---------------------------------------------------------------
    exit : function(noConfirm){
        if(noConfirm){
            navigator.app.exitApp();
        }else{
            Dialog.confirm('确定要离开应用？', function(){
                navigator.app.exitApp();
            });
        }
    },

    /**
     * 获取验证码
     * @param data
     * @param success
     * @param error
     */
    getIdentifyCode : function(data,success,error){
        encryptForDes(System.pwd_key, data.phone, function(rs){
            data.phone = rs;
            service.get("/user/getIdentifyCode.do",data,function(rs){
                if(success)success.apply(rs,arguments);
            },error);
        }, function(){alert("加密错误");});
    }
};


//System.sig = System.clientId + "|" + System.channelId + "|" + System.version + "|" + System.build;
//document.bind("deviceready",function(){
//    encryptForDes(System.auth_key, System.user_id, function(rs){
//    System.user_id_des = "7D80E50320721F11F778732ECEC475AB968ED370468E92079221FEEB7CA346E7B5F725C874EFD27E";
//    }, function(){alert("加密错误");});
//});
