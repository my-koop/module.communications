var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require("mykoop-utils");
var logger = utils.getLogger(module);
var ses = require("node-ses");
var async = require("async");
var CommunicationError = require("./classes/CommunicationError");
var Module = (function (_super) {
    __extends(Module, _super);
    function Module() {
        _super.apply(this, arguments);
        this.ses = null;
    }
    Module.prototype.init = function () {
        this.core = this.getModuleManager().get("core");
        try {
            this.sesConfig = require("sesConfig.json");
        }
        catch (e) {
            console.error("Unable to find SES configuration [sesConfig.json]", e);
            return;
        }
        this.ses = ses.createClient({
            key: this.sesConfig.key,
            secret: this.sesConfig.secret,
            amazon: this.sesConfig.host
        });
    };
    Module.prototype.sendEmail = function (params, callback) {
        var self = this;
        if (this.ses) {
            async.waterfall([
                function (next) {
                    if (!params.from) {
                        return self.core.getSettings({ keys: ["globalSender"] }, function (err, configs) {
                            next(err, configs && configs.globalSender);
                        });
                    }
                    next(null, params.from);
                },
                function (from, next) {
                    var sendEmailParams = {
                        altText: params.altText,
                        bcc: params.bcc,
                        cc: params.cc,
                        from: from,
                        message: params.message,
                        replyTo: params.replyTo,
                        subject: params.subject,
                        to: params.to
                    };
                    self.ses.sendemail(sendEmailParams, function (err, data, res) {
                        if (err) {
                            logger.verbose(err);
                        }
                        callback(err && new CommunicationError(err));
                    });
                }
            ], callback);
        }
        else {
            callback(new CommunicationError(null, "Email service unavailable"));
        }
    };
    return Module;
})(utils.BaseModule);
module.exports = Module;
