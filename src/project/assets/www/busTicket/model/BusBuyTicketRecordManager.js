function BusBuyTicketRecordManager(){
    var _this = this;
    this.totalCount = 0;
    this.ticketList = [];
    this.ticketListSort = [];

    /**
     * 获取购票记录
     * @param data
     * @param success
     * @param error
     */
    this.buyTicketRecord = function(data,success,error){
        service.post("/busTicket/buyTicketRecord.do",{
            userId:xmesh.model["User"].id ,                       //"eaa2a86f-3e06-4614-a2a1-2b946934d502"  todo
            pageIndex:data.pageIndex,
            pageSize:data.pageSize
        },function(rs){
            _this.totalCount = rs.data.totalCount;
            _this.ticketList = rs.data.buyTicketRecordList;
            _this.ticketListSort = rs.data.buyTicketRecordList.sort(desc);
            function desc(item1,item2){//降序
                if(item1.createTime > item2.createTime) return -1;
                if(item1.createTime < item2.createTime) return 1;
            }
            if(success)success.apply(_this,arguments);
        },error);
    }
}