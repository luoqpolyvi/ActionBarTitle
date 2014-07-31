function BusCityManager(){
    var _this = $(this);

    this.originStationName = "";//出发站点名称

    this.targetCityName = "";//到达站点名称

    this.originCity="";//出发城市

    this.line="";

    this.cityVersion = function(){ return $.storage.get("cityVersion") ? $.storage.get("cityVersion") : "1"};

    this.originCityList = function(){ return $.parseJson($.storage.get("originCityList"))};//出发城市列表

    this.targetCityList = function(){ return $.parseJson($.storage.get("targetCityList"))};//到达城市列表


    this._format={
        line :function(){ return _this.originCity+"-"+_this.targetCityName}
    }

    this.getter("originStationName",function(){
        return $.storage.get("originStationName") ? $.storage.get("originStationName") :  "雅安西门汽车站";
    })

    this.getter("targetCityName",function(){
        return $.storage.get("targetCityName") ? $.storage.get("targetCityName") :  "请选择";
    })

    this.getter("originCity",function(){
        return $.storage.get("originCity") ? $.storage.get("originCity") :  "雅安";
    })


    /**
     * 城市站点检查更新
     */
    this.stationUpdate = function(success,error){
        service.post("/busTicket/stationUpdate.do",{version:_this.cityVersion()},function(rs){
            var cityData = rs.data;
            if(cityData.update=="true"){
                $.storage.set("cityVersion", cityData.version);
                $.storage.set("originCityList", $.toJson(cityData.originCityList));
                var targetCityList = [];
                $.each(cityData.targetCityList,function(property,item){
                     var targetItem = {};
                    targetItem.stationName = item.stationName;
                    targetCityList.push(targetItem);
                })
                $.storage.set("targetCityList", $.toJson(targetCityList));
//                $.storage.set("targetCityList", $.toJson(cityData.targetCityList));
            }
            if(success)success.apply(_this,arguments);
        },error);
    }


}
