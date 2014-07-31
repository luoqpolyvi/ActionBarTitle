/**
 * Created with JetBrains WebStorm.
 * User: yuany
 * Date: 14-2-12
 * Time: 下午3:28
 * To change this template use File | Settings | File Templates.
 */
function BankManager(){

    var _this = this;

    _this.banks = [];//银行卡列表
    _this.supportCreditBank = [];//信用卡支持银行
    _this.supportDebitBank = [];//借记卡支持银行
    _this.supportPrepayBank = [];//预付费卡支持银行
    _this.supportBankInfo = "";//支持银行卡消息
    _this.newBank = "";

    /**
     * 获取支持的银行卡列表
     * @param supportType
     * @param bankCardNo
     * @param success
     * @param error
     */
    _this.getSupportBankList = function(supportType,success,error){
        service.post("/bank/getSupportBankList.do",{support_type : supportType},function(rs){
            _this.supportCreditBank = rs.data.creditBank;
            _this.supportDebitBank = rs.data.debitBank;
            _this.supportPrepayBank = rs.data.prepayBank;
            if(success)success.apply(_this,arguments);
        },error,false,[{key:"u_id",value:xmesh.model["User"].id},{key:"m_id",value:xmesh.model["User"].m_id}])
    }

    _this.getSupportBankDetail = function(supportBankId,success,error){
        service.post("/bank/getSupportBankDetail.do",{support_bank_id : supportBankId},function(rs){
            _this.supportBankInfo = rs.data;
            if(success)success.apply(_this,arguments);
        },error,false,[{key:"u_id",value:xmesh.model["User"].id},{key:"m_id",value:xmesh.model["User"].m_id}])
    }

    /**
     * 添加银行卡
     * @param cardNo
     * @param success
     * @param error
     */
    _this.addBankCard = function(cardNo,success,error){
        var checkResult = _check();var isAdd = true ;
        if(checkResult !== true)return error.call(this,new ValidateError(checkResult));
        $.each( _this.banks, function (i, item) {
            if(item.bankCardNo == cardNo){
                isAdd = false; return success(null);
            }
        });
        if(!isAdd)return;
        service.post("/bank/addBankCard.do",{bank_card_no : cardNo,u_id:xmesh.model["User"].id},function(rs){
            _this.banks.push(rs.data.dataList[0]);
            _this.newBank = rs.data.dataList;
            if(success)success(rs.data.dataList[0]);
        },error)
        function _check(){
            if(!Validator.required(cardNo))return "请输入银行卡号";
            return true;
        }
    }

    /**
     * 获取银行卡列表
     * @param pageSize
     * @param pageIndex
     * @param success
     * @param error
     */
    _this.getBanks = function(pageSize,pageIndex,success,error){
        service.post("/bank/getUserBankCardList.do",{page_size : pageSize,page_index : pageIndex,u_id:xmesh.model["User"].id},function(rs){
            createBankList(rs);
            if(success)success.apply(_this,arguments);
        },error);
    }

    /**
     * 删除银行
     * @param bank
     * @param success
     * @param error
     */
    _this.delBank = function(bank,success,error){
        service.post("/bank/deleteBankCard.do",{bank_card_id : bank.bankCardid},function(rs){
            $.each( _this.banks, function (i, item) {
                if(item.bankCardid == bank.bankCardid){_this.banks.splice(i,1);return;}
            });
            if(success)success.apply(_this,arguments);
        },error);
    }

    function createBankList(data){
        _this.banks = [];
        $.each(data.data.dataList,function(i,item){
            var bank = {
                bankCardid : item.bankCardid,
                bankCardNo : item.bankCardNo,
                bankCardPhone : item.bankCardPhone,
                cardType : item.cardType,
                status : item.status,
                bankLogoUrl : item.bankLogoUrl,
                bankTel : item.bankTel,
                bankName : item.bankName,
                province : item.province,
                city : item.city,
                branchBankCP : item.branchBankCP,
                bankNameCP : item.bankNameCP,
                selfDfineCardName : item.selfDfineCardName,
                legal : item.legal
            };
            _this.banks.push(bank);
        });
    }
}