import type { CommandDefinition, Command } from "./schema";

export function defineCommand(def: CommandDefinition): Command {
  const parsedParams = def.params.map((p) => {
    const [name, type] = p.split(":");
    return { name, type, required: true };
  });

  return {
    name: def.name,
    version: def.version,
    validate: (params) => {
      return def.params.every((p) => {
        const [key, type] = p.split(":");
        return typeof params[key] === type;
      });
    },
    handler: (params) => def.run(params),
    paramSchema: parsedParams,
    description: def.description ?? "",
    static: def.static ?? false,
    context: def.context ?? [],
    aliases: def.aliases ?? [],
    label: def.label,
    example: def.example
  };
}
