export interface ICommandTransport {
  sendCommand(
    commandName: string,
    params: Record<string, any>,
    options?: { timeout?: number }
  ): Promise<any>;
}
