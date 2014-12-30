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
var _ = require("lodash");
var CommunicationError = require("./classes/CommunicationError");
var sesSendingLimit = 50;
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
                    // Common info for all sending group
                    var emailInfo = {
                        altText: params.altText,
                        from: from,
                        message: params.message,
                        replyTo: params.replyTo,
                        subject: params.subject,
                    };
                    // Create sending group of 50 emails max
                    var destinationEmails = [params.to, params.cc, params.bcc];
                    // Number of emails for each type (to, cc, bcc)
                    var quantities = _.map(destinationEmails, function (g) {
                        if (_.isArray(g)) {
                            return g.length;
                        }
                        // if it's a string the length is 1,
                        // if it's falsey, length is 0
                        return (g && 1) || 0;
                    });
                    var allEmails = _(destinationEmails).compact().flatten().value();
                    var sendingGroups = [];
                    while (!_.isEmpty(allEmails)) {
                        var curLimit = sesSendingLimit;
                        var sendingGroup = _.map(quantities, function (quantity, i, quantities) {
                            var selection = Math.min(curLimit, quantity);
                            quantities[i] = quantity - selection;
                            var res = _.first(allEmails, selection);
                            allEmails = _.rest(allEmails, selection);
                            curLimit -= selection;
                            return res;
                        });
                        // Create sending group, combine emails with email info
                        sendingGroups.push(_.merge(_.zipObject(["to", "cc", "bcc"], sendingGroup), emailInfo));
                    }
                    // Batch send all sending groups
                    async.each(sendingGroups, function (sendingGroup, next) {
                        self.ses.sendemail(sendingGroup, function (err, data, res) {
                            if (err) {
                                logger.verbose(err);
                            }
                            callback(err && new CommunicationError(err));
                        });
                    }, function (err) {
                        next(err);
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
