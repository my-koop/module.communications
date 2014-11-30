var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require("mykoop-utils");
var CommunicationError = (function (_super) {
    __extends(CommunicationError, _super);
    function CommunicationError(err, msg) {
        if (msg === void 0) { msg = "Communication Error"; }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        _super.call(this, err, msg, args);
        this.context = "communication";
    }
    return CommunicationError;
})(utils.errors);
module.exports = CommunicationError;
