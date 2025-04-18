export interface CommandDefinition {
  name: string;
  version: string;
  description?: string;
  label?: string;
  example?: Record<string, any>;
  params: string[];
  run: (params: Record<string, any>) => any;

  static?: boolean;
  context?: string[];
  aliases?: string[];
}

export interface Command {
  name: string;
  version: string;
  description: string;
  label?: string;
  example?: Record<string, any>;
  paramSchema: { name: string; type: string; required: boolean }[];
  validate: (params: Record<string, any>) => boolean;
  handler: (params: Record<string, any>) => any;
  static: boolean;
  context?: string[];
  aliases?: string[];
}

export type CommandRegistry = Record<string, Command>;
