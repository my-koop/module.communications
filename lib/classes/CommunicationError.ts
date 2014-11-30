import utils = require("mykoop-utils");

class CommunicationError extends utils.errors {
  constructor(
    err: Error,
    msg: string = "Communication Error",
    ...args: any[]
  ) {
    super(err, msg, args);
    this.context = "communication";
  }
}

export = CommunicationError;
