function CreditCard(){
    var _this = this;

    this.creditId = "";                //信用卡ID
    this.cardNumber = "";              //信用卡卡号
    this.bankName = "";                //发卡行名称
    this.logoUrl = "";                 //银行logo
    this.logoUrlExt = "";              //银行logo白色背景
    this.backGroundColor = "";         //银行背景颜色
    this.bankType = "";                //银行卡类型
    this.repaymentNotice = "";         //是否开通还款提醒
    this.noticeDate = "";              //提醒日期
    this.remainDate = "";              //还款剩余天数
    this.arriveTime = "";              //到账时间
    this.callPhone = "";               //查询账单电话号码
    this.smsPhone = "";                //查询账单短信号码
    this.smsText = "";                 //查询账单短信内容

    this.isChange = false;
    this.isAdd = false;

    this.lastFourNum = '';               //信用卡后四位
    this._format = {
        lastFourNum : function(){return _this.cardNumber.substring(_this.cardNumber.length-4,_this.cardNumber.length)}
    }
}
