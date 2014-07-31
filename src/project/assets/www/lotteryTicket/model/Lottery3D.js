function Lottery3D (_){
    var _this = this;
    this.game="3D"; //名称
    this.name="";//中文名称
    this.termCode=""; //期号
    this.termBeginTime ="";//开期时间
    this.termEndTime="";//期结时间
    this.action ="buy_lottery";//操作行为
    this.cast_info=[];//投注消息
    this.perCastInfo=function(type,select_way,bet_code,cast_num,cast_amount){
        return {
            select_way:select_way,//选择方式  1= 手选 | 2=机选
            sell_way:(type=="z3") ? "2": ((cast_num==1)?"1" :"2"),//投注方式 1=单式|2=复式//只有组三是全复式
            bet_code:bet_code,//投注号码
            cast_num:"1",//倍数
            cast_zhu:cast_num,//注数
            cast_amount:cast_amount//投注金额 投注号码投注总金额，单位分
        }
    }
    this.getBall = function(){
        return ["00","01","02","03","04","05","06","07","08","09"];
    }

    this.multiple = "1";//倍数

    this.gameTips='3D每注投注金额为人民币2元。投注者可在中国福利彩票投注站进行投注。投注号码经投注机打印为兑奖凭证，交投注者保存，此兑奖凭证即为3D彩票。销售期号以开奖日界定，按日历年度编排。\r\n 投注者投注时可自选号码，也可机选。自选号码投注即将投注者选定的号码输入投注机进行投注；机选号码投注即由投注机随机产生投注号码进行投注。3D每期每个号码的投注注数，由各省根据市场销售情况限量发 行。\r\n3D的投注方式分为单选投注与组选投注。单选投注是将3位数以惟一的排列方式进行单注投注。组选投注是将投注号码的所有排列方式作 为一注投注号码进行的单注投注。如果一注组选号码的3个数字各不相同，则有6种不同的排列方式，因而就有6个中奖机会，这种组选投注方式简称"组选6"； 如果一注组选号码的3个数字有两个数字相同，则有3种不同的排列方式，因而就有3个中奖机会，这种组选投注方式简称"组选3"。';

    /**
     * 取新期 getLotteryInfo
     */
    this.getLotteryInfo = function(success,error){
        service.get("/lottery/getLotteryInfo.do",{"games":_this.game},function(rs){
            $.copyObject(_this,rs.data.dataList[0]);
            if(success)success.apply(_this,arguments);
        },error);
    }
    /**
     * 3D 机选投注数
     */
    this.randomSelect = function(type){
        var codeArray =_this.getBall();
        var castNum=[];
        var j = 10;
        var red_index;
        var number;
        switch (type){
            case "z3": number = 2;break;
            case "direct":
            case "z6": number = 3;break
        }
        for (var i = 0; i < number; i++) {
            red_index = parseInt(Math.random() * j +1);
            castNum.push(codeArray[red_index-1]);
            if(type!="direct") codeArray.splice(red_index-1, 1);//福彩3D直选可以有重复数据
            j--;
        };
        return castNum;
    }
    /**
     * 列表机选
     * @param type  3D类型
     */
    this.formatRandomSelect = function(type){
        var random = _this.randomSelect(type);
        switch (type){
            case "z3": var bet_code = random.join(",")+"$2";  var perCastInfo = _this.perCastInfo(type,"2",bet_code,2,400);break;
            case "direct":var bet_code = random.join("|")+"$1";  var perCastInfo = _this.perCastInfo(type,"2",bet_code,1,200);break;
            case "z6": var bet_code = random.join(",")+"$3";  var perCastInfo = _this.perCastInfo(type,"2",bet_code,1,200);break;
        }
        _this.cast_info.push(perCastInfo);
        return perCastInfo;
    }
    /**
     * 直选计算注数
     */
    this.get_direct_zhu = function(hundred,decade,unit){
        return hundred*decade*unit;
    }
    /**
     * 组三计算注数
     */
    this.get_z3_zhu = function(num){
        return num*(num-1);
    }
    /**
     *组六计算注数
     */
    this.get_z6_zhu = function(num){
        return num*(num-1)*(num-2)/6;
    }
    /**
     *
     */
    this.checkCodeLength = function(type,codeList){
        switch (type){
            case "direct":
                if(!codeList[0]) return "请至少选择一个百位数字";
                if(!codeList[1]) return "请至少选择一个十位数字";
                if(!codeList[2]) return "请至少选择一个个位数字";
                else return true;
                break;
            case "z3":if(!codeList || !codeList.length ) return "请选择至少2个数字";   else return true; break;
            case "z6":if(!codeList || !codeList.length ||codeList.length<3) return "请选择至少3个数字";   else return true; break;
        }
    }
    /**
     *处理3D投注单数传递
     */
    this.unitCode = function(bet_code){
        var code = bet_code.substring(0,bet_code.indexOf("$"));
        var type = bet_code.substring(bet_code.indexOf("$"),bet_code.length);
        if(code.indexOf("|")>=0){
             var sectionArray = code.split("|");
             var sectionResult = [];
            $.each(sectionArray,function(property,item){
                var section = item.split(",");
                var codeResult = [];
                $.each(section,function(property,item){
                    codeResult.push(parseInt(item));
                })
                sectionResult.push(codeResult.join(","));
            })
            return  sectionResult.join("|")+type;
        }else{
            var codeArray = code.split(",");
            var result = [];
            $.each(codeArray,function(property,item){;
                result.push(parseInt(item));
            })
            return  result.join(",")+type;
        }
    }
    /**
     *处理开奖号码3D返回单位数为00显示型式
     */
    this.doubleCode = function(bet_code){
         var codeArray = bet_code.split("|");
         var result = [];
         $.each(codeArray,function(property,item){;
                result.push("0"+item);
         })
        return result.join("|");
    }
    /**
     *处理返回的投注号码，双位数显示
     */
    this.doubleCastCode = function(bet_code){
        var code = bet_code.substring(0,bet_code.indexOf("$"));
        var type = bet_code.substring(bet_code.indexOf("$"),bet_code.length);
        if(code.indexOf("|")>=0){
            var sectionArray = code.split("|");
            var sectionResult = [];
            $.each(sectionArray,function(property,item){
                var section = item.split(",");
                var codeResult = [];
                $.each(section,function(property,item){
                    if(item.length==1)    codeResult.push("0"+item);
                    else codeResult.push(item);
                })
                sectionResult.push(codeResult.join(","));
            })
            return  sectionResult.join("|")+type;
        }else{
            var codeArray = code.split(",");
            var result = [];
            $.each(codeArray,function(property,item){;
                if(item.length==1)    result.push("0"+item);
                else result.push(item);
            })
            return  result.join(",")+type;
        }
    }
}