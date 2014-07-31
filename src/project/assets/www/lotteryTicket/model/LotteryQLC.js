function LotteryQLC(_){
        var _this = this;
        this.game="QLC"; //名称
        this.name="";//中文名称
        this.termCode=""; //期号
        this.termBeginTime ="";//开期时间
        this.termEndTime="";//期结时间
        this.action ="buy_lottery";//操作行为
        this.cast_info=[];//投注消息
        this.perCastInfo=function(select_way,bet_code,cast_num,cast_amount){
            return {
                select_way:select_way,//选择方式  1= 手选 | 2=机选
                sell_way:(cast_num==1) ? "1": "2",//投注方式 1=单式|2=复式
                bet_code:bet_code,//投注号码
                cast_num:"1",//倍数
                cast_zhu:cast_num,//注数
                cast_amount:cast_amount//投注金额 投注号码投注总金额，单位分
            }
        }
        this.getBall = function(){
            return ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21"
                ,"22","23","24","25","26","27","28","29","30"];
        }
        this.multiple = "1";//倍数
        this.gameTips="七乐彩采用组合式玩法,从01—30共30个号码中选择7个号码组合为一注投注号码。每注金额人民币2元。\r\n七乐彩每周销售三期，期号以开奖日界定，按日历年度编排。\r\n七乐彩投注方法分为自选号码投注和机选号码投注，投注方式分为单式投注、复式投注和多倍投注。\r\n自选号码投注是指由投注者自行选定投注号码的投注；机选号码投注是指由投注机为投注者随机产生投注号码的投注。\r\n单式投注是从30个号码中选择7个号码，组合为一注投注号码的投注；复式投注是从30个号码中选择8－16个号码，将每7个号码的组合方式都作为一注投注号码的多注投注；胆拖投注是在30个号码中选择1至6个号码作为每注都有的胆码，再补充其它不同的号码，进行每7个号码为一组的多注投注；多倍投注是指同样的投注号码进行多注投注。\r\n";
        /**
         * 取新期 getLotteryInfo
         * @param games 玩法英文名称
         */
        this.getLotteryInfo = function(success,error){
            service.get("/lottery/getLotteryInfo.do",{"games":_this.game},function(rs){
                $.copyObject(_this,rs.data.dataList[0]);
                if(success)success.apply(_this,arguments);
            },error);
        }
        /**
         * 七色彩机选投注数
         */
        this.randomSelect = function(){
            var codeArray = _this.getBall(),castNum=[];
            var j = 30;
            var red_index;
            for (var i = 0; i < 7; i++) {
                red_index = parseInt(Math.random() * j +1);
                castNum.push(codeArray[red_index-1]);
                codeArray.splice(red_index-1, 1);
                j--;
            }
            return castNum;
        }
        /**
         *  列表页面 七色彩机选投注数
         */
        this.formatRandomSelect = function(){
            var random = _this.randomSelect();
            var bet_code = random.join(",");
            var perCastInfo = _this.perCastInfo("2",bet_code,1,200);
            _this.cast_info.push(perCastInfo);
            return perCastInfo;
        }
        /**
         * 计算注数
         * redLength 红球个数
         * blueLength 蓝球个数
         *
         */
        this.get_zhu = function(num){
            if (num > 6 && num < 17) {
                var total =  num;
                for (var i = 1; i < 7; i++) {
                    total *= ( --num );
                }
                return  Math.ceil(total / 5040);

            } else {
                return 0;
            }
        };
        /**
         * 检测
         */
        this.checkCodeLength= function(codeList){
           if(!codeList || !codeList.length || codeList.length<7 ) return "请选择至少7个红球";
           if(codeList.length>16) return "最多选择16个红球";
           else return true;
        };
}