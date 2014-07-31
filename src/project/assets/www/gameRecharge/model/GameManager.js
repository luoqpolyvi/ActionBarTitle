/**
 * 游戏订单参数
 */
var GamePreferences={
    "WarCraftWorld":{
        "category_code":"AASWZYMSSJ",//分类代码
        "category_name":"魔兽世界",
        "product_code":"",//产品代码
        "product_name":"",//产品名称
        "region_code":-1,//区域代码
        "server_code":-1,//服务器代码
        "charge_account":"",// 充值账号 战网通行证账号
        "ext_para1":"",//  扩展参数1  魔兽世界游戏账号 CHATGE_EXT1
        "ext_para2":"",// 扩展参数2 CHATGE_EXT2
        "ext_para3":""// 扩展参数3 CHATGE_EXT3
    },
    "QCoin":{
        "category_code":"AATXVVQQBK",//分类代码
        "category_name":"腾讯QQ卡（Q币）",
        "product_code":"",//产品代码
        "product_name":"",//产品名称
        "region_code": 5876,//区域代码
        "server_code": -1,//服务器代码
        "charge_account":"",// 充值账号 QQ号
        "ext_para1":"",//  扩展参数1 CHATGE_EXT1
        "ext_para2":"",// 扩展参数2 CHATGE_EXT2
        "ext_para3":""// 扩展参数3 CHATGE_EXT3
    }
}
/**
 * 游戏产品列表
 */
var GameList={
    "WarCraftWorld":[
        {
            "index":"world15",
            "product_name":"魔兽世界2000分钟15元",
            "product_code":"AASWZYMSSJ015CV",
            "parprice":"1500"
         },
        {
            "index":"world30",
            "product_name":"魔兽世界4000分钟30元",
            "product_code":"AASWZYMSSJ030CV",
            "parprice":"3000"
        }
     ],
    "QCoin":[
        {
            "index" : "Q1",
            "product_name":"QQ币1个Q币",
            "product_code":"AATXVVQQBK001CV",
            "parprice":"100"
        },
        {
            "index" : "Q2",
            "product_name":"QQ币2个Q币",
            "product_code":"AATXVVQQBK002CV",
            "parprice":"200"
        },
        {
            "index" : "Q5",
            "product_name":"QQ币5个Q币",
            "product_code":"AATXVVQQBK005CV",
            "parprice":"500"
        },
        {
            "index" : "Q6",
            "product_name":"QQ币6个Q币",
            "product_code":"AATXVVQQBK006CV",
            "parprice":"600"
        },
        {
            "index" : "Q10",
            "product_name":"QQ币10个Q币",
            "product_code":"AATXVVQQBK010CV",
            "parprice":"1000"
        },
        {
            "index" : "Q18",
            "product_name":"QQ币18个Q币",
            "product_code":"AATXVVQQBK018CV",
            "parprice":"1800"
        },
        {
            "index" : "Q30",
            "product_name":"QQ币30个Q币",
            "product_code":"AATXVVQQBK030CV",
            "parprice":"3000"
        },
        {
            "index" : "Q50",
            "product_name":"QQ币50个Q币",
            "product_code":"AATXVVQQBK050CV",
            "parprice":"5000"
        },
        {
            "index" : "Q100",
            "product_name":"QQ币100个Q币",
            "product_code":"AATXVVQQBK100CV",
            "parprice":"10000"
        },
        {
            "index" : "Q120",
            "product_name":"QQ币120个Q币",
            "product_code":"AATXVVQQBK120CV",
            "parprice":"12000"
        }
    ]
}

function GameManager(){
    var _this = this;

    _this.price ="";//充值面额

    _this.product = "";//充值游戏

    _this.payAmount = "";

    _this.charge_account ="";//充值账号

    _this.ext_para1="";////扩展参数1

    _this.orderData="";//充值订单参数

    this._format={
        price:function(){return parseInt(_this.price)/100+"元"},
        payAmount:function(){ return Validator.convertFenToYuan(_this.payAmount)}
    }

    /**
     *获取充值参数
     * GameCategory  游戏种类   Q币  魔兽世界
     * ProductCategory
     */
    _this.setChargeCategory =  function(GameCategory,ProductCategory){
        var category = "";
        $.each(GameList[GameCategory],function(property,item){
            if(item.index == ProductCategory)  {
                category = item;
                _this.price = item.parprice;
                return true;
            }
        })
        _this.product = (GameCategory=="QCoin") ? "Q币充值": "魔兽世界";
        return category;
    }
    /**
     * 设置订单参数
     *GameCategory  游戏种类
     * order 订单相关信息
     */
    _this.setChargeOrder = function(GameCategory,order){
        if(GameCategory=="QCoin"){
            GamePreferences[GameCategory].charge_account = order.QQAccount;
            _this.charge_account = order.QQAccount;
            _this.ext_para1="";
        }else{
            GamePreferences[GameCategory].charge_account = order.BattleAccount;
            GamePreferences[GameCategory].ext_para1 = order.GameAccount;
            _this.charge_account = order.BattleAccount;
            _this.ext_para1= order.GameAccount;
        }
        GamePreferences[GameCategory].product_name = order.catogery.product_name;
        GamePreferences[GameCategory].product_code = order.catogery.product_code;
        _this.orderData = GamePreferences[GameCategory];
        _this.orderData.u_id = xmesh.model["User"].id;//用户ID
    }
}