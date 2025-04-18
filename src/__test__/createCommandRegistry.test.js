// test/createCommandRegistry.test.ts
import { createCommandRegistry } from "../index.js";
import path from "path";
describe("createCommandRegistry", () => {
    it("loads commands from directory", async () => {
        const dir = path.resolve(__dirname, "fixtures");
        const registry = await createCommandRegistry(dir);
        expect(registry).toHaveProperty("mock_command");
        expect(typeof registry["mock_command"].handler).toBe("function");
    });
});
