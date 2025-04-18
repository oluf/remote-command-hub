declare module "osc" {
  export type OSCArgument = {
    type: string;
    value: any;
  };

  export interface OSCMessage {
    address: string;
    args?: OSCArgument[];
  }

  export interface UDPPortOptions {
    remoteAddress: string;
    remotePort: number;
    localAddress?: string;
    localPort?: number;
  }

  export class UDPPort {
    constructor(options: UDPPortOptions);
    open(): void;
    send(message: OSCMessage): void;
    close(): void;

    on(event: "message", callback: (msg: OSCMessage) => void): void;
    on(event: string, callback: (...args: any[]) => void): void; // fallback
  }

  const osc: {
    UDPPort: typeof UDPPort;
  };

  export default osc;
}
