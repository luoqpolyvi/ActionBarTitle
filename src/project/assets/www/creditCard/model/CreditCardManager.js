function CreditCardManager(){

    var _this = this;

    this.getCreditCard = function(success,error){
        service.get("/creditCard/getAccountList.do",{
            u_id : xmesh.model["User"].id
        },function(rs){
            if(success)success.apply(_this,arguments);
        },error);
    }

    this.addCreditCard = function(value,success,error){
        service.post("/creditCard/addAccount.do",{
            card_number : value.card_number,
            bank_id : value.bank_id,
            user_id : xmesh.model["User"].id,
            repayment_notice : value.repayment_notice,
            notice_date : value.notice_date
        },function(rs){
            if(success)success.apply(_this,arguments);
        },error);
    }

    this.deleteCreditCard = function(value,success,error){
        service.get("/creditCard/deleteMyCreditCard.do",{
            userId : xmesh.model["User"].id,
            creditCardId : value.creditCardId
        },function(rs){
            if(success)success.apply(_this,arguments);
        },error);
    }

    this.getBank = function(success,error){
        service.get("/creditCard/getSupportCreditBankList.do",function(rs){
            if(success)success.apply(_this,arguments);
        },error);
    }

    this.getRecords = function(value,success,error){
        service.get("/creditCard/getRepaymentRecords.do",{
            userId : xmesh.model["User"].id,
            cardNumber : value.cardNumber,
            pageIndex : value.pageIndex,
            pageSize : "50"
        },function(data){
            if(success)success.apply(_this,arguments);
        },error);
    }

    this.setDate = function(value,success,error){
        service.get("/creditCard/setRePayNoticeDate.do",{
            userId : xmesh.model["User"].id,
            cardNumber : value.cardNumber,
            repaymentNotice : value.repaymentNotice,
            noticeDate : value.noticeDate
        },function(rs){
            if(success)success.apply(_this,arguments);
        },error);
    }
}
