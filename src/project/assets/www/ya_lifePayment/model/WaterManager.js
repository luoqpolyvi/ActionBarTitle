function WaterManager(){
    var _this=this;
    switch (service.networkSwitch){
        case 1 :break;
        case 2 :_this.hostUrl = "http://polyvi.net:880/";break;    //todo _this.hostUrl = "http://polyvi.net:880/"
        case 3 :break;
        case 4 :_this.hostUrl = "http://125.69.69.243:35080/";break;
    }
    _this.resultCode = "";       //信息码
    _this.userNum = "";          //用户编号
    _this.userName = "";         //用户名称
    _this.address = "";          //地址
    _this.waterInfo = [];
    _this.money = "";                         //缴费总额
    _this.liquidatedDamages = "";             //违约金总额
    _this.accountList = [];                  //账号列表
    _this.statuses=0;                        //跳转状态
    _this.historyList = {};                  //历史记录

    /*查询欠费接口*/
    _this.getWaterArrears = function(data,success,error){
        reset();
        service.post(_this.hostUrl+"sy/client/water.do",{
            method:"queryArrears",
            userNum:data.userNum
        },function(rs){
            $.copyObject(_this,rs);
            if(success)success.apply(_this,arguments);
        },error);
    }

    /*查询缴费历史接口*/
    _this.getWaterPayment = function(data,success,error){
        service.post(_this.hostUrl+"sy/client/water.do",{
            method:"queryPayDetails",
            userNum:data.userNum
        },function(rs){
            _this.historyList = rs;
            if(success)success.apply(_this,arguments);
        },error);
    }

    /*增加缴费账号*/
    _this.addPaymentAccount = function(data,success,error){
        var checkResult = _check();
        if(checkResult !== true)return error.call(this,new ValidateError(checkResult));
        service.post(_this.hostUrl+"sy/client/addReminder.do",{
            type:data.type,
            identifyCode:data.identifyCode,
            day:data.day,
            nf:data.nf,
            nf1:data.nf1,
            remark:data.remark
        },function(rs){
            if(success)success.apply(_this,arguments);
        },error);
        function _check(){
            if(!Validator.required(data.identifyCode))return "请输入缴费账号";
            if(!Validator.required(data.remark))return "请输入缴费描述";
            return true;
        }
    }

    /*删除缴费账号*/
    _this.deletePaymentAccount = function(data,success,error){
        service.post(_this.hostUrl+"sy/client/deleteReminder.do",{
            type:data.type,
            identifyCode:data.identifyCode
        },function(rs){
            if(success)success.apply(_this,arguments);
        },error);
    }

    /*获取账号列表*/
    _this.getPaymentAccount = function(success,error){
        service.post(_this.hostUrl+"sy/client/getReminder.do",function(rs){
            _this.accountList = rs.data.dataList;
            if(success)success.apply(_this,arguments);
        },error);
    }

    /*缴费*/
    _this.payWater = function(data,success,error){
        service.busynessMessage = "网络连接中，请稍候...";
        service.post(_this.hostUrl+"sy/client/water.do",{
            method:"pay",
            userNum:data.userNum,
            userName:data.userName,
            money:data.money
        },function(rs){
            if(success)success.apply(_this,arguments);
        },error);
    }

    function reset(){
        _this.resultCode = "";       //信息码
        _this.userNum = "";          //用户编号
        _this.userName = "";         //用户名称
        _this.address = "";          //地址
        _this.waterInfo = [];
        _this.money = "";                         //缴费总额
        _this.liquidatedDamages = "";             //违约金总额
        _this.accountList = [];                  //账号列表
        _this.statuses=0;                        //跳转状态
    }
}
