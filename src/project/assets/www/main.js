$.plugin('DotBox', 'component/DotBox.js');
$.plugin('Input', 'component/keyboard/Input.js');

document.bind("deviceready",function(){
        Startup.getParams(function(param){
        System.data = typeof param == "object"?param:JSON.parse(param);
        initPage();
    }, function(){
        console.error("获取启动参数失败！");
    });
});
function initPage(){
    /**
     * 此处取得的param.data参数用于lib库
     *
     */
    console.log("启动参数："+System.data);
    document.keyboard = new Keyboard();
    window.PageManager = $('#pageManager').css({"overflow":""});
    if(!System.isCache){
        xmesh
            .loadMap(System.data ? ((System.data.action == "home") ? 'merchantPortal.xml' : "map.xml") :'merchantPortal.xml')
            .attachPageManger(PageManager,false)
            .bind('pathChange', _handleOnPathChange)
            .bind('pathError', _handleOnPathError)
            .bind('actionError', _handleOnActionError)
            .bind('validateModelProperty', _handleOnValidateModelProperty)
            .bind('exit', _handleOnRequireExit)
            .home(true);
    }
}

function _handleOnValidateModelProperty(evt){
    var srcElement = evt.srcElement;
    if(evt.hasError){
        Dialog.toast(evt.message);
    }else{
        $.log(evt.property, evt.value);
    }
    if(srcElement) $.log('来自元素：'+srcElement.tagName);
}

function startApp(app){
    if(!app.src){return Dialog.toast("业务正在开发中...");}
    if(xmesh.model["User"].isLogin){
        xmesh.act(app.src,null);
    }else{
        xmesh.act("login",{
            success : function(url,data){
                xmesh.to(url,(data || null));
            },url :app.src,data:app.data
        });
    }
}

document.bind("deviceready",function(){
    window.xFace = xFace || {};
    xFace.app = xFace.app || {};
    xFace.app.close = function(){
        navigator.app.exitApp();
    };
    var body = document.getElementsByTagName('body')[0];
    body.style.minHeight=window.innerHeight + 'px';

    if($.isIOS){
        window.setTimeout(function(){navigator.splashscreen.hide();},100);
    }

    window.exitApp = function(){
        xFace.app.close();
    };
    window.backLock = null;
    document.bind("backbutton",function(){
        if(window.backLock) return;
        window.backLock = setTimeout(function(){window.backLock = null;}, 500);
        if(Dialog.progressDialog.visible){
            if(!Dialog.progressDialog.disabled)Dialog.progressDialog.close();
            return;
        }
        emitBackEvent();
    });

    document.bind("click",function(e){
        if(e.target.hasClass("returnLabel")){
            emitBackEvent();
        }
    });

    function emitBackEvent(){
        if(PageManager.activePage){
            var event = $.Event("backbutton");
            var preventDefaulted = false;
            event.preventDefault = function(){
                preventDefaulted = true;
            };
            PageManager.activePage.trigger(event);
            if(!preventDefaulted) xmesh.back();
        }
    }
});

document.bind("deviceready",function(){
    encryptForDes(System.auth_key, System.user_id, function(rs){
        System.user_id_des = rs;
    }, function(){alert("加密错误");});
});


function _handleOnRequireExit(evt){
    System.exit();
}
function encryptForDes(key,text,success,error){
    var options = new SecurityOptions();
    options.EncodeDataType = StringEncodeType.HEX;
    xFace.Security.encrypt(key, text, success, function(){alert("des加密错误");error()}, options);
}

function encryptRSA(text,success,error){
    xFace.UPPSecurity.encryptRSA(System.RSA_Modulus, System.RSA_Exponent, text, success, error);
}

document.bind("serviceerror",function(e){
    var err = e.error;
    if(err.code == "500000"){
        xmesh.model["User"].reset();
        xmesh.home();
    }
});

function showErrorMessage(error){
    var msg = error.message;
    if(""!=msg && null!==msg && undefined!=msg){
        if(error.type == "validate"){
            Dialog.toast(msg);
        }else{
            Dialog.alert(msg);
        }
    }
}

