import { describe, expect, it } from "vitest";
import { path } from "../src";

describe("should test fns.ts module", () => {
    it("should test path function", () => {
        const result = path({ a: 1 }, "a");
        expect(result).toBe(1);
    });
});
