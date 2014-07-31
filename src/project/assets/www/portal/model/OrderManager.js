/**
 * Created with JetBrains WebStorm.
 * User: yuany
 * Date: 13-11-14
 * Time: 上午10:40
 * To change this template use File | Settings | File Templates.
 */
function OrderManager(){
    var _this = this;

    /**
     * 创建订单
     *@type :话费：phoneRecharge ，游戏：gameRecharge，
     * @param success
     * @param error
     */
    _this.createOrder = function(data,type,success,error){
        service.post("/" + type +"/createOrder.do",data,function(rs){
            var Order = $.copyObject(xmesh.model["Order"],rs.data);
            if(success)success.apply(Order,arguments);
        },error);
    }

    /**
     * 创建彩票订单
     * @param success
     * @param error
     */
    _this.createLotteryOrder = function(data,success,error){
        encryptForDes(System.pwd_key, data.phone, function(rs){
            data.phone = rs;
            encryptForDes(System.pwd_key, data.id_number, function(rs){
                data.id_number = rs;
                service.post("/lottery/recharge.do",data,function(rs){
                    var Order = $.copyObject(xmesh.model["Order"],rs.data);
                    xmesh.model["Order"].amountYuan = Validator.convertFenToYuan(rs.data.amount);
                    if(success)success.apply(Order,arguments);
                },error);
            }, function(){Dialog.alert("加密错误");});
        }, function(){Dialog.alert("加密错误");});
    }
    /**
     * 创建汽车票订单
     * @param success
     * @param error
     */
    _this.createBusTicketOrder = function(data,success,error){
         service.post("/busTicket/buyTicket.do",data,function(rs){
                    var Order = $.copyObject(xmesh.model["Order"],rs.data);
                    if(success)success.apply(Order,arguments);
          },error);
    }
}
