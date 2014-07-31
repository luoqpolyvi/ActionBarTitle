//客户端数据缓存
var ListData = (function(){
    var list = {};
    return {
        put : function(key,value){
            if(!key) return;
            list[key] = {}
            list[key].initialTable = {
                "#": [],
                "a": [],
                "b": [],
                "c": [],
                "d": [],
                "e": [],
                "f": [],
                "g": [],
                "h": [],
                "i": [],
                "j": [],
                "k": [],
                "l": [],
                "m": [],
                "n": [],
                "o": [],
                "p": [],
                "q": [],
                "r": [],
                "s": [],
                "t": [],
                "u": [],
                "v": [],
                "w": [],
                "x": [],
                "y": [],
                "z": []
            };
            list[key].normalTable = [];

           if(key=='BusTargetStation'|| key=='AllBusTargetStation'){
               makeTargetStationList(list[key],value);
            }else if(key=="AllBusCity" || key=="BusCity"){
               makeBusCityList(list[key],value);
           }else if(key=="BusOriginStation" || key=="AllBusOriginStation"){
               makeOriginStationList(list[key],value)
           }
        },
        get : function(key){
            if(!list[key]) return [];
            return list[key];
        },
        remove : function(key){
            if(!list[key]) return;
            delete list[key];
        }
    }
})();


function makeBusCityList(List,value){
    for(var i = 0;i< value.length;i++){
        var city = value[i];
        var initial = Pinyin.codeTable[city.city[0]][0];
        List.initialTable[initial].push(city);
        List.normalTable.push({'city': city, jp: Pinyin.GetJP(city.city), qp: Pinyin.GetQP(city.city)});
    }
}

function makeTargetStationList(List,value){
    var numString = "0123456789";
    for(var i = 0;i< value.length;i++){
        var targetStation = value[i];
        var initial = Pinyin.codeTable[targetStation.stationName[0]][0];
        if(numString.indexOf(initial)>-1){
            List.initialTable[Pinyin.GetTable(initial)].push(targetStation);
        }else{
            List.initialTable[initial].push(targetStation);
        }
        List.normalTable.push({'BusTargetStation': targetStation, jp: Pinyin.GetJP(targetStation.stationName), qp: Pinyin.GetQP(targetStation.stationName)});
    }
}

function makeOriginStationList(List,value){
    for(var i = 0;i< value.length;i++){
        var originStation = value[i];
        if(originStation.name=="成都所有车站"){
            List.initialTable["#"].push(originStation);
        }else{
            var initial = Pinyin.codeTable[originStation.name[0]][0];
            List.initialTable[initial].push(originStation);
        }
        List.normalTable.push({'BusOriginStation': originStation, jp: Pinyin.GetJP(originStation.name), qp: Pinyin.GetQP(originStation.name)});
    }
}



