import utils = require("mykoop-utils");
var logger = utils.getLogger(module);
var ses = require("node-ses");
import async = require("async");
import _ = require("lodash");

import CommunicationError = require("./classes/CommunicationError");
var sesSendingLimit = 50;

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
          var quantities = _.map(destinationEmails, function(g) {
            if(_.isArray(g)) {
              return g.length;
            }
            // if it's a string the length is 1,
            // if it's falsey, length is 0
            return (g && 1) || 0;
          });
          var allEmails = _(destinationEmails).compact().flatten().value();
          var sendingGroups = [];
          while(!_.isEmpty(allEmails)) {
            var curLimit = sesSendingLimit;
            var sendingGroup = _.map(quantities,
              function(quantity, i, quantities) {
                var selection = Math.min(curLimit, quantity);
                quantities[i] = quantity - selection;
                var res = _.first(allEmails, selection);
                allEmails = _.rest(allEmails, selection);
                curLimit -= selection;
                return res;
              }
            );
            // Create sending group, combine emails with email info
            sendingGroups.push(
              _.merge(
                _.zipObject(["to", "cc", "bcc"], sendingGroup),
                emailInfo
              )
            );
          }

          // Batch send all sending groups
          async.each(sendingGroups, function(sendingGroup, next) {
            self.ses.sendemail(sendingGroup, function(err, data, res) {
              if(err) { logger.verbose(err); }
              callback(err && new CommunicationError(err));
            });
          }, function(err) {
            next(err);
          });
        }
      ], callback);
    } else {
      callback(new CommunicationError(null, "Email service unavailable"));
    }
  }

}

export = Module;
