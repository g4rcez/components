import { describe, expect, it } from "vitest";
import { CombiKeys } from "../src/lib/combi-keys";

describe("CombiKeys.add", () => {
    it("returns the instance when the key is new", () => {
        const keys = new CombiKeys([]);
        expect(keys.add("a", () => {})).toBe(keys);
    });

    it("returns the instance when the key already exists", () => {
        const keys = new CombiKeys([]);
        keys.add("a", () => {});
        expect(keys.add("a", () => {})).toBe(keys);
    });

    it("ignores a duplicate key", () => {
        const keys = new CombiKeys([]);
        keys.add("a", () => {}).add("a", () => {}).add("b", () => {});
        expect(keys.combinations.map((x) => x.key)).toEqual(["a", "b"]);
    });
});
