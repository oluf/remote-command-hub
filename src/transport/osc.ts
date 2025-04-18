// src/transport/osc.ts

import osc from "osc";
import { v4 as uuidv4 } from "uuid";
import type { CommandRegistry } from "../schema";
import type { ICommandTransport } from "./transport";
import type { UDPPort } from "osc";
import { handleOSCChunk } from "./oscChunkAssembler";

const pendingResponses: Record<string, (data: any) => void> = {};

export class OSCTransport implements ICommandTransport {
  private udpPort: UDPPort;

  constructor(
    private registry: CommandRegistry,
    private remotePort: number,
    private localPort: number,
    private remoteAddress: string = "127.0.0.1",
    private localAddress: string = "0.0.0.0"
  ) {
    this.udpPort = new osc.UDPPort({
      remoteAddress: this.remoteAddress,
      remotePort: this.remotePort,
      localAddress: this.localAddress,
      localPort: this.localPort,
    });
  }

  start() {
    this.udpPort.on("message", (oscMsg: any) => {
      const [index, total, requestId, chunk] = oscMsg.args;
      const address = oscMsg.address;

      const full = handleOSCChunk(requestId, index, total, chunk);
      if (full) {
        try {
          const parsed = JSON.parse(full);
          if (pendingResponses[requestId]) {
            pendingResponses[requestId](parsed);
            delete pendingResponses[requestId];
          }
        } catch (e) {
          console.error("JSON parse failed for", address, e);
        }
      }
    });

    this.udpPort.open();
  }

  async sendCommand(
    name: string,
    params: Record<string, any>,
    options?: { timeout?: number }
  ): Promise<any> {
    const timeout = options?.timeout ?? 5000;
    const command = this.registry[name];
    if (!command) throw new Error(`Unknown command: ${name}`);
    if (!command.validate(params)) throw new Error(`Invalid params for ${name}`);

    const requestId = uuidv4();
    const fullParams = { ...params, requestId };

    return new Promise((resolve, reject) => {
      pendingResponses[requestId] = resolve;

      this.udpPort.send({
        address: `/${command.name}`,
        args: Object.entries(fullParams).map(([_, value]) => ({
          type: typeof value === "number" ? "f" : "s",
          value,
        })),
      });

      setTimeout(() => {
        if (pendingResponses[requestId]) {
          delete pendingResponses[requestId];
          reject(new Error(`Timeout waiting for ${name} (${requestId})`));
        }
      }, timeout);
    });
  }

  stop() {
    this.udpPort.close();
  }
}
