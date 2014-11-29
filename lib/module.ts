import utils = require("mykoop-utils");
var logger = utils.getLogger(module);
var ses = require("node-ses");

import CommunicationError = require("./classes/CommunicationError");

class Module extends utils.BaseModule implements mkcommunications.Module {
  ses = null;
  sesConfig: {
    key: string;
    secret: string;
    host: string;
    defaultSender?: string;
  }

  init() {
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
    if(!this.sesConfig.defaultSender) {
      logger.warn("No default sender email specified in [sesConfig.json]. " +
        "Set {defaultSender: \"emailValue\"} in file");
    }
  }

  sendEmail(params: mkcommunications.SendEmailParams, callback) {
    if(this.ses) {
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
      this.ses.sendemail(sendEmailParams, function(err, data, res) {
        callback(err && new CommunicationError(err));
      });
    } else {
      callback(new CommunicationError(null, "Email service unavailable"));
    }
  }

}

export = Module;
