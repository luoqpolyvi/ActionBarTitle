/**
 * Created with JetBrains WebStorm.
 * User: yuany
 * Date: 13-11-28
 * Time: 上午10:28
 * To change this template use File | Settings | File Templates.
 */
function Bill(){
    var _this = this;
    _this.billId = ""//账单ID
    _this.transId = ""//交易码
    _this.transName = ""//交易名称
    _this.payCustomerId = ""//支付用户ID
    _this.customerId = ""//用户编号
    _this.amount = ""//交易金额
    _this.bolishTime = ""//实现日期
    _this.status = ""//账单生成状态
    _this.createTime = ""//生成日期
    _this.payTime = ""//支付日期
    _this.addition = ""//附录(账单扩展信息)
    _this.description = ""//账单描述
    _this.payType = ""//支付方式
}