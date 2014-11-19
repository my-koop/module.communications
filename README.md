module.communications
=========================

Responsible for communications with different services


usage:
```ts
sendEmail(params: 
  {
    from: string; // email address from which to send
    subject: string;
    message: string; // can be html
    altText?: string; // plain text version of message
    to: string | string[]; // email address or array of addresses
    cc?: string | string[]; // email address or array of addresses
    bcc?: string | string[]; // email address or array of addresses
    replyTo?: string; // email address
  }, 
  callback: (err?: MyKoopError) => void
);
```
