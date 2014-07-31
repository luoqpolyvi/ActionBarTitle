function BusPassengersManager(){
    var _this = this;
    this.totalCount = "";
    this.passengerList = [];
    this.addFlag = false;
    this.editFlag = false;
    this.isFirst = true;

    /**
     * 查询乘车人信息
     * @param data
     * @param success
     * @param error
     */
    this.getPassenger = function(data,success,error){
        service.post("/busTicket/getPassenger.do",{
            userId:xmesh.model["User"].id,                 //"05b656c8-b157-462b-96ea-9aa98ebf6b21",
            pageIndex:data.pageIndex,
            pageSize:50
        },function(rs){
            var passengerListRs = rs.data.passengerList;
            _this.totalCount = rs.data.totalCount;
            _this.passengerList = rs.data.passengerList;
            if(success)success.call(_this,passengerListRs);
        },error);
    }

    /**
     * 编辑乘车人信息
     * @param data
     * @param success
     * @param error
     */
    this.updatePassenger = function(data,success,error){
        var checkResult = _check();
        if(checkResult !== true)return error.call(this,new ValidateError(checkResult));
        service.post("/busTicket/updatePassenger.do",{
            userId:xmesh.model["User"].id,                       //"05b656c8-b157-462b-96ea-9aa98ebf6b21"   todo
            passengerId:xmesh.model["BusPassengers"].passengerId,
            name:data.name,
            credentialType:data.credentialType,
            credentialNum:data.credentialNum,
            type:data.type,
            mobile:data.mobile,
            sourceType:xmesh.model["BusPassengers"].sourceType
        },function(rs){
            if(success)success.call(_this,arguments);
        },error);
        function _check(){
            if(!Validator.required(data.name))return "请输入乘车人姓名";
            if(!Validator.required(data.mobile))return "请输入乘车人手机号码";
            if(!Validator.required(data.credentialType))return "请选择乘车人证件类型";
            if(data.type == 0){
                if(!Validator.required(data.credentialNum))return "请输入乘车人证件号码";
                if(data.credentialType == 0) return Validator.checkIdCardNum(data.credentialNum);
            }
            if(!Validator.required(data.type))return "请选择乘车人购票类型";

            return true;
        }
    }

    /**
     * 删除乘车人信息
     * @param data
     * @param success
     * @param error
     */
    this.deletePassenger = function(data,success,error){
        service.post("/busTicket/deletePassenger.do",{
            userId:xmesh.model["User"].id,                       //data.userId    todo
            passengerId:xmesh.model["BusPassengers"].passengerId,             //data.passengerId  todo
            sourceType:xmesh.model["BusPassengers"].sourceType                //data.sourceType    todo
        },function(rs){
            if(success)success.call(_this,arguments);
        },error);
    }

    /**
     * 增加乘车人信息
     * @param data
     * @param success
     * @param error
     */
    this.addPassenger = function(data,success,error){
        var checkResult = _check();
        if(checkResult !== true)return error.call(this,new ValidateError(checkResult));
        service.post("/busTicket/addPassenger.do",{
            userId:xmesh.model["User"].id,                       //"05b656c8-b157-462b-96ea-9aa98ebf6b21"           todo
            name:data.name,
            credentialType:data.credentialType,
            credentialNum:data.credentialNum,
            type:data.type,
            mobile:data.mobileForAdd
        },function(rs){
            if(success)success.apply(rs,arguments);
        },error);
        function _check(){
            if(!Validator.required(data.name))return "请输入乘车人姓名";
            if(!Validator.required(data.mobileForAdd))return "请输入乘车人电话号码";
            if(!Validator.mobile(data.mobileForAdd))return "请输入正确的电话号码";
            if(!Validator.required(data.credentialType))return "请选择乘车人证件类型";
            if(data.type == 0){
                if(!Validator.required(data.credentialNum))return "请输入乘车人证件号码";
                if(data.credentialType == 0) return Validator.checkIdCardNum(data.credentialNum);
            }
            if(!Validator.required(data.type))return "请选择乘车人购票类型";
            return true;
        }
    }
}