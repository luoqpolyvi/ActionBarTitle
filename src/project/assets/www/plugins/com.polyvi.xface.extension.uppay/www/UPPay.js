cordova.define("com.polyvi.xface.extension.uppay.UPPay", function(require, exports, module) { /*
 Copyright 2012-2013, Polyvi Inc. (http://www.xface3.com)
 This program is distributed under the terms of the GNU General Public License.

 This file is part of xFace.

 xFace is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 xFace is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with xFace.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * 该模块提供银联支付相关功能
 * @module pay
 * @main pay
 */
var argscheck = require("cordova/argscheck");
var exec = require('cordova/exec');

/**
 * 此类提供中国银联的移动支付功能，不能通过new来创建该类的对象，只能通过UPPay对象
 * 来直接使用该类中定义的方法(Android, iOS)
 * @class UPPay
 * @static
 * @platform Android, iOS
 * @since 3.0.0
 */
var uppay = {
    /**
     * 启动银联移动支付控件进行支付操作(Android, iOS)
     * @example
        var uppaySuccess = function(info) {
            alert("uppay success!");
        };

        var uppayError = function(info) {
            alert("uppay error: " + info);
        };

        // 该transSerialNumber参数需要动态获取，不能直接使用
        UPPay.startPay(this.uppaySuccess, this.uppayError, '201305151722540071282', '01', null, null);
     * @method startPay
     * @param {Function} successCallback 成功回调函数
     * @param {String} successCallback.info 值为"success"
     * @param {Function} errorCallback 失败回调函数
     * @param {String} errorCallback.info 可能值为"fail"或者"cancel"
     * @param {String} transSerialNumber 交易流水号信息，银联后台生成，通过商户后台返回到客户端并传入支付控件
     * @param {String} mode 接入模式，取值说明<br/>
                "00"：代表接入生产环境（正式版本需要）<br/>
                "01"：代表接入开发测试环境（测试版本需要）<br/>
                "99": 代表pm测试环境（测试版本需要）<br/>
     * @param {String} [sysProvide=null] 保留使用
     * @param {String} [spId=null] 保留使用
     * @param {Array} [cards=null] 卡号列表，支付控件2.0.14新增的参数，必须传正确的卡号，否则支付控件无法启动。
     * @platform Android, iOS
     * @since 3.0.0
     */
    startPay: function(successCallback, errorCallback, transSerialNumber, mode, sysProvide, spId, cards) {
        argscheck.checkArgs('ffssSSA', 'UPPay.startPay', arguments);
        if(typeof transSerialNumber === "undefined" || typeof mode === "undefined" || 
            transSerialNumber === null || mode === null) {
            errorCallback("Argument transSerialNumber and mode must be not empty!");
            return;
        }
        transSerialNumber = transSerialNumber.toString();
        mode = mode.toString();
        sysProvide = sysProvide || null;
        spId = spId || null;
        cards = cards || null;
        exec(successCallback, errorCallback, "UPPay", "startPay", [transSerialNumber, mode, sysProvide, spId, cards]);
    },

    /**
     * 启动无卡余额查询(Android, iOS)
     * @example
        var uppaySuccess = function(result) {
            alert("start success!");
            document.getElementById('balance').innerText = result.balance;
            document.getElementById('availableBalance').innerText = result.availableBalance;
        };

        var uppayError = function(info) {
            alert("start error: " + info);
        };

        UPPay.startBalanceEnquire(this.uppaySuccess, this.uppayError, '6228671****45767', '01');
     * @method startBalanceEnquire
     * @param {Function} successCallback 成功回调函数
     * @param {String} successCallback.balance 余额
     * @param {String} successCallback.availableBalance 可用余额
     * @param {Function} errorCallback 失败回调函数
     * @param {String} errorCallback.info 值为"false"
     * @param {String} pan 银行卡号，必须全卡号
     * @param {String} mode 接入模式，取值说明<br/>
                "00"：代表接入生产环境（正式版本需要）<br/>
                "01"：代表接入开发测试环境（测试版本需要）<br/>
     * @platform Android, iOS
     * @since 3.0.0
     */
    startBalanceEnquire: function(successCallback, errorCallback, pan, mode) {
        argscheck.checkArgs('ffss', 'UPPay.startBalanceEnquire', arguments);
        exec(successCallback, errorCallback, "UPPay", "startBalanceEnquire", [pan, mode]);
    }
};
module.exports = uppay;

});
