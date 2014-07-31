function LotterySSQ (){
    var _this = this;
    this.game="SSQ"; //名称
    this.name="";//中文名称
    this.termCode=""; //期号
    this.termBeginTime ="";//开期时间
    this.termEndTime="";//期结时间
    this.action ="buy_lottery";//操作行为
    this.cast_info=[];//投注消息

    this.perCastInfo=function(select_way,bet_code,cast_num,cast_amount){
        return {
            select_way:select_way,//选择方式  1= 手选 | 2=机选
            sell_way:(cast_num==1)?"1":"2",//投注方式 1=单式|2=复式
            bet_code:bet_code,//投注号码
            cast_num:'1',//倍数
            cast_zhu:cast_num,//注数
            cast_amount:cast_amount//投注金额 投注号码投注总金额，单位分
        }
    }
    this.multiple = "1";//倍数
    this.getRedBall = function(){
        return ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33"];
    }

    this.getBlueBall = function(){
        return ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16"];
    }
    this.gameTips = "第一条　“双色球”彩票投注区分为红色球号码区和蓝色球号码区。\r\n第二条　“双色球”每注投注号码由6个红色球号码和1个蓝色球号码组成。红色球号码从1--33中选择；蓝色球号码从1--16中选择。\r\n第三条　“双色球”每注2元。\r\n第四条　“双色球”采取全国统一奖池计奖。\r\n第五条　“双色球”每周销售三期，期号以开奖日界定，按日历年度编排。\r\n第六条　“双色球”的投注方法可分为自选号码投注和机选号码投注;其投注方式有单式投注和复式投注。\r\n第七条　自选号码投注是指由投注者自行选定投注号码的投注。\r\n第八条　机选号码投注是指由投注机为投注者随机产生投注号码的投注。\r\n第九条　单式投注是从红色球号码中选择6个号码，从蓝色球号码中选择1个号码，组合为一注投注号码的投注。\r\n第十条　复式投注有三种：\r\n（一）红色球号码复式：从红色球号码中选择7--20个号码，从蓝色球号码中选择1个号码，组合成多注投注号码的投注。\r\n（二）蓝色球号码复式：从红色球号码中选择6个号码，从蓝色球号码中选择2--16个号码，组合成多注投注号码的投注。\r\n（三）全复式：从红色球号码中选择7--20个号码，从蓝色球号码中选择2--16个号码，组合成多注投注号码的投注。\r\n";
    /**
     * 取新期 getLotteryInfo
     * @param games 玩法英文名称
     */
    this.getLotteryInfo = function(success,error){
        service.get("/lottery/getLotteryInfo.do",{"games":_this.game},function(rs){
            $.copyObject(_this,rs.data.dataList[0]);
            if(success)success.apply(_this,arguments);
        },error);
    }
    /**
     * 双色球机选投注数
     */
    this.randomSelect = function(){
        var redArray = _this.getRedBall(), blueArray =_this.getBlueBall(),redCastNum =[], blueCastNum =[],castNum=[];
        var j = 33;
        var red_index;
        for (var i = 0; i < 6; i++) {
            red_index = parseInt(Math.random() * j +1);
            redCastNum.push(redArray[red_index-1]);
            redArray.splice(red_index-1, 1);
            j--;
        }
        var m = 16;
        var blue_index = parseInt(Math.random() * m+1);
        blueCastNum.push(blueArray[blue_index-1]);
        castNum.push(redCastNum);
        castNum.push(blueCastNum);
        return castNum;
    }
    /**
     *
     */
    this.formatRandomSelect = function(){
        var random = _this.randomSelect();
        random[0] = random[0].join(",")
        var bet_code = random.join("|");
        var perCastInfo = _this.perCastInfo("2",bet_code,1,200);
        _this.cast_info.push(perCastInfo);
        return perCastInfo;
    }
    /**
     * 计算注数
     * redLength 红球个数
     * blueLength 蓝球个数
     */
    this.get_zhu = function(redLength,blueLength){
        if(redLength > 5 && redLength < 21 && blueLength > 0){//通过检验才进行注数计算
            var total =  redLength;
            for(var i = 1; i < 6; i ++ ){
                total *= ( -- redLength );
            }
            return  Math.ceil(total / 720 * blueLength);

        }
        else{ return 0 ;}
    };
    /**
     *
     */
    this.checkCodeLength = function(redList,blueList){
        if(!redList || !redList.length || redList.length<6) return Dialog.toast("请选择至少6个红球");
        if(redList.length>20) return Dialog.toast("最多选择20个红球");
        if(!blueList) return Dialog.toast("请选择至少1个蓝球");
        else return true;
    }
}