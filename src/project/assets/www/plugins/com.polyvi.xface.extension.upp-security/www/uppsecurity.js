cordova.define("com.polyvi.xface.extension.upp-security.UPPSecurity", function(require, exports, module) { /**
 * 该模块提供加密的功能
 * @module UPPSecurity
 * @main   UPPSecurity
 */

 /**
  * 该类提供一系列基础api，用于字符串或者文件的加解密操作（Android,iOS）<br/>
  * 该类不能通过new来创建相应的对象，只能通过xFace.UPPSecurity对象来直接使用该类中定义的方法
  * @class UPPSecurity
  * @platform Android
  * @since 3.0.0
  */
var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');
var UPPSecurity = function() {};

/**
 * 根据传入的密钥对明文字符串加密，并返回加密后的密文（Android, iOS）<br/>
 * @example
        //采用RSA方式加密并以16进制返回加密数据
        xFace.UPPSecurity.encryptRSA(modulus, publicExponent, plainText, encryptSuccess, encryptError);
        function encryptSuccess(encryptedText) {
            alert("encryptedContent:" + encryptedText);
        }
        function encryptError(errorcode) {
            alert("Encrypt file error:" + errorcode);
        }
 * @method encryptRSA
 * @param {String} modulus 加密模数，长度必须大于或等于8个字符
 * @param {String} publicExponent 公钥指数
 * @param {String} plainText 需要加密的明文
 * @param {Function} [successCallback] 成功回调函数
 * @param {String} successCallback.encryptedText 该参数用于返回加密后的密文内容
 * @param {Function} [errorCallback]  失败回调函数
 * @param {String} errorCallback.errorCode 该参数用于返回加密错误码
 *         错误码：1:参数错误<br/>
 *                 2:加密出错<br/>
 *                 3:未知错误<br/>
 * <ul>返回的加密错误码具体说明：</ul>
 * <ul>1:   文件找不到错误</ul>
 * <ul>2:   加密路径错误</ul>
 * <ul>3:   加密过程出错</ul>
 * @platform Android,iOS
 */
UPPSecurity.prototype.encryptRSA = function(modulus, publicExponent, plainText, successCallback, errorCallback){
    argscheck.checkArgs('sssFF', 'xFace.UPPSecurity.encryptRSA', arguments);
    if(modulus.length < 8 || plainText.length == 0){
        if(errorCallback) {
            errorCallback("Wrong parameter! modulus length is less than 8");
        }
        return;
    }
    exec(successCallback, errorCallback, "UPPSecurity", "encryptRSA", [modulus, publicExponent, plainText]);
};

/**
 * 获取客户端应用的校验和（Android）<br/>
 * @example
        xFace.UPPSecurity.getClientChecksum(key, infoText, encryptSuccess, encryptError);
        function encryptSuccess(checkSum) {
            alert("checkSum:" + checkSum);
        }
        function encryptError(errorcode) {
            alert("GetClientChecksum error:" + errorcode);
        }
 * @method getClientChecksum
 * @param {String} key 动态密钥（hex串），长度必须大于或等于8个字符
 * @param {String} infoText 业务信息文本串
 * @param {Function} [successCallback] 成功回调函数
 * @param {String} successCallback.encryptedText 该参数用于返回客户端应用的校验和（hex串）
 * @param {Function} [errorCallback]  失败回调函数
 * @param {String} errorCallback.errorCode 该参数用于返回获取校验和失败的错误码
 * <ul>返回的获取校验和失败的错误码具体说明：</ul>
 * <ul>1:   文件找不到错误</ul>
 * <ul>2:   获取校验和路径错误</ul>
 * <ul>3:   获取校验和过程出错</ul>
 * @platform Android
 */
UPPSecurity.prototype.getClientChecksum = function(key, infoText, successCallback, errorCallback){
    argscheck.checkArgs('ssFF', 'xFace.UPPSecurity.getClientChecksum', arguments);
    if(key.length < 8 || infoText.length == 0){
        if(errorCallback) {
            errorCallback("Wrong parameter of getClientChecksum!");
        }
        return;
    }
    exec(successCallback, errorCallback, "UPPSecurity", "getClientChecksum", [key, infoText]);
};

module.exports = new UPPSecurity();
});
