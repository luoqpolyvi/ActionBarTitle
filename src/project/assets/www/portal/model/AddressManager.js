/**
 * Created with JetBrains WebStorm.
 * User: yuany
 * Date: 13-11-27
 * Time: 下午2:54
 * To change this template use File | Settings | File Templates.
 */
function AddressManager(){
    var _this = this;

    _this.addressList = [];

    /**
     * 获取收货地址列表
     * @param success
     * @param error
     */
    _this.getAddressList = function(success,error){
        service.post("/personInfo/getAdderss.do",{m_id : xmesh.model["User"].m_id},function(rs){
            createAddressList(rs);
            if(success)success.apply(_this.addressList,arguments);
        },error);
    }

    function createAddressList(data){
        _this.addressList = [];
        $.each(data.data.addressList,function(i,item){
            var addr = {addressId :item.addressId,name:item.name,phone:item.phone,postCode : item.postCode,address : item.address};
            _this.addressList.push(addr);
        });
    }

    /**
     * 获取选中的收货地址对象
     * @param id
     */
    _this.getAddress = function(id){
        $.each(_this.addressList,function(i,item){
            if(item.addressId == id) return item;
        })
    }

    /**
     * 添加修改收获地址
     * @param success
     * @param error
     */
    _this.addAddress = function(address,success,error){
        var checkResult = _check();
        if(checkResult !== true)return error.call(this,new ValidateError(checkResult));
        service.post("/personInfo/addAddress.do",{m_id : xmesh.model["User"].m_id,address_id : address.addressId,
            name:address.name,phone:address.phone,post_code:address.postCode,address:address.address},function(rs){
            createAddressList(rs);
            if(success)success.apply(_this,arguments);
        },error);
        function _check(){
            if(!Validator.required(address.name))return "请输入收货人";
            if(!Validator.notNull(address.name))return "收货人姓名请勿添加空格";
            if(!Validator.required(address.phone))return "请输入手机号";
            if(!Validator.mobile(address.phone))return "请输入正确的手机号";
            if(!Validator.required(address.postCode))return "请输入邮编";
            if(!Validator.notNull(address.postCode))return "邮编请勿添加空格";
            if(!Validator.required(address.address))return "请输入收货地址";
            if(!Validator.notNull(address.address))return "收货地址请勿添加空格";
            return true;
        }
    }

    /**
     * 删除收获地址
     * @param success
     * @param error
     */
    _this.delAddress = function(address,success,error){
        service.post("/personInfo/deleteAddress.do",{m_id : xmesh.model["User"].m_id,address_id : address.addressId},function(rs){
            createAddressList(rs);
            if(success)success.apply(_this,arguments);
        },error);
    }
}