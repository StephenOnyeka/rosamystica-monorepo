// nodemailer-brevo-transport ships no type definitions, so the transport is
// declared here as a structural match for nodemailer's Transport interface
// (which @types/nodemailer expects in createTransport).
declare module 'nodemailer-brevo-transport' {
  import type { Transport, TransportOptions } from 'nodemailer';

  interface BrevoTransportOptions extends TransportOptions {
    apiKey?: string;
  }

  // Shape of the sendMail() result returned by the Brevo transport.
  interface BrevoMessageInfo {
    messageId: string;
    response?: string;
  }

  class BrevoTransport implements Transport<BrevoMessageInfo> {
    constructor(options: BrevoTransportOptions);
    name: string;
    version: string;
    send(
      mail: any,
      callback: (err: Error | null, info: BrevoMessageInfo) => void,
    ): void;
  }

  export default BrevoTransport;
  export type { BrevoMessageInfo };
}
