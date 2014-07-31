/**
 * Created with JetBrains WebStorm.
 * User: yuany
 * Date: 13-11-14
 * Time: 上午10:35
 * 订单
 * @constructor
 */
function Order(){
    var _this = this;
    _this.orderID = "";//订单ID
    _this.amount = "";//金额
    _this.createTime = "";//创建时间
    _this.endTime = "";//失效时间
    _this.description = "";//描述
    _this.addition = "";//附加信息
    _this.amountYuan = "";         //金额（元）
    _this.description = "";        //交易详情
    _this.seqNum = "";             //流水号

    _this.billId = "";       //账单ID

    /**
     * 支付
     * @param success
     * @param error
     */
    _this.pay = function(success,error){
        var data = {order_id:_this.orderID,m_id:xmesh.model["User"].m_id,type:"upmp"};
        service.busynessMessage = "网络连接中，请稍候...";
        service.get("/payment/generateBill.do",data,function(res){
            _this.billId = res.data.billId;
            service.busynessMessage = "网络连接中，请稍候...";
                service.get("/payment/getTN.do",{billId:res.data.billId},function(rs){
                    UPPay.startPay(function(info) {if(info == "success"){success.apply();}},error, rs.data["tn"],(service.networkSwitch == 4 ? '00':'01'), null, null);
                },error);
        },error);
    }

    /**
     * 账单支付
     * @param success
     * @param error
     */
    _this.billPay = function(billId,success,error){
        service.get("/payment/getTN.do",{billId:billId},function(rs){
            UPPay.startPay(function(info) {if(info == "success"){success.apply();}},error, rs.data["tn"],(service.networkSwitch == 4 ? '00':'01'), null, null);
        },error);
    }

    /**
     * 雅安支付
     * @param success
     * @param error
     */
    _this.yaPay = function(tn,success,error){
        UPPay.startPay(function(info) {if(info == "success"){success.apply();}},error, tn,(service.networkSwitch == 4 ? '00':'01'), null, null);
    }

    /*
    * 多渠道业务支付通知
    * */
    _this.notice = function(success,error){
        service.get("/payment/mulitChannelPayNotice.do",{m_id:xmesh.model["User"].m_id,mp_bill_id:_this.billId},success,error);
    }
 }