import { describe, expect, it } from "vitest";
import { synthesizeChangeEvent } from "../src/lib/dom";

describe("synthesizeChangeEvent", () => {
    it("sets target and currentTarget to the given input", () => {
        const input = document.createElement("input");
        input.name = "test-field";
        input.value = "hello";
        const event = synthesizeChangeEvent(input);
        expect(event.target).toBe(input);
        expect(event.currentTarget).toBe(input);
    });

    it("reflects target.value from the input element", () => {
        const input = document.createElement("input");
        input.value = "selected-value";
        const event = synthesizeChangeEvent(input);
        expect(event.target.value).toBe("selected-value");
    });

    it("reflects target.name from the input element", () => {
        const input = document.createElement("input");
        input.name = "my-field";
        const event = synthesizeChangeEvent(input);
        expect(event.target.name).toBe("my-field");
    });
});
