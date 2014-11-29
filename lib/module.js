var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require("mykoop-utils");
var logger = utils.getLogger(module);
var ses = require("node-ses");
var CommunicationError = require("./classes/CommunicationError");
var Module = (function (_super) {
    __extends(Module, _super);
    function Module() {
        _super.apply(this, arguments);
        this.ses = null;
    }
    Module.prototype.init = function () {
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
        if (!this.sesConfig.defaultSender) {
            logger.warn("No default sender email specified in [sesConfig.json]. " + "Set {defaultSender: \"emailValue\"} in file");
        }
    };
    Module.prototype.sendEmail = function (params, callback) {
        if (this.ses) {
            var sendEmailParams = {
                altText: params.altText,
                bcc: params.bcc,
                cc: params.cc,
                from: params.from || this.sesConfig.defaultSender,
                message: params.message,
                replyTo: params.replyTo,
                subject: params.subject,
                to: params.to
            };
            this.ses.sendemail(sendEmailParams, function (err, data, res) {
                callback(err && new CommunicationError(err));
            });
        }
        else {
            callback(new CommunicationError(null, "Email service unavailable"));
        }
    };
    return Module;
})(utils.BaseModule);
module.exports = Module;
