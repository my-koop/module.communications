// Type definitions for module v0.0.0
// Project: https://github.com/my-koop/service.website
// Definitions by: Michael Ferris <https://github.com/Cellule/>
// Definitions: https://github.com/my-koop/type.definitions

/// <reference path="../mykoop/mykoop.d.ts" />
declare module mkcommunications {

  interface SendEmailParams {
    from?: string; // email address from which to send
    subject: string;
    message: string; // can be html
    altText?: string; // plain text version of message
    // the type should be string | string[], but is not yet supported by typescript
    to?: any; // email address or array of addresses
    cc?: any; // email address or array of addresses
    bcc?: any; // email address or array of addresses
    replyTo?: string; // email address
  }

  export interface Module extends mykoop.IModule {
    sendEmail(params: SendEmailParams, callback: (err) => void);
  }

}

