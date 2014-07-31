function Card(){
    var _this = this;

/*    this.u_id = "";                     //用户ID
    this.bank_card_id = "";             //银行卡表主键，有值表示修改
    this.phone = "";                    //手机号，开卡绑定的手机号码
    this.cardID = "";                   //银行卡卡号，bank_card_no
    this.bank_card_name = "";           //自定义的银行卡名称 ，为空默认为银行卡卡号（汉字字母数字）
    this.bank = "";                     //开户行名称，bank_name
    this.city_code = "";                //省份城市代码，四位数字，参见国家标准
    this.branch_bank = "";              //支行
    this.money = "";                    //提现金额
    this.realMoney = "";                //实际到账金额
    this.charge = "";                   //手续费
    this.state = "";                    //状态，0：审核中；1：等待汇款；2：拒绝；3：汇款成功；4：汇款失败*/

    this.bankCardid = "";               //银行卡id
    this.bankCardNo = "";               //银行卡卡号
    this.bankCardPhone = "";            //银行系统中银行卡绑定的电话
    this.cardType = "";                 //银行卡类型
    this.status = "";                   //卡状态
    this.bankLogoUrl = "";              //发卡银行的LOGO的URL
    this.bankTel = "";                  //发卡银行的电话
    this.bankName = "";                 //发卡银行名称
    this.province = "";                 //省份
    this.city = "";                     //城市
    this.branchBankCP = "";             //支行
    this.bankNameCP  = "";              //彩票中增加的银行名称
    this.selfDfineCardName = "";        //自定义银行卡名称
    this.legal = "";                    //银行卡是否合法


    /**
     * 注册银行卡
     * @param success
     * @param error
     */
    this.registerCard = function(data,success,error){
        var checkResult = _check();
        if(checkResult !== true)return error.call(this,new ValidateError(checkResult));
        service.post("/lottery/regBankCard.do",data,function(rs){
                if(success)success.apply(rs,arguments);
        },error);
        function _check(){
            if(!Validator.required(data.bank_card_no))return "请输入银行卡号";
            if(!Validator.required(data.bank_card_name))return "请输入银行卡个性标志";
            if(!Validator.required(data.city_code))return "请选择城市";
            if(!Validator.required(data.bank_name))return "请输入银行名称";
            if(!Validator.required(data.branch_bank))return "请输入开户支行";
            if(!Validator.number(data.bank_card_no))return "请输入正确的银行卡号";
            return true;
        }
    }

    /**
     * 查询银行卡列表
     * @param success
     * @param error
     */
    this.search = function(data,success,error){
        service.get("/bank/getUserBankCardList.do",data,function(data){
            if(success)success.apply(data,arguments);
            /*var rs = [];
            var items = data.data.dataList;
            items.forEach(function(item){
                rs.push($.copyObject(new Card(),item));
            });
            if(success)success.call(_this,rs);*/
        },error);
    }
    /**
     * 提现
     * @param success
     * @param error
     */
    this.withdrawCash = function(data,success,error){
        var checkResult = _check();
        if(checkResult !== true)return error.call(this,new ValidateError(checkResult));
        encryptForDes(System.pwd_key, data.phone, function(rs){
            data.phone = rs;
            encryptForDes(System.pwd_key, data.id_number, function(rs){
                data.id_number = rs;
                encryptForDes(System.pwd_key, data.money, function(rs){
                    data.money = rs;
                    service.post("/lottery/payPal.do",data,function(rs){
                        if(success)success.apply(rs,arguments);
                    },error);
                }, function(){Dialog.alert("加密错误");});
            }, function(){Dialog.alert("加密错误");});
        }, function(){Dialog.alert("加密错误");});
        function _check(){
            if(!Validator.required(data.money))return "请输入提现金额";
            return true;
        }
    }

    /**
     * 提现信息查询
     * @param success
     * @param error
     */
    this.withdrawCashList = function(data,success,error){
        encryptForDes(System.pwd_key, data.phone, function(rs){
            data.phone = rs;
            service.get("/lottery/getPayPalInfo.do",data,function(rs){
                if(success)success.apply(_this,arguments);
            },error);
        }, function(){Dialog.alert("加密错误");});
    }

}
