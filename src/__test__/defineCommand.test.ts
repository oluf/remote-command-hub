// test/defineCommand.test.ts
import { defineCommand } from "../index";

describe("defineCommand", () => {
	it("validates parameters correctly", () => {
		const cmd = defineCommand({
			name: "test_cmd",
			version: "1.0",
			params: ["amount:number"],
			run: () => ({}),
		});

		expect(cmd.validate({ amount: 5 })).toBe(true);
		expect(cmd.validate({ amount: "oops" })).toBe(false);
	});
});
