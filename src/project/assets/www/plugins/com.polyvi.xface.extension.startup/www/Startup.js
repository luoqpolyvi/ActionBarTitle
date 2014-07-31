cordova.define("com.polyvi.xface.extension.startup.Startup", function(require, exports, module) { 
var exec = require('cordova/exec');
var argscheck = require('cordova/argscheck');
var Startup = function() {
};

Startup.prototype.getParams = function(successCallback, errorCallback) {
    argscheck.checkArgs('FF', 'Startup.getParams', arguments);
    exec(successCallback, errorCallback,"Startup", "getParams", []);
};

module.exports = new Startup();
});
