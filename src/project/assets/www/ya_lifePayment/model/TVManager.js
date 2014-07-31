function TVManager(){
    var _this = this;
    switch (service.networkSwitch){
        case 1 :break;
        case 2 :_this.hostUrl = "http://polyvi.net:880/";break;    //todo
        case 3 :break;
        case 4 :_this.hostUrl = "http://125.69.69.243:35080/";break;
    }
    _this.resultCode = "";       //信息码
    _this.userNum = "";          //用户编号
    _this.userName = "";         //用户名称
    _this.balance = "";          //余额
    _this.usedMoney = "";        //已消费金额
    _this.historyList = {};      //历史记录


    /*广电查询余额*/
    _this.getTVBalance = function(data,success,error){
        reset();
        service.post( _this.hostUrl+"sy/client/sarft.do",{
            method:"queryBalance",
            userNum:data.userNum
        },function(rs){
            $.copyObject(_this,rs);
            if(success)success.apply(_this,arguments);
        },error);
    };

    function reset(){
        _this.resultCode = "";       //信息码
        _this.userNum = "";          //用户编号
        _this.userName = "";         //用户名称
        _this.balance = "";          //余额
        _this.usedMoney = "";        //已消费金额
    }

    /*广电缴费*/
    _this.payTV = function(data,success,error){
        service.post( _this.hostUrl+"sy/client/sarft.do",{
            method:"pay",
            userNum:_this.userNum,
            money:data.money
        },function(rs){
            if(success)success.apply(_this,arguments);
        },error);
    };

    /*广电查询缴费历史*/
    _this.getTVPayment = function(data,success,error){
        service.post( _this.hostUrl+"sy/client/sarft.do",{
            method:"queryPayRecord",
            userNum:data.userNum
        },function(rs){
            _this.historyList = rs;
            if(success)success.apply(_this,arguments);
        },error);
    }
}
