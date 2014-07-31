/**
 * Created with JetBrains WebStorm.
 * User: yuany
 * Date: 13-11-28
 * Time: 上午10:33
 * To change this template use File | Settings | File Templates.
 */
function BillManager(){
    var _this = this;
    _this.tradeBills = new Page();
    _this.myBills = new Page();
    this.generatedBillTotal = "0";
    this.generatedBillTotalRs = [];
    this.paidBillTotal = "0";
    this.paidBillTotalRs = [];
    this.BillTotal = "0";
    this.BillTotalRs = [];
    this.getGeneratedBill = true;
    this.getPaidBill = true;
    this.getTotalBill = true;

    /**
     * 查询交易记录
     * @param param
     * @param success
     * @param error
     */
    _this.getTradeBills = function(param,success,error){
        _this.tradeBills.clear();
        service.post("/more/getTradeBillList.do",{
            page_index:param.page_index,
            page_size:param.page_size,
            pay_date_time:param.pay_date_time,
            pay_date_time_min:param.pay_date_time_min,
            pay_date_time_max:param.pay_date_time_max,
            m_id:xmesh.model["User"].m_id,
            status:param.status
        },function(rs){
            if(!rs)rs={};
            var bills = rs.data.bills||[];
            _this.tradeBills.totalPage = rs["pageTotal"];
            _this.tradeBills.pageIndex = param.page_index;
            bills.forEach(function(item){
                _this.tradeBills.add($.copyObject(new Bill(),item));
            });
            if(success)success.call(_this,page);
        },error)
    };

    /**
     * 我的账单-未支付
     * @param param
     * @param success
     * @param error
     */
    _this.getMyBillsGenerated = function(param,success,error){
        _this.myBills.clear();
        service.get("/more/getMyBillList.do",{
            page_index:param.page_index,
            page_size:param.page_size,
            m_id:xmesh.model["User"].m_id,
            type:"generated"//all-全部，paid已支付，generated未支付
        },function(rs){
            if(success)success.apply(rs,arguments);
        },error)
    };

    /**
     * 我的账单-已支付
     * @param param
     * @param success
     * @param error
     */
    _this.getMyBillsPaid = function(param,success,error){
        _this.myBills.clear();
        service.get("/more/getMyBillList.do",{
            page_index:param.page_index,
            page_size:param.page_size,
            m_id:xmesh.model["User"].m_id,
            type:"paid"//all-全部，paid已支付，generated未支付
        },function(rs){
            if(success)success.apply(rs,arguments);
        },error)
    };

    /**
     * 我的账单-全部
     * @param param
     * @param success
     * @param error
     */
    _this.getMyBillsAll = function(param,success,error){
        _this.myBills.clear();
        service.get("/more/getMyBillList.do",{
            page_index:param.page_index,
            page_size:param.page_size,
            m_id:xmesh.model["User"].m_id,
            type:"all"//all-全部，paid已支付，generated未支付
        },function(rs){
            if(success)success.apply(rs,arguments);
        },error)
    };


}