/**
 * Created with JetBrains WebStorm.
 * User: yuany
 * Date: 13-11-27
 * Time: 下午3:22
 * To change this template use File | Settings | File Templates.
 */
function ContactsManager(){
    var _this = this;

    _this.contactList = [];

    /**
     * 获取联系人列表
     * @param success
     * @param error
     */
    _this.getContactList = function(success,error){
        service.post("/personInfo/getContractors.do",{m_id : xmesh.model["User"].m_id},function(rs){
            createContactList(rs);
            if(success)success.apply(_this.contactList,arguments);
        },error);
    }

    function createContactList(data){
        _this.contactList = [];
        $.each(data.data.contractersList,function(i,item){
            var contact = {contactId :item.contactId,name:item.name,phone:item.phone,phoneR : item.phoneR,cardType : item.cardType,cardId : item.cardId,formatCardType:formatCardType(item.cardType)};
            _this.contactList.push(contact);
        });
    }

    function formatCardType(val){
        var value = parseInt(val);
        var arr = ["身份证", "护照", "回乡证", "台胞证", "军人证", "港澳通行证","国际海员证", "旅行证", "其它"];
        return arr[(value-1)];
    }
    /**
     * 添加修改联系人
     * @param success
     * @param error
     */
    _this.addContact = function(contact,success,error){
        var checkResult = _check();
        if(checkResult !== true)return error.call(this,new ValidateError(checkResult));
        service.post("/personInfo/addContractor.do",{m_id : xmesh.model["User"].m_id,contact_id : contact.contactId,
            name:contact.name,phone:contact.phone,phone_r:contact.phoneR,card_type:contact.cardType,card_id:contact.cardId},function(rs){
            createContactList(rs);
            if(success)success.apply(_this,arguments);
        },error);
        function _check(){
            if(!Validator.required(contact.name))return "请输入姓名";
            if(!Validator.notNull(contact.name))return "姓名中请勿添加空格";
            if(!Validator.required(contact.phone))return "请输入手机号";
            if(!Validator.mobile(contact.phone))return "请输入正确的手机号";
            if(!Validator.notNull(contact.phoneR))return "备用电话中请勿添加空格";
//            if(!Validator.required(contact.phoneR))return "请输入备用电话";
            if(!Validator.required(contact.cardId))return "请输入证件号码";
            if(!Validator.notNull(contact.cardId))return "证件号码中请勿添加空格";
            if(contact.cardType == 1) return Validator.checkIdCardNum(contact.cardId);
            return true;
        }
    }

    /**
     * 删除联系人
     * @param success
     * @param error
     */
    _this.delContact = function(contact,success,error){
        service.post("/personInfo/deleteContractor.do",{m_id : xmesh.model["User"].m_id,contact_id : contact.contactId},function(rs){
            createContactList(rs);
            if(success)success.apply(_this,arguments);
        },error);
    }
}