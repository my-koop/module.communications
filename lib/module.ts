import utils = require("mykoop-utils");
var logger = utils.getLogger(module);
var ses = require("node-ses");
import async = require("async");

import CommunicationError = require("./classes/CommunicationError");

class Module extends utils.BaseModule implements mkcommunications.Module {
  ses = null;
  core: mkcore.Module;
  sesConfig: {
    key: string;
    secret: string;
    host: string;
    defaultSender?: string;
  }

  init() {
    this.core = <mkcore.Module>this.getModuleManager().get("core");
    try{
      this.sesConfig = require("sesConfig.json");
    } catch(e) {
      console.error("Unable to find SES configuration [sesConfig.json]", e);
      return;
    }
    this.ses = ses.createClient({
      key: this.sesConfig.key,
      secret: this.sesConfig.secret,
      amazon: this.sesConfig.host
    });
  }

  sendEmail(params: mkcommunications.SendEmailParams, callback) {
    var self = this;
    if(this.ses) {
      async.waterfall([
        function(next) {
          if(!params.from) {
            return self.core.getSettings({keys: ["globalSender"]}, function(err, configs) {
              next(err, configs && configs.globalSender);
            });
          }
          next(null, params.from);
        },
        function(from, next) {
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
          self.ses.sendemail(sendEmailParams, function(err, data, res) {
            if(err) { logger.verbose(err); }
            callback(err && new CommunicationError(err));
          });
        }
      ], callback);
    } else {
      callback(new CommunicationError(null, "Email service unavailable"));
    }
  }

}

export = Module;
