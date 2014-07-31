var service =(function(){
    function Service(){
        var _this = this;
        _this.networkSwitch = 2;//1为开发，2为测试 3为预上线环境 4生产环境
        _this.hostUrl = '';
        switch(_this.networkSwitch){
            case 1 :
                _this.hostUrl = "http://125.69.69.243:24080";
                break;
            case 2 :
                _this.hostUrl = "http://125.69.69.243:19080";
                System.sig = "36f62d17-6486-42d8-858b-42739a4f7a68|1|1|1";
                System.user_id = "868a04ea-9628-4d7d-830b-7f50443d4696";
                System.user_id_des = "7D80E50320721F11F778732ECEC475AB968ED370468E92079221FEEB7CA346E7B5F725C874EFD27E";
                System.clientId = "36f62d17-6486-42d8-858b-42739a4f7a68";
                System.auth_key = "ZLXTYLSD";
                System.pwd_key = "123456789";
                break;
            case 3 :
                _this.hostUrl = "http://interfaces.cdzlxt.com:80";
                System.sig = "10086500_10080051_20000001_02040000";
                System.user_id = "polyviHTML";
                System.auth_key = "ZLXTYLSD";
                System.pwd_key = "12345678";
                break;
            case 4 :
                _this.hostUrl = "http://interfaces.cdzlxt.com";
                System.sig = "10086500_10080051_20000001_02040000";
                System.user_id = "polyviHTML";
                System.auth_key = "ZLXTYLSD";
                System.pwd_key = "65974213";
                break;
        }

        _this.timeout = 60000;
        _this.busynessMessage = null;
        _this.busynessDialog = null;

        _this.get = function(){
            return ajax(arguments,"GET");
        };

        _this.post = function(){
            return ajax(arguments,"POST");
        };

        _this.put = function(){
            return ajax(arguments,"PUT");
        };

        _this.del = function(){
            return ajax(arguments,"DELETE");
        };

        function ajax(param,method){
            var isForceAbort = false;
            var isBackButton = false;
            var url,data,success,failure,isDisplay,header;
            var __this = this;
            __this.xmlHttpRequest = null;
            if(param.length == 3){
                url = param[0];
                success = param[1];
                failure = param[2];
            }else{
                url = param[0];
                data = param[1];
                success = param[2];
                failure = param[3];
                isDisplay = param[4];
                header = param[5] || null ;
            }

            if(data && method!="GET" && typeof data == "object")data = $.toJson(data);
            if(navigator.connection.type == Connection.NONE){
                return Dialog.toast("无网络连接，请检查您的网络设置");
            }
            var headers = {"user_id":System.user_id_des,"sig":System.sig};
            var headerForYA = {"u_id":xmesh.model["User"].u_id,"u_s":xmesh.model["User"].u_s};
            if(header){
                $.each(header,function(i,item){
                    headers[item.key] = item.value;
                });
            }
            var regxp = /^http:\/\//;
            return __this.xmlHttpRequest = Zepto.ajax({
                url:regxp.test(url)?url:_this.hostUrl+url,
                type:method,
                dataType:"json",
                data: data,
                timeout: _this.timeout,
                headers: regxp.test(url)?headerForYA:headers,
                contentType: 'application/json',
                global:false,
                cache:false,
                success:function(data){
                    destroyDialog();
                    if(!regxp.test(url)){
                        if(data.code == "200"){
                            if(success)success.apply(this,arguments);
                        }else{
                            var error = new Error();
                            error.code = data.code;
                            error.message = data.msg;
                            error.type = "error";
                            if(failure)failure.call(this,error);
                        }
                    }else{
                        if(Object.prototype.toString.call(data) == "[object Array]"){
                            if(data[0].resultCode == "00"){
                                if(success)success.apply(this,arguments);
                            }else{
                                if(failure)failure.apply(this,arguments);
                            }
                        }
                        else{
                            if(data.resultCode == "00" || data.code == "200"){
                                if(success)success.apply(this,arguments);
                            }else{
                                if(data.resultCode) msg(data.resultCode);
                                if(data.code) Dialog.alert(data.msg);
                            }
                        }
                    }
                },
                //发送之前
                beforeSend:function(xhr){
                    __this.xmlHttpRequest = xhr;
                    if(!isDisplay){
                        if(_this.busynessMessage){
                            _this.busynessDialog = Dialog.progressDialog.show(_this.busynessMessage).bind("close",_abort,false);
                            PageManager.activePage.bind("backbutton",function(){
                                isBackButton = true;
                                _abort();
                            },false);
                        }
                    }
                },
                error: function(xhr,type){
                    destroyDialog();
                    var error = new Error();
                    error.code = xhr.status;
                    error.type = type;
                    switch (type){
                        case "error":
                            if(xhr.status == 500){
                                if(!xhr.responseText){
                                    error.message = "未知服务异常";
                                }else{
                                    var response = $.parseJson(xhr.responseText) || {};
                                    error.message = response["message"] || "未知错误";
                                    error.code = response["code"];
                                }
                            }else{
                                error.message = "通信失败,错误码:"+ error.code;
                            }
                            break;
                        case "timeout":if(isForceAbort && isBackButton)error.message = null; else {error.message = "网络连接超时";}
                            break;
                        case "abort":if(isForceAbort)error.message = null;
                            else error.message = "服务连接中断,错误码:"+(isNaN(error.code)?-1:error.code);
                            break;
                        default :error.message = "服务不可用,错误码:"+(isNaN(error.code)?-1:error.code);
                    }
                    if(failure)failure.call(this,error);
                    var evt = $.Event("serviceerror");
                    evt.error = error;
                    document.trigger(evt);
                }
            });

            function destroyDialog(){
                if(_this.busynessDialog)_this.busynessDialog.unbind("close",_abort,false).close();
                _this.busynessDialog = null;
                _this.busynessMessage = null;
            }
            function _abort(){
                isForceAbort = true;
                if(_this.busynessDialog)_this.busynessDialog.unbind("close",_abort,false);
                if(__this.xmlHttpRequest)__this.xmlHttpRequest.abort();
                _this.busynessDialog = null;
                _this.busynessMessage = null;
            }
            function msg(code){
              switch(code){
                  case "01":Dialog.alert("验证操作权限失败，数据库连接失败");break;
                  case "02":Dialog.alert("没有在数据库中找到该用户资料");break;
                  case "03":Dialog.alert("该用户目前没有任何费用");break;
                  case "04":Dialog.alert("错误的交易码");break;
                  case "05":Dialog.alert("执行服务失败");break;
                  case "06":Dialog.alert("没有收费记录不能操作");break;
                  case "07":Dialog.alert("金额校验失败");break;
                  case "08":Dialog.alert("预存用户不允许代扣");break;
                  case "09":Dialog.alert("参数个数错误");break;
                  case "10":Dialog.alert("不支持该交易方式");break;
                  case "11":Dialog.alert("消息标题超长");break;
                  case "12":Dialog.alert("消息内容超长");break;
                  case "13":Dialog.alert("没有查到该交易记录");break;
                  case "99":Dialog.alert("没有指定的错误");break;
              }
            }
        }
    }
    return new Service();
})();