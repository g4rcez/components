import { describe, expect, it } from "vitest";
import { Dict } from "../src/lib/dict";

describe("Dict", () => {
    it("preserves insertion order via map", () => {
        const d = new Dict<string, number>();
        d.set("a", 1);
        d.set("b", 2);
        d.set("c", 3);
        expect(d.map((v) => v)).toEqual([1, 2, 3]);
    });

    it("set does not duplicate keys", () => {
        const d = new Dict<string, number>();
        d.set("a", 1);
        d.set("a", 99);
        expect(d.size).toBe(1);
        expect(d.get("a")).toBe(99);
        expect(d.map((v) => v)).toEqual([99]);
    });

    it("remove deletes key and preserves remaining order", () => {
        const d = new Dict<string, number>();
        d.set("a", 1);
        d.set("b", 2);
        d.set("c", 3);
        d.remove("b");
        expect(d.size).toBe(2);
        expect(d.has("b")).toBe(false);
        expect(d.map((v) => v)).toEqual([1, 3]);
    });

    it("clone creates an independent copy", () => {
        const d = new Dict<string, number>();
        d.set("x", 10);
        const c = d.clone();
        c.set("y", 20);
        expect(d.size).toBe(1);
        expect(c.size).toBe(2);
    });

    it("from builds a dict keyed by selector", () => {
        const d = Dict.from(
            [
                { id: "a", v: 1 },
                { id: "b", v: 2 },
            ],
            (x) => x.id
        );
        expect(d.get("a")).toEqual({ id: "a", v: 1 });
        expect(d.get("b")).toEqual({ id: "b", v: 2 });
    });

    it("map passes correct index", () => {
        const d = new Dict<string, string>();
        d.set("x", "foo");
        d.set("y", "bar");
        const indices: number[] = [];
        d.map((_, i) => indices.push(i));
        expect(indices).toEqual([0, 1]);
    });
});
