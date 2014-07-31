
function RechargeManager(){
    var _this = this;
    this.phoneNumber = '';
    this.parValue = '';
    this.position ='';
    this.actureValue = '';


    /**
     * 获取话费充值面额
     *@data :{phone:number}
     * @param success
     * @param error
     */
    _this.getParValue = function(data,success,error){
        service.post("/phoneRecharge/parValue.do",data,function(data){
            if(success)success.call(_this,data);
        },function(data){
            if(error)error.call(_this,data);
        });
    }

}
