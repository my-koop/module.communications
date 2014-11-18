var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require("mykoop-utils");
var logger = utils.getLogger(module);
var ses = require('node-ses');
var ApplicationError = utils.errors.ApplicationError;
var Module = (function (_super) {
    __extends(Module, _super);
    function Module() {
        _super.apply(this, arguments);
        this.ses = null;
    }
    Module.prototype.init = function () {
        var sesConfig;
        try {
            sesConfig = require("sesConfig.json");
            this.ses = ses.createClient({
                key: sesConfig.key,
                secret: sesConfig.secret,
                amazon: sesConfig.host
            });
        }
        catch (e) {
            console.error("Unable to find SES configuration [sesConfig.json]", e);
        }
    };
    Module.prototype.sendEmail = function (params, callback) {
        if (this.ses) {
            this.ses.sendemail(params, function (err, data, res) {
                callback(err);
            });
        }
    };
    return Module;
})(utils.BaseModule);
module.exports = Module;
