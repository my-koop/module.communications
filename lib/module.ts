import utils = require("mykoop-utils");
var logger = utils.getLogger(module);
var ses = require('node-ses');

var ApplicationError = utils.errors.ApplicationError;

class Module extends utils.BaseModule implements mkcommunications.Module {
  ses = null;

  init() {
    var sesConfig;
    try{
      sesConfig = require("sesConfig.json");
      this.ses = ses.createClient({
        key: sesConfig.key,
        secret: sesConfig.secret,
        amazon: sesConfig.host
      });
    } catch(e) {
      console.error("Unable to find SES configuration [sesConfig.json]", e);
    }
  }

  sendEmail(params: mkcommunications.SendEmailParams, callback) {
    if(this.ses) {
      this.ses.sendemail(params, function(err, data, res) {
        callback(err);
      });
    }
  }

}

export = Module;
