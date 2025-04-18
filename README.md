# remote-command-hub

`remote-command-hub` is a modular, transport-agnostic TypeScript framework for defining, validating, and executing commands. It is designed for use in applications where commands need to be dynamically loaded, schema-validated, and routed through pluggable transports such as OSC or HTTP.

In addition to dispatching actions, the system supports roundtrip feedback by reassembling structured responses from OSC messages. This enables LLMs and other interfaces to monitor the current state of the creative environment and reason about next steps, supporting an interactive loop of intent, execution, and response. The package provides the schema, registry, and transport logic that bridges AI-interpreted intent with executable actions and structured feedback at the creative application layer.

>remote-command-hub is a core infrastructure component of DroneFlow, an experimental system currently in alpha that explores the use of AI to assist users in controlling creative tools using alternate modalities through structured command execution. Inputs from voice interfaces, automation systems, CLIs, or web applications are routed to an LLM (local or cloud-based), which interprets the user's intent and generates structured commands. These commands are then validated and dispatched by remote-command-hub using OSC (Open Sound Control) over UDP, enabling real-time interaction with creative environments such as Ableton Live, Max/MSP, and Max for Live.


## Features

- Define commands with full metadata (name, version, params, aliases, context)
- Dynamically load command modules from a directory
- Built-in parameter validation based on command schema
- Pluggable transport interface (OSC over UDP included, HTTP stubbed)
- Fully typed with TypeScript, generates declaration files
- Designed for LLM pipelines, DAW control, plugin environments, and CLI tools
- Includes command registry inspection and metadata listing

---

## Installation

```bash
npm install remote-command-hub
```

---

## Usage

### 1. Define a Command

```ts
// commands/get_tracks.ts
import { defineCommand } from "remote-command-hub";

export default defineCommand({
  name: "get_tracks",
  version: "1.0.0",
  description: "Returns all tracks in the session",
  params: [],
  static: true,
  run: () => ({ action: "get_tracks" })
});
```

---

### 2. Load Commands at Runtime

```ts
import { createCommandRegistry } from "remote-command-hub";

const registry = await createCommandRegistry("./commands");
```

---

### 3. Use a Transport

```ts
import { OSCTransport } from "remote-command-hub";

const osc = new OSCTransport(registry, 7400, 7401);
osc.start();

const result = await osc.sendCommand("get_tracks", {});
```

---

### 4. List Commands (Optional)

```ts
import { listRegisteredCommands, listCommandMetadata } from "remote-command-hub";

console.log(listRegisteredCommands(registry));

console.table(listCommandMetadata(registry));
```

---

## API

### `defineCommand(definition: CommandDefinition): Command`
Registers a command with validation, schema, and handler logic.

### `createCommandRegistry(path: string): Promise<CommandRegistry>`
Loads all valid command modules from a directory and returns a full registry.

### `listRegisteredCommands(registry: CommandRegistry): string[]`
Returns an array of command names.

### `listCommandMetadata(registry: CommandRegistry): Array<CommandMetadata>`
Returns metadata for each registered command including name, version, description, params, and more.

### `OSCTransport`
Implements an OSC transport layer (UDP in/out) for executing commands.

### `HttpTransport`
Stub for future expansion; demonstrates the pluggable transport interface.

---

## Types

This framework exports the following key types:

- `CommandDefinition`
- `Command`
- `CommandRegistry`
- `CommandMetadata`
- `ICommandTransport`

Example import:

```ts
import type { CommandDefinition, ICommandTransport } from "remote-command-hub";
```

---

## Project Structure

```
remote-command-hub/
├── src/
│   ├── schema.ts                # Core type definitions
│   ├── command.ts               # defineCommand helper
│   ├── loader.ts                # Registry loader and command listing
│   └── transport/
│       ├── transport.ts         # ICommandTransport interface
│       ├── osc.ts               # OSCTransport implementation
│       ├── http.ts              # HTTP stub
│       └── oscChunkAssembler.ts # Reassembles chunked OSC messages
├── types/
│   └── osc.d.ts                 # Custom type declarations for 'osc' module
```

---

## License

MIT

---

## Author

Maintained by Oluf Andrews. Originally developed as part of the DroneFlow project.