function _handleOnPathChange(evt){
    if(this.activeNode.src == "portal/view/login.html" || this.activeNode.src =="portal/view/register.html"
        || this.activeNode.src =="portal/view/personalCenter.html" || this.activeNode.src =="telRecharge/view/telRecharge.html"
        || this.activeNode.src =="gameRecharge/view/gameRecharge.html" || this.activeNode.src =="busTicket/view/busTicket.html"
        || this.activeNode.src =="lotteryTicket/view/lotteryTicket.html" || this.activeNode.src =="portal/view/electricTicket.html"
        || this.activeNode.src =="portal/view/messageCenter.html" || this.activeNode.src =="portal/view/orderList.html"
        || this.activeNode.src =="ya_lifePayment/view/accountList.html" || this.activeNode.src =="balanceInquiry/view/mySavingCards.html"
        || this.activeNode.src =="creditCard/view/creditCard.html" || this.activeNode.src =="portal/view/addressManager.html"
        || this.activeNode.src =="portal/view/contactManager.html" && System.data){
        PageManager.open(evt.cachedPage||this.activeNode.src, null, evt.param, 3,true);
    }else{
        PageManager.open(evt.cachedPage||this.activeNode.src, null, evt.param, evt.direction);
    }

}

function _handleOnPathError(evt){
	console.error('Can not find path: '+evt.path);
}

function _handleOnActionError(evt){
	console.error('Action not found: '+evt.action);
}

var value={
    page_size:50,
    page_index:1
};
window.getBill = function(){
    xmesh.model["BillManager"].getMyBillsGenerated(value,function(data){
        xmesh.model["BillManager"].generatedBillTotal = data.data.billTotal;
        xmesh.model["BillManager"].generatedBillTotalRs = data.data.bills;
        xmesh.model["BillManager"].getGeneratedBill = false;
        xmesh.broadcast.emit("getGeneratedBill");
    },window.getBillFails);
    xmesh.model["BillManager"].getMyBillsPaid(value,function(data){
        xmesh.model["BillManager"].paidBillTotal = data.data.billTotal;
        xmesh.model["BillManager"].paidBillTotalRs = data.data.bills;
        xmesh.model["BillManager"].getPaidBill = false;
        xmesh.broadcast.emit("getPaidBill");
    },window.getBillFails);
    xmesh.model["BillManager"].getMyBillsAll(value,function(data){
        xmesh.model["BillManager"].BillTotal = data.data.billTotal;
        xmesh.model["BillManager"].BillTotalRs = data.data.bills;
        xmesh.model["BillManager"].getTotalBill = false;
        xmesh.broadcast.emit("getTotalBill");
    },window.getBillFails);
}

window.getBillFails = function(){
    xmesh.model["BillManager"].generatedBillTotal = "0" ;
    xmesh.model["BillManager"].paidBillTotal = "0" ;
    xmesh.model["BillManager"].BillTotal = "0" ;
}

/*
###################################################
	PageManager
###################################################
*/
function onLoadNewPage(pageEvent){
    document.bind("deviceready",function(){
        var isIPhone = /iphone/gi.test(navigator.appVersion);
        if(isIPhone && device.version >= '7.0'){
            if(pageEvent.target.activePage.child('header')){
                pageEvent.target.activePage.child('header').css({"padding-top":'20px'});
                try{pageEvent.target.activePage.child('header > span').css({"top":'20px'});}catch(e){}
                try{pageEvent.target.activePage.child('header > input').css({"top":'20px'});}catch(e){}
                try{pageEvent.target.activePage.child('header > .returnLabel').css({"top":'20px'});}catch(e){}
                try{pageEvent.target.activePage.child('header > button').css({"top":'20px'});}catch(e){}
                try{pageEvent.target.activePage.child('header > [name=userInfo]').css({"top":'20px'});}catch(e){}
                try{pageEvent.target.activePage.child('header > [name=noRead]').css({"top":'30px'});}catch(e){}            }
            pageEvent.target.activePage.child('.content').css({"padding-top":"65px"});
            try{StatusBar.styleLightContent();}catch(e){}
        }
        else if(isIPhone)StatusBar.styleDefault();
    },false);
}

function onLoadError(evt){

}