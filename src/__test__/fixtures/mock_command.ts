import { defineCommand } from "../../index";

export default defineCommand({
	name: "mock_command",
	version: "1.0.0",
	label: "Mock command",
	description: "Mock command that would be sent to a Max for Live OSC server.",
	params: [],
	example: {},
	static: true,
	context: [],
	aliases: ["command1", "command2"],
	run: () => ({
		action: "mock_command",
		params: {}
	})
});
