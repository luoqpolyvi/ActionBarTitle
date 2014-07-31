function BusTicket(){
    var _this = this;
    this.signId = "";//标示ID
    this.originStation = "";//	始发站
    this.originStationId = "";//始发站代码
    this.targetStation	= "";//到达站
    this.driveTime = "";//发车时间
    this.fullPrice = "";//全票价
    this.halfPrice = "";//	半票价
    this.count = "";//余票数量
    this.schType = "";//班次类型
    this.busType = "";//车型
    this.mile = "";//公里数
    this.servicePrice="";//服务费
    this.date="";//发车日期
    this.time="";//发车时间

    this._format = {
        fullPrice:function(value){return Validator.convertFenToYuan(value);},
        servicePrice:function(value){return Validator.convertFenToYuan(value);},
        schType:function(value){
            if(value=="0") return "固定班";
            else return "滚动发班";
        },
        mile:function(value){return value+"公里";},
        date:function(){return _this.driveTime.substring(0,_this.driveTime.indexOf(" "))},
        time:function(){return _this.driveTime.substring(_this.driveTime.indexOf(" "),_this.driveTime.length)}
    }
}
