var Validator = {

    required:function(value){
        return "" !== value;
    },

    notNull:function(value){
        return ("" !== value)?/\S/.test(value):true;
    },

    equal :function (v1,v2){
        return v1 == v2;
    },

    /**
     * 获取当前时间20130704032557
     * @return {Number}
     */
    getDate : function(){
        var date = new Date();
        return (date.getFullYear() + "" + ((date.getMonth()+1+"").length==2 ? (date.getMonth()+1) : ("0"+ (date.getMonth()+1))) + ((date.getDate()+"").length == 2 ? date.getDate() : "0" + date.getDate())
            + ((date.getHours() + "").length == 2 ?date.getHours() : "0" + date.getHours()) + ((date.getMinutes() + "").length == 2 ? date.getMinutes() : "0" +date.getMinutes())
            + ((date.getSeconds() + "").length == 2 ? date.getSeconds() : "0" +date.getSeconds())).trim();
    },

    number:function(value){
        return /^[0-9]*$/.test(value);
    },

    match:function(value,pattern){
        return pattern.test(value);
    },

    isMatchPrice:function(value){
        value = parseFloat(value);
        return typeof value=="number" && value/100>0 && value/100<1000000;
    },

    length:function(value,length){
        if(!value)return false;
        return value.length == length;
    },

    userName:function(value){
        return /^[a-z\u4E00-\u9FA50-9]+$/gi.test(value);
    },

    range:function(value,min,max){
        return value>=min && value<=max;
    },

    email:function(value){
        return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value);
    },
    //验证手机
    mobile:function(value){
        return /^1[3|4|5|8][0-9]\d{8}$/.test(value);
    },
    //验证固话
    telphone:function(value){
        return /^(0\d{2,3}-?)\d{7,8}(-\d{3})*$/.test(value);
    },
    pwd:function(val){
        return /^[0-9a-zA-Z_]{6,16}$/.test(val);
    },

    checkPwd :function(val){
        if(/^[0-9]+$/.test(val) || /^[A-Za-z]+$/.test(val) || /^[!@#$%^&*()_+|{}?><\-\]\\[\/]+$/.test(val) ||/^[\u4e00-\u9fa5]/.test(val)){
            return false
        }else{return true;}
    },

    /*
     * 验证金额精确到小数点后2位
     */
    checkTransferMoneyForm : function(money){
        return /^\d+(\.\d{1,2})?$/.test(money);
    },

    //分转化为元
    convertFenToYuan : function(num){
        num = (num/100).toString().replace(/\$|\,/g,'');
        if(isNaN(num))
            num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num*100+0.50000000001);
        cents = num%100;
        num = Math.floor(num/100).toString();
        if(cents<10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
            num = num.substring(0,num.length-(4*i+3))+','+
                num.substring(num.length-(4*i+3));
        return (((sign)?'':'-') + num + '.' + cents+"元");
    },
    /**
     * 格式化银行卡号,添加空格，只显示前四位及后三位，其余显示*
     *
     */
    formatBankCard : function(b){
        var formatA="";
        var formatB="";
        var a= b.length - 7;
        for(var i=4;i<=a;i+=4){
            formatA=formatA+"**** ";
        }
        var c = a%4;
        for(var d=0;d<c;d++){
            formatA=formatA+"*";
        }

        formatB = b.substring(0,4)+" "+formatA+ b.substring(b.length-3,b.length);
        return formatB;
    },
    /**
     * 格式化身份证，只显示前十位和后四位其它显示*
     */
    formatIdCard : function(b){
        if(b){return b.substring(0,6) + "********"+b.substring(b.length-4,b.length);}else{return ""}
    },
    /**
     * 格式化电话号码，只显示前三位和后4位
     */
    formatPhone : function(b){
        if(b){return b.substring(0,3) + "****"+b.substring(7,11);}else{return ""}
    },
    /**
     * 格式化姓名，只显示第一位其他显示*
     */
    formatName : function(b){
        var format = "";
        for(var i=1;i< b.length;i++){
            format = format+"*"
        }
        return b.substring(0,1) + format;
    },

    /*
     * 验证提现金额
     */
    checkWithdrawCash : function(moneyNum){
        if(!Validator.checkTransferMoneyForm(moneyNum)){
            Dialog.toast("请填写正确的金额！");
        }
        if(moneyNum <= 10){
            Dialog.toast("请填写大于10的金额！");
        }
    },

    /*
     * 验证身份证
     */
    checkIdCardNum : function(obj){
        var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙 江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖 北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西 藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国 外"};
        var iSum = 0;
        var strIDno = obj;
        var idCardLength = strIDno.length;
        if(!/^\d{17}(\d|x)$/i.test(strIDno)&&!/^\d{15}$/i.test(strIDno))
            return "请输入正确的身份证号码"; //非法身份证号

        if(aCity[parseInt(strIDno.substr(0,2))]==null)
            return "请输入正确的身份证号码";// 非法地区

        // 15位身份证转换为18位
        if (idCardLength==15)
        {
            sBirthday = "19" + strIDno.substr(6,2) + "-" + Number(strIDno.substr(8,2)) + "-" + Number(strIDno.substr(10,2));
            var d = new Date(sBirthday.replace(/-/g,"/"));
            var dd = d.getFullYear().toString() + "-" + (d.getMonth()+1) + "-" + d.getDate();
            if(sBirthday != dd)
                return  "请输入正确的身份证生日";//非法生日
            strIDno=strIDno.substring(0,6)+"19"+strIDno.substring(6,15);
            strIDno=strIDno+GetVerifyBit(strIDno);
        }

        // 判断是否大于2078年，小于1900年
        var year =strIDno.substring(6,10);
        if (year<1900 || year>2078 )
            return "请输入正确的身份证生日";//非法生日

        //18位身份证处理

        //在后面的运算中x相当于数字10,所以转换成a
        strIDno = strIDno.replace(/x$/i,"a");

        sBirthday=strIDno.substr(6,4)+"-"+Number(strIDno.substr(10,2))+"-"+Number(strIDno.substr(12,2));
        var d = new Date(sBirthday.replace(/-/g,"/"));
        if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))
            return "请输入正确的身份证号码"; //非法生日
        // 身份证编码规范验证
        for(var i = 17;i>=0;i --)
            iSum += (Math.pow(2,i) % 11) * parseInt(strIDno.charAt(17 - i),11);
        if(iSum%11!=1)
            return  "请输入正确的身份证号码";// 非法身份证号

        // 判断是否屏蔽身份证
        var words = new Array("11111119111111111","12121219121212121");

        for(var k=0;k<words.length;k++){
            if (strIDno.indexOf(words[k])!=-1){
                return "请输入正确的身份证号码";
            }
        }
        return true;
    },
    /**
     * 返回星期数
     */
    formatDay:function(day){
        switch (day){
            case 0 :return "星期日";break;
            case 1 :return "星期一";break;
            case 2 :return "星期二";break;
            case 3 :return "星期三";break;
            case 4 :return "星期四";break;
            case 5 :return "星期五";break;
            case 6 :return "星期六";break;
        }
    },
    /**
     * 比较两个日期相差的天数
     */
    compareDay:function(date1,date2,day){
       var time = date1.getTime() -date2.getTime();
       var days = time / (1000 * 60 * 60 * 24);
       return days > day ? false : true;
    },
    /**
     * 格式化手机号 去掉“-”
     *
     */
    formatPhoneNumNoSpace : function(phone){
        return phone.replace(/(\s)|(-)|(\+86)/ig,"");
    }
};

function ValidateError(message){
    var error = new Error(message);
    error.type = "validate";
    return error;
}

