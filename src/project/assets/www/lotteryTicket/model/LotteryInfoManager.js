function LotteryInfoManager(){
    var _this = this;

    this.page_size = "10";

    this.lotterySSQWinRecord = new Page("0");//SSQ开奖记录

    this.lottery3DWinRecord = new Page("0");//3D开奖记录

    this.lotteryQLCWinRecord = new Page("0");//QLC开奖记录

    this.buyLotteryAllList = new Page("0");//全部代购记录

    this.buyLotteryWinList = new Page("0");//中奖代购记录


    /**
     * 投注接口 buyLottery
     *
     */
    this.buyLottery = function(param,success,error){
        encryptForDes(System.pwd_key,param.phone,function(phone){
             param.phone = phone;
            encryptForDes(System.pwd_key,param.id_number,function(id_number){
                param.id_number = id_number;
                encryptForDes(System.pwd_key,param.name,function(name){
                    param.name = name;
                    service.post("/lottery/buyLottery.do",param,function(rs){
                        if(success)success.apply(_this,arguments);
                    },error);
                },function(){Dialog.alert("加密错误");})
            },function(){Dialog.alert("加密错误");})
        },function(){Dialog.alert("加密错误");})
    }
    /**
     * 开奖信息  getDrawInfo
     *
     */
    this.getDrawInfo = function(game,success,error){
  //  return [{"codes":"01,02,03,04,05,06|07","game":"SSQ","level":[{"index":"1","money":"500000000","name":"一等奖","num":"0"},{"index":"2","money":"30000000","name":"二等奖","num":"0"},{"index":"3","money":"300000","name":"三等奖","num":"0"},{"index":"4","money":"20000","name":"四等奖","num":"0"},{"index":"5","money":"1000","name":"五等奖","num":"0"},{"index":"6","money":"500","name":"六等奖","num":"0"}],"sales":"12345678900","termCode":"2013143","time":"2013-12-05","winPools":"2000000000"},{"codes":"01,02,03,04,05,06|07","game":"SSQ","level":[{"index":"1","money":"500000000","name":"一等奖","num":"0"},{"index":"2","money":"30000000","name":"二等奖","num":"0"},{"index":"3","money":"300000","name":"三等奖","num":"0"},{"index":"4","money":"20000","name":"四等奖","num":"0"},{"index":"5","money":"1000","name":"五等奖","num":"0"},{"index":"6","money":"500","name":"六等奖","num":"0"}],"sales":"12345678900","termCode":"2013142","time":"2013-12-03","winPools":"2000000000"},{"codes":"01,02,03,04,05,06|07","game":"SSQ","level":[{"index":"1","money":"500000000","name":"一等奖","num":"0"},{"index":"2","money":"30000000","name":"二等奖","num":"0"},{"index":"3","money":"300000","name":"三等奖","num":"0"},{"index":"4","money":"20000","name":"四等奖","num":"0"},{"index":"5","money":"1000","name":"五等奖","num":"0"},{"index":"6","money":"500","name":"六等奖","num":"0"}],"sales":"12345678900","termCode":"2013139","time":"2013-11-26","winPools":"2000000000"},{"codes":"01,02,03,04,05,06|07","game":"SSQ","level":[{"index":"1","money":"500000000","name":"一等奖","num":"0"},{"index":"2","money":"30000000","name":"二等奖","num":"0"},{"index":"3","money":"300000","name":"三等奖","num":"0"},{"index":"4","money":"20000","name":"四等奖","num":"0"},{"index":"5","money":"1000","name":"五等奖","num":"0"},{"index":"6","money":"500","name":"六等奖","num":"0"}],"sales":"12345678900","termCode":"2013138","time":"2013-11-24","winPools":"2000000000"},{"codes":"01,02,03,04,05,06|07","game":"SSQ","level":[{"index":"1","money":"500000000","name":"一等奖","num":"0"},{"index":"2","money":"30000000","name":"二等奖","num":"0"},{"index":"3","money":"300000","name":"三等奖","num":"0"},{"index":"4","money":"20000","name":"四等奖","num":"0"},{"index":"5","money":"1000","name":"五等奖","num":"0"},{"index":"6","money":"500","name":"六等奖","num":"0"}],"sales":"12345678900","termCode":"2013137","time":"2013-11-21","winPools":"2000000000"},{"codes":"01,02,03,04,05,06|07","game":"SSQ","level":[{"index":"1","money":"500000000","name":"一等奖","num":"0"},{"index":"2","money":"30000000","name":"二等奖","num":"0"},{"index":"3","money":"300000","name":"三等奖","num":"0"},{"index":"4","money":"20000","name":"四等奖","num":"0"},{"index":"5","money":"1000","name":"五等奖","num":"0"},{"index":"6","money":"500","name":"六等奖","num":"0"}],"sales":"12345678900","termCode":"2013133","time":"2013-11-12","winPools":"2000000000"},{"codes":"01,02,03,04,05,06|07","game":"SSQ","level":[{"index":"1","money":"500000000","name":"一等奖","num":"0"},{"index":"2","money":"30000000","name":"二等奖","num":"0"},{"index":"3","money":"300000","name":"三等奖","num":"0"},{"index":"4","money":"20000","name":"四等奖","num":"0"},{"index":"5","money":"1000","name":"五等奖","num":"0"},{"index":"6","money":"500","name":"六等奖","num":"0"}],"sales":"12345678900","termCode":"2013132","time":"2013-11-10","winPools":"2000000000"},{"codes":"01,02,03,04,05,06|07","game":"SSQ","level":[{"index":"1","money":"500000000","name":"一等奖","num":"0"},{"index":"2","money":"30000000","name":"二等奖","num":"0"},{"index":"3","money":"300000","name":"三等奖","num":"0"},{"index":"4","money":"20000","name":"四等奖","num":"0"},{"index":"5","money":"1000","name":"五等奖","num":"0"},{"index":"6","money":"500","name":"六等奖","num":"0"}],"sales":"12345678900","termCode":"2013131","time":"2013-11-07","winPools":"2000000000"}]
   var lotteryRecord =(game=="SSQ")?_this.lotterySSQWinRecord :((game=="3D")?_this.lottery3DWinRecord:_this.lotteryQLCWinRecord);
    service.get("/lottery/getDrawInfo.do",{
        game:game,
        begin_term_code:lotteryRecord.pageIndex,
        page_size:_this.page_size
    },function(rs){
        var list =  rs.data.dataList;
        if(game=="3D") $.each(list,function(property,item){
            item.codes = xmesh.model["Lottery3D"].doubleCode(item.codes);
        })
        lotteryRecord.pageIndex = list[list.length-1].termCode;
        lotteryRecord.addAll(list);
        if(success)success.call(_this,list);
    },error)
}
    /**
     * 购彩记录 getBuyLotteryList
     * flag 0=查询全部  1=查询中奖
     *
     */
    this.getBuyLotteryList = function(flag,success,error){
      //  return [{"game":"QLC","index":"100018851","sellMoney":"200","sellTime":"2013-12-06 14:09","state":"3","termCode":"2013143","winMoney":"0"},{"game":"3D","index":"100018850","sellMoney":"200","sellTime":"2013-12-03 14:22","state":"2","termCode":"2013330","winMoney":"0"},{"game":"3D","index":"100018849","sellMoney":"200","sellTime":"2013-12-03 14:22","state":"2","termCode":"2013330","winMoney":"0"},{"game":"SSQ","index":"100018848","sellMoney":"200","sellTime":"2013-12-03 11:15","state":"3","termCode":"2013142","winMoney":"0"},{"game":"SSQ","index":"100018847","sellMoney":"200","sellTime":"2013-12-03 11:13","state":"3","termCode":"2013142","winMoney":"0"},{"game":"SSQ","index":"100018846","sellMoney":"200","sellTime":"2013-12-03 11:12","state":"3","termCode":"2013142","winMoney":"0"},{"game":"SSQ","index":"100018845","sellMoney":"200","sellTime":"2013-12-03 11:08","state":"3","termCode":"2013142","winMoney":"0"},{"game":"SSQ","index":"100018844","sellMoney":"200","sellTime":"2013-12-03 11:08","state":"3","termCode":"2013142","winMoney":"0"},{"game":"SSQ","index":"100018843","sellMoney":"200","sellTime":"2013-12-03 11:08","state":"3","termCode":"2013142","winMoney":"0"},{"game":"SSQ","index":"100018842","sellMoney":"200","sellTime":"2013-12-03 11:07","state":"3","termCode":"2013142","winMoney":"0"}];
        var lottery = (flag=="0") ? _this.buyLotteryAllList :_this.buyLotteryWinList;
        var param={"page_index":lottery.pageIndex,"page_size":_this.page_size,"flag":flag,"phone":xmesh.model["User"].phone,"id_number":xmesh.model["User"].idNumber};
        encryptForDes(System.pwd_key,param.phone,function(phone){
            param.phone = phone;
            encryptForDes(System.pwd_key,param.id_number,function(id_number){
                param.id_number = id_number;
                service.get("/lottery/getBuyLotteryList.do",param,function(rs){
                    if(rs.data.length>0){
                        lottery.pageIndex = rs.data[rs.data.length-1].index;
                        lottery.addAll(rs.data);
                    }
                    if(success) success.call(_this,rs.data);
                },error);
            },function(){Dialog.alert("加密错误");})
        },function(){Dialog.alert("加密错误");})
    }
    /**
     * 清空购买记录
     */
    this.clearBuyLotteryRecord = function(){
        _this.buyLotteryAllList.clear();
        _this.buyLotteryWinList.clear();
    }
    /**
     * 清空中奖记录
     */
    this.clearLotteryRecord = function(){
        _this.lotterySSQWinRecord.clear();
        _this.lottery3DWinRecord.clear();
        _this.lotteryQLCWinRecord.clear();
    }
    /**
     * 购彩记录详情 getBuyLotteryDetail
     * param index购彩记录的index
     * param name 玩法英文名称，参考玩法名称字
     */
    this.getBuyLotteryDetail = function(param,success,error){
        encryptForDes(System.pwd_key,param.phone,function(phone){
            param.phone = phone;
           service.get("/lottery/getBuyLotteryDetail.do",param,function(rs){
                   var data = rs.data;
                    if(success) success.call(_this,data);
           },error);
        },function(){Dialog.alert("加密错误");})
    }
    /**
     * 购彩记录详情 getBuyLotteryDetail
     * param index购彩记录的index
     * param name 玩法英文名称，参考玩法名称字
     */
    this.getBuyLotteryDetail = function(param,success,error){
        encryptForDes(System.pwd_key,param.phone,function(phone){
            param.phone = phone;
            service.get("/lottery/getBuyLotteryDetail.do",param,function(rs){
                var data = rs.data;
                if(data.game=="3D"){
                    data.betCode = xmesh.model["Lottery3D"].doubleCastCode(data.betCode);
                    if(data.dreamNo)  data.dreamNo = xmesh.model["Lottery3D"].doubleCode(data.dreamNo);
                }
                if(success) success.call(_this,rs.data);
            },error);
        },function(){Dialog.alert("加密错误");})
    }
}
