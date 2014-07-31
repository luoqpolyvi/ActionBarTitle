var Dialog = {
    confirm:function (msg, ok, cancel, title, buttons, callback) {
        msg = String(msg);
        title = "提醒"||title;
        buttons =["确定","取消"]||buttons;
        if (buttons instanceof  Array)buttons = buttons.join(",");
        if (!callback)callback = function (index) {
            if (index == 1) {
                if(ok)ok();
            } else if(index == 2){
                if(cancel)cancel();
            }
        };
        if(navigator.notification && navigator.notification.confirm){
            navigator.notification.confirm(msg, callback, title, buttons);
            return;
        }
        if(window.confirm(msg)){
            if(ok)ok();
        }else{
            if(cancel)cancel();
        }
    },
    alert:function (msg, ok, title, button) {
        msg = String(msg);
        title = "提醒";
        button = button || "确定";
        ok = null || ok;
        if(navigator.notification && navigator.notification.alert){
            navigator.notification.alert(msg, ok, title, button);
            return;
        }
        window.alert(msg);
        if(ok)ok();
    },
    toast:(function () {
        var c, timer;
        return function Toast(msg, duration,position) {
            if(!msg && msg != "")return;
            if (typeof duration != "number") duration = 2000;
            if (c && c.parentNode) {
                c.remove();
                clearTimeout(timer);
            }
            c = $.Element("div").attribute("id","dialogPage").attribute("data-box","v");
            var td = $.Element("div").attribute("data-box","h").addClass("bottomDialog");
            var t = $.Element("span").addClass("dialog");
            t.html(msg.toString());
            td.append(t);
            c.append(td);
            document.body.appendChild(c);
            timer = setTimeout(function () {
                if(!c)return;
                c.remove();
                c = undefined;
            }, duration + 200);
        }
    })(),

    progressDialog:(function () {
        function ProgressDialog() {
            var _this = $(this);
            _this.message = "loading";
            var isVisible = false;
            var dialog;
            var _disable = false;

            _this.show = function (msg,canNotCancel) {
                if(msg!==undefined||msg!==null)_this.message = msg;
                dialog.show();
                isVisible = true;
                this.disabled = !!canNotCancel;
                return _this;
            };

            _this.close = function () {
                dialog.hide();
                isVisible = false;
                _this.disabled = false;
                _this.trigger($.Event("close"));
                return _this;
            };
            _this.setMessage = function(text){
                _this.message = text;
                return _this;
            };
            _this.getter("visible", function () {
                return isVisible;
            });
            _this.getter("message", function () {
                return dialog.message.innerHTML;
            });
            _this.setter("message", function (message) {
                dialog.message.innerHTML = message;
            });
            _this.setter("disabled",function(disable){
                _disable = disable === true;
                if(_disable){
                    dialog.closeButton.setAttribute("disabled","disabled");
                }else{
                    dialog.closeButton.removeAttribute("disabled");
                }
            });
            _this.getter("disabled",function(){
                return _disable;
            });

            function _createDialog() {
                var maskWrapper = $.Element("div").attribute("id","loadingPage").attribute("data-box","v").hide();
                var progressDialog = $.Element("div").attribute("data-box","h").addClass("loaingCont");
                maskWrapper.context = progressDialog;
                maskWrapper.message = $.Element("div").appendTo(progressDialog);
                $.Element("div").addClass("loading").appendTo(progressDialog);
                progressDialog.append($.Element("div").addClass("line"));
                maskWrapper.closeButton = $.Element("div").addClass("closeBtn")
                    .appendTo(progressDialog).bind("click", function () {
                        if (!_disable)_this.close();
                    }, false);
                maskWrapper.append(progressDialog);
                document.body.appendChild(maskWrapper);
                maskWrapper.show = function(){
                    maskWrapper.style.display = "-webkit-box";
                };
                dialog = maskWrapper;
            }

            if(document.body){
                _createDialog();
            }else{
                document.addEventListener("DOMContentLoaded",_createDialog);
            }
        }

        return new ProgressDialog();
    })()
};