function BusTicketManager() {

    var _this = this;

    this.date = "";//日期

    this.contactName = "";//购票联系人姓名

    this.contactPhone = "";//购票联系人号码

    this._format = {
        date:function () {
            var dateArray = _this.date.split("-");
            var selectDate = new Date(Number(dateArray[0]), Number(dateArray[1]) - 1, Number(dateArray[2]));
            return _this.date + " " + Validator.formatDay(selectDate.getDay());
        }
    }

    /**
     * 查询车票信息
     * @param success
     * @param error
     */
    this.getTicket = function (success, error) {
        service.post("/busTicket/ticket.do", {
            "originStationName":xmesh.model["BusCityManager"].originStationName,
            "targetCityName":xmesh.model["BusCityManager"].targetCityName,
            "date":_this.date
        }, function (rs) {
            if (success)success.call(_this, rs.data);
        }, error);
    }
    /**
     * 是否可以购买前一天的票
     */
    this.hasPrevDay = function () {
        var dateArray = _this.date.split("-");
        var date = new Date(Number(dateArray[0]), Number(dateArray[1]) - 1, Number(dateArray[2]));
        var toady = new Date();
        return Validator.compareDay(toady, date, 0)
    }
    /**
     * 是否可以购买后一天的票
     */
    this.hasAfterDay = function () {
        var dateArray = _this.date.split("-");
        var date = new Date(Number(dateArray[0]), Number(dateArray[1]) - 1, Number(dateArray[2]));
        var toady = new Date();
        return Validator.compareDay(date, toady, 8)
    }
    /*
     *区分固定班还是滚动发车
     */
    this._sliceArray = function (array) {
        var schType1 = [];
        var schType2 = [];
        $.each(array, function (property, item) {
            if (item.schType == "1") {//滚动发班
                schType1.push(item);
            } else {//固定板
                schType2.push(item);
            }
        })
        array = [];
        array.push(schType1);
        array.push(schType2);
        return array;
    }

    /**
     * 车次排序 up 升序  down  降序
     */
    this.sort = function (ticketsData, order, type) {
        var tickets = _this._sliceArray(ticketsData);
        if (order == "up") {
            var ticket1 = tickets[0].sort(asc);
            var ticket2 = tickets[1].sort(asc);
            return ticket1.concat(ticket2);
        } else {
            var ticket1 = tickets[0].sort(desc);
            var ticket2 = tickets[1].sort(desc);
            return ticket1.concat(ticket2);
        }
        function asc(item1, item2) {//升序
            switch (type) {
                case "time" :
                    if (item1.driveTime > item2.driveTime) return 1;
                    if (item1.driveTime < item2.driveTime) return -1;
                    break;
                case "price" :
                    if (item1.fullPrice > item2.fullPrice) return 1;
                    if (item1.fullPrice < item2.fullPrice) return -1;
                    break;
                case "countNum" :
                    if (item1.count > item2.count) return 1;
                    if (item1.count < item2.count) return -1;
                    break;
            }
        }

        function desc(item1, item2) {//升序
            switch (type) {
                case "time" :
                    if (item1.driveTime > item2.driveTime) return -1;
                    if (item1.driveTime < item2.driveTime) return 1;
                    break;
                case "price" :
                    if (item1.fullPrice > item2.fullPrice) return -1;
                    if (item1.fullPrice < item2.fullPrice) return 1;
                    break;
                case "countNum" :
                    if (item1.count > item2.count) return -1;
                    if (item1.count < item2.count) return 1;
                    break;
            }
        }
    }

}
