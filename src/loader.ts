import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import type { CommandRegistry } from "./schema";

export async function createCommandRegistry(commandsPath: string): Promise<CommandRegistry> {
  const absolutePath = path.resolve(commandsPath);
  const files = fs.readdirSync(absolutePath).filter(f => f.endsWith(".ts") || f.endsWith(".js"));
  const registry: CommandRegistry = {};

  for (const file of files) {
    const filePath = path.join(absolutePath, file);
    const mod = await import(pathToFileURL(filePath).href);
    const command = mod.default;

    if (command && typeof command.name === "string") {
      registry[command.name] = command;
    } else {
      console.warn("Skipped file (invalid command):", file);
    }
  }

  return registry;
}

export function listRegisteredCommands(registry: CommandRegistry): string[] {
  return Object.keys(registry);
}

export function listCommandMetadata(registry: CommandRegistry) {
  return Object.values(registry).map(cmd => ({
    name: cmd.name,
    version: cmd.version,
    description: cmd.description,
    static: cmd.static,
    aliases: cmd.aliases ?? [],
    context: cmd.context ?? [],
    params: cmd.paramSchema
  }));
}
