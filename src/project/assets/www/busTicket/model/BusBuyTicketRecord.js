function BusBuyTicketRecord(){
    var _this = this;
    this.orderId = "";                //订单ID
    this.createTime = "";             //下单时间
    this.payTime = "";                //支付时间
    this.totalPrice = "";             //交易金额
    this.state = "";                  //交易状态
    this.signId = "";                 //标示ID
    this.originCity = "";             //始发城市
    this.originStation = "";          //始发站
    this.originStationId = "";        //始发站代码
    this.targetStation = "";          //到达站
    this.driveTime = "";              //发车时间
    this.fullPrice ="";               //全票价
    this.halfPrice = "";              //半票价
    this.code = "";                   //取票验证码
    this.schType = "";                //班次类型
    this.busType = "";                //车型
    this.mile = "";                   //公里数
    this.servicePrice = "";           //服务费
    this.backTime = "";               //退票时间
    this.backServicePrice = "";       //退票手续费
    this.backAmount = "";             //退票金额
    this.passengerInfo = "";          //乘车人信息   身份证号码|姓名|手机号|票种|证件类型  多人用$分割
    this.contactInfo = "";            //联系人信息   联系人姓名|联系人手机号
    this.billData = [];               //2.3账单信息，跟bill一致

    this.passengerInfoAr = "";
    this.isPay = false;

    this.arrangePassengerInfo = function(){

        _this.passengerInfoAr = "";
        var passengerInfo = _this.passengerInfo;
        var idNum,name,phoneNum,ticketType,ticketTypeNum,idType,idTypeNum;
        var length;
        if(passengerInfo.match(/\$/g) != null){
            length = passengerInfo.match(/\$/g).length+1;
        }
        else{
            length = 1;
        }
            idNum = passengerInfo.substring(0,passengerInfo.indexOf("|"));
            passengerInfo = passengerInfo.substring(passengerInfo.indexOf("|")+1,passengerInfo.length);
            name = passengerInfo.substring(0,passengerInfo.indexOf("|"));
            passengerInfo = passengerInfo.substring(passengerInfo.indexOf("|")+1,passengerInfo.length);
            phoneNum = passengerInfo.substring(0,passengerInfo.indexOf("|"));
            passengerInfo = passengerInfo.substring(passengerInfo.indexOf("|")+1,passengerInfo.length);
            ticketTypeNum = passengerInfo.substring(0,passengerInfo.indexOf("|"));
            passengerInfo = passengerInfo.substring(passengerInfo.indexOf("|")+1,passengerInfo.length);
            idTypeNum = passengerInfo.substring(0,1);
            if(passengerInfo.match(/\$/g) != null && passengerInfo.match(/\$/g).length>0){
                passengerInfo = passengerInfo.substring(passengerInfo.indexOf("$")+1,passengerInfo.length);
            }
            switch(ticketTypeNum){
                case "0" : ticketType="全票";break;
                case "1" : ticketType="半票";break;
            }
            switch(idTypeNum){
                case "0" : idType="身份证";break;
                case "1" : idType="护照";break;
                case "2" : idType="军官证";break;
                case "3" : idType="无证件号（半票）";break;
            }
            _this.passengerInfoAr = _this.passengerInfoAr + name+" "+ticketType+"<br/>"+idType+" "+idNum;

        for(var i=0;i<length-1;i++){
            idNum = passengerInfo.substring(0,passengerInfo.indexOf("|"));
            passengerInfo = passengerInfo.substring(passengerInfo.indexOf("|")+1,passengerInfo.length);
            name = passengerInfo.substring(0,passengerInfo.indexOf("|"));
            passengerInfo = passengerInfo.substring(passengerInfo.indexOf("|")+1,passengerInfo.length);
            phoneNum = passengerInfo.substring(0,passengerInfo.indexOf("|"));
            passengerInfo = passengerInfo.substring(passengerInfo.indexOf("|")+1,passengerInfo.length);
            ticketTypeNum = passengerInfo.substring(0,passengerInfo.indexOf("|"));
            passengerInfo = passengerInfo.substring(passengerInfo.indexOf("|")+1,passengerInfo.length);
            idTypeNum = passengerInfo.substring(0,1);
            if(passengerInfo.match(/\$/g) != null && passengerInfo.match(/\$/g).length>0){
                passengerInfo = passengerInfo.substring(passengerInfo.indexOf("$")+1,passengerInfo.length);
            }
            switch(ticketTypeNum){
                case "0" : ticketType="全票";break;
                case "1" : ticketType="半票";break;
            }
            switch(idTypeNum){
                case "0" : idType="身份证";break;
                case "1" : idType="护照";break;
                case "2" : idType="军官证";break;
                case "3" : idType="无证件号（半票）";break;
            }
            _this.passengerInfoAr = _this.passengerInfoAr +"<br/>"+ name+" "+ticketType+"<br/>"+idType+" "+idNum;
        }

    }
}
