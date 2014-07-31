function ElectricTickets(){
    var _this = this;
    _this.volumeRequest = true;
    _this.mallVolumeRequest = true;
    _this.volumeList = null;
    _this.myTicketDetail = null;
    _this.deleteState = true; //true正常状态  false删除状态
    _this.mallVolumeNumber = 0;

    _this.volumeListNumber = 0;
    /*
    * ################################################
    *               我的优惠券的操作
    * ################################################
    * */
    /*
    * 获取我的优惠劵信息列表
    * */
    _this.getMyVolumeList = function(data,success,error){
        var _data = {};
        _data.u_id = xmesh.model['User'].id;
        _data.page_size = data.page_size||20;
        _data.page_index = data.page_index||1;
//        alert(typeof navigator.geolocation.getCurrentPosition);
//        navigator.geolocation.getCurrentPosition(function(position){
//            _data.longitude = position.coords.longitude;
//            _data.latitude = position.coords.latitude;
//            $.log(JSON.stringify(position));
            _data.longitude = 104.0957222;
            _data.latitude = 30.6758925;
            service.get("/volume/getMyVolumeList.do",_data,function(rs){
                if(success)success.apply(_this,arguments);
            },error)
//        },function(error){alert(JSON.stringify(error))},{
//            maximumAge : 5000,
//                timeout : 60000,
//                enableHighAccuracy : true
//        });

    };

    /*
    * 获取我的优惠劵详细信息
    * */
    _this.getMyVolumeInfo = function(data,success,error){
        var _data = {
            'volume_detail_id':data.volume_detail_id
        }
        service.get("/volume/getMyVolumeInfo.do",_data,function(rs){
            _this.myTicketDetail = rs.data;
            if(success)success.apply(_this,arguments);
        },error)
    };

    /*
     * 获取电子票+优惠劵信息列表
     * */
    _this.getTicketAndVolumeList = function(success,error){
        var _data = {};
        _data.u_id = xmesh.model['User'].id;
//        alert(typeof navigator.geolocation.getCurrentPosition);
//        navigator.geolocation.getCurrentPosition(function(position){
//            _data.longitude = position.coords.longitude;
//            _data.latitude = position.coords.latitude;
//            $.log(JSON.stringify(position));
        _data.longitude = 104.0957222;
        _data.latitude = 30.6758925;
        service.get("/volume/getTicketAndVolumeList.do",_data,function(rs){
            _this.volumeList = rs.data.volumeList;
            _this.volumeListNumber =  _this.volumeList.length;
            if(success)success.apply(_this,arguments);
        },error)
//        },function(error){alert(JSON.stringify(error))},{
//            maximumAge : 5000,
//                timeout : 60000,
//                enableHighAccuracy : true
//        });

    };

    /*
    * 转赠优惠劵
    * */
    _this.presentVolume =  function(data,success,error){
        var _data = {};
        _data.u_id = xmesh.model['User'].id;
        _data.volume_detail_id = data.volume_detail_id;
        _data.phone = data.phone;
        service.get("/volume/presentVolume.do",_data,function(rs){
            if(success)success.apply(_this,arguments);
        },error)
    };

    /*
    * 获取优惠劵门店信息列表
    * */
    _this.getStoreList =function(data,success,error){
        var _data = {};
        _data.volume_id = data.volume_id;
        service.get("/volume/getStoreList.do",_data,function(rs){
            if(success)success.apply(_this,arguments);
        },error)
    };

    /*
    *优惠劵购买生成订单接口
    * */
    _this.generateOrder =function(data,success,error){
        var _data = {};
        _data.u_id = xmesh.model['User'].id;
        _data.volume_detail_id = data.volume_detail_id;
        _data.amount = data.amount;
        _data.count = data.count;
        _data.action = 'buy_volume';
        service.get("/volume/generateOrder.do",_data,function(rs){
            if(success)success.apply(_this,arguments);
        },error)
    };

    /*
    *删除我的优惠劵
    * */
    _this.deleteMyVolume =function(data,success,error){
        var _data = {};
        _data.u_id = xmesh.model['User'].id;
        _data.volume_detail_id = data.volume_detail_id;
        _data.type = data.type;
        service.get("/volume/deleteMyVolume.do",_data,function(rs){
            if(success)success.apply(_this,arguments);
        },error)
    };

    /*
    * 取回/拒绝转赠优惠券
    * type :restore:取回refuse:拒绝
    * */
    _this.restoreVolume = function(data,success,error){
        var _data = {};
        _data.volume_detail_id = data.volume_detail_id;
        _data.type = data.type;
        service.get("/volume/restoreVolume.do",_data,function(rs){
            if(success)success.apply(_this,arguments);
        },error)
    };

    /*
    * 领取转赠优惠券
    * */
    _this.receiveVolume = function(data,success,error){
        var _data = {};
        _data.u_id = xmesh.model['User'].id;
        _data.volume_detail_id = data.volume_detail_id;
        service.get("/volume/receiveVolume.do",_data,function(rs){
            if(success)success.apply(_this,arguments);
        },error)
    };

    /*
    *使用优惠劵
    * */
    _this.useVolume = function(data,success,error){
        var _data = {};
        _data.action = 'useVolume';
        _data.volume_detail_id = data.volume_detail_id;
        service.get("/volume/useVolume.do",_data,function(rs){
            if(success)success.apply(_this,arguments);
        },error)
    };

    /*
     * ################################################
     *               商城的优惠券的操作
     * ################################################
     * */

     /*
    *	获取全部优惠劵信息列表
    * */
    _this.getVolumeList = function(data,success,error){
        var _data = {};
        _data.city_name = data.city_name||'';
        _data.page_size = data.page_size||50;
        _data.page_index = data.page_index||1;
//        navigator.geolocation.getCurrentPosition(function(position){
//            _data.longitude = position.coords.longitude;
//            _data.latitude = position.coords.latitude;
//            $.log(JSON.stringify(position));
        _data.longitude = 104.0957222;
        _data.latitude = 30.6758925;
        service.get("/volume/getVolumeList.do",_data,function(rs){
            _this.mallVolumeNumber = rs.data.dataTotal;
            if(success)success.apply(_this,arguments);
        },error)
//        },function(error){alert(JSON.stringify(error))},{
//            maximumAge : 5000,
//                timeout : 60000,
//                enableHighAccuracy : true
//        });
    };

    /*
    * 获取优惠劵详细信息
    * */
    _this.getVolumeInfo = function(data,success,error){
        var _data = {};
        _data.volume_id=data.volume_id||'7299c718-3c5d-429c-9877-8349956a92cc';
        service.get("/volume/getVolumeInfo.do",_data,function(rs){
            console.log(rs);
            if(success)success.apply(_this,arguments);
        },error)
    };

    /*
    * 收藏（领取）优惠劵  在商城中电子券的操作
    * */
    _this.favoriteVolume = function(data,success,error){
        var _data = {};
        _data.u_id = xmesh.model['User'].id;
        _data.volume_id = data.volume_id;
        _data.count = data.count;
        _data.action = "get_volume";
        service.get("/volume/favoriteVolume.do",_data,function(rs){
            if(success)success.apply(_this,arguments);
        },error)
    };

    /*
    * 在商城中使用优惠劵
    * 号码:number；二维码:two_dimensional_code；微护照:wei_pass
    * */
    _this.useVolumeInStore = function(data,success,error){
        var _data = {};
        _data.u_id = xmesh.model['User'].id;
        _data.volume_id = data.volume_id;
        _data.passType = data.passType;
        service.get("/volume/useVolumeInStore.do",_data,function(rs){
            if(success)success.apply(_this,arguments);
        },error)
    };

    /*
    * 在商城中转赠优惠劵
    * */
    _this.presentVolumeInStore = function(data,success,error){
        var _data = {};
        _data.u_id = xmesh.model['User'].id;
        _data.volume_id = data.volume_id;
        _data.phone = data.phone;
        service.get("/volume/presentVolumeInStore.do",_data,function(rs){
            if(success)success.apply(_this,arguments);
        },error)
    };
}
