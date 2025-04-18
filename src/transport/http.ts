import type { ICommandTransport } from "./transport";

export class HttpTransport implements ICommandTransport {
  constructor() {
    // Setup for HTTP transport could be initialized here
  }

  async sendCommand(commandName: string, params: Record<string, any>): Promise<any> {
    console.warn("HttpTransport.sendCommand is not implemented.");
    return { error: "Not implemented" };
  }
}
