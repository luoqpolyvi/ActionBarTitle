/**
 * 分页对象
 * @constructor
 */
function Page(index){
    var data = [];
    this.totalPage = 0;
    this.pageIndex = index || 1;
    this.orderby = "";

    this.add = function(item){
        data.push(item);
        return this;
    };
    this.addAll = function(array){
        if(!(array instanceof Array))throw new Error("type must is Array");
        data = data.concat(array);
        return this;
    };
    this.list = function(){
        return data;
    };
    this.get = function(index){
        return data[index];
    };
    this.pageDelete = function(index,length){
        data = data.splice(index,length);
    }
    this.hasPrev = function(){
        return this.pageIndex > 1;
    };
    this.hasNext = function(){
        return this.pageIndex < this.totalPage;
    };
    this.clear = function(){
        data.length = 0;
        this.pageIndex= index || 1 ;
        this.totalPage=0;
        return this;
    }
}