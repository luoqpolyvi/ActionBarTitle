function UserNotify(){
    var _this = this;

    this.dataTotal = 0;//总数量

    this.notifyPage = new Page();//页数管理

    this.noRead = 0;//未读数量

    this.getNotify = true;

    /**
     * 获取用户通知列表接口
     * @param page_index  页码
     * @param success
     * @param error
     */
    this.getUserNotify = function(display,success,error){
        encryptForDes(System.pwd_key, xmesh.model.User.id, function(rs){
            service.get("/user/getUserNotify.do",{
                page_index:_this.notifyPage.pageIndex,
                u_id:rs,
                page_size:50//一次50条
            },function(rs){
                    _this.dataTotal = rs.data.dataTotal;
                    _this.notifyPage.addAll(rs.data.dataList);
                    if(_this.notifyPage.list().length<parseInt(_this.dataTotal)){
                        _this.notifyPage.pageIndex++;
                        _this.getUserNotify(success,error);
                    }else{
                        $.each(_this.notifyPage.list(),function(property,item){
                            if(item.state=="notread") _this.noRead++;
                        })
                        if(success)success.apply(_this,arguments);
                    }
            },error,display);
        }, function(){Dialog.alert("加密错误");});
    }
    /**
     *
     */
    this.clear = function(){
        _this.reset();
        _this.notifyPage.clear();
    }
    /**
     *修改用户通知状态接口
     * @param type   all：修改所有  list：修改指定列表
     * @param notify_ids  以英文半角逗号（,）分割。（type=list时必传）
     * @param success
     * @param error
     */
    this.updateUserNotifyState = function(type,notify_ids,success,error){
        encryptForDes(System.pwd_key, xmesh.model.User.id, function(rs){
            service.get("/user/updateUserNotifyState.do",{
                type:type,
                u_id:rs,
                notify_ids:notify_ids
            },function(rs){
                updateState(notify_ids);
                if(success)success.apply(_this,arguments);
            },error);
        }, function(){Dialog.alert("加密错误");});

        function updateState(notify_ids){
            var list = _this.notifyPage.list();
            $.each(list,function(property,item){
                     if(item.id==notify_ids) {
                         item.state="readed";
                         _this.noRead--;
                     }//未读改成已读
            })
        }
    }
    /**
     *删除用户通知接口
     * @param notify_ids以英文半角逗号（,）分隔
     * @param success
     * @param error
     */
    this.deleteUserNotifyState = function(notify_ids,success,error){
        service.get("/user/deleteUserNotifyState.do",{notify_ids:notify_ids},function(rs){
            deleteNotify(notify_ids);
            if(success)success.apply(_this,arguments);
        },error);

        function deleteNotify(notify_ids){
            var ids = notify_ids.split(",");
            var list = _this.notifyPage.list();
            $.each(list,function(itemProperty,item){
                $.each(ids,function(property,id){
                    if(item.id==id) _this.notifyPage.pageDelete(itemProperty,1);
                    _this.noRead--;
                })
            })
        }

    }
    /**
     *删除用户所有通知接口
     * @param success
     * @param error
     */
    this.deleteUserAllNotify = function(success,error){
        encryptForDes(System.pwd_key,xmesh.model.User.id, function(rs){
            service.get("/user/deleteUserAllNotify.do",{ u_id:rs},function(rs){
                _this.notifyPage.clear();
                _this.dataTotal = 0;
                if(success)success.apply(_this,arguments);
                _this.noRead=0;
            },error);
        }, function(){Dialog.alert("加密错误");});
    }
    /**
     * 判断是否有下一页
     * @return {Boolean}
     */
    this.hasNextPage = function(){
        return _this.notifyPage.list().length < parseInt(_this.dataTotal);
    }
}