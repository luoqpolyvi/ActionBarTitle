/**
 * Created with JetBrains WebStorm.
 * User: yuany
 * Date: 14-2-12
 * Time: 上午10:25
 * To change this template use File | Settings | File Templates.
 */

function Bank(){
    var _this = this;
    _this.bankCardid = "";//银行卡ID
    _this.bankCardNo = "";//银行卡卡号
    _this.bankCardPhone = "";//银行卡绑定电话号码（银行系统中绑定的电话号码）
    _this.cardType = "";//卡类型
    _this.status = "";//卡状态
    _this.bankLogoUrl = "";//发卡银行LOGO的URL
    _this.bankTel = "";//发卡银行电话
    _this.bankName = "";//发卡银行名称
    _this.province = "";//省份
    _this.city = "";//城市
    _this.branchBankCP = "";//支行
    _this.bankNameCP = "";//彩票中增加的银行名称
    _this.selfDfineCardName = "";//自定义银行卡名称
    _this.legal = "";//银行卡是否合法

    /**
     * 余额查询
     * @param success
     * @param error
     */
    _this.balanceEnquire =function(success,error){
        UPPay.startBalanceEnquire(success, error, _this.bankCardNo, (service.networkSwitch == 4 ? '00':'01'));
    }
}
