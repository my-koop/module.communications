var Module = require("./module");
var ModuleBridge = (function () {
    function ModuleBridge() {
    }
    ModuleBridge.prototype.getInstance = function () {
        return this.instance || (this.instance = new Module());
    };
    ModuleBridge.prototype.onAllModulesInitialized = function () {
        this.getInstance().init();
    };
    ModuleBridge.prototype.getModule = function () {
        return this.getInstance();
    };
    return ModuleBridge;
})();
var bridge = new ModuleBridge();
module.exports = bridge;
