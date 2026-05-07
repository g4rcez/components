import { describe, expect, it } from "vitest";
import { fzf, fuzzyMatch } from "../src/lib/fzf";

describe("fuzzyMatch", () => {
    it("returns 1 for an exact match", () => {
        expect(fuzzyMatch("hello", "hello")).toBe(1);
    });

    it("returns null when no match", () => {
        expect(fuzzyMatch("hello", "xyz")).toBeNull();
    });

    it("returns null when first char is missing", () => {
        expect(fuzzyMatch("world", "z")).toBeNull();
    });

    it("returns a positive score for a fuzzy match", () => {
        const score = fuzzyMatch("hello world", "hwd");
        expect(score).not.toBeNull();
        expect(score).toBeGreaterThan(1);
    });

    it("tighter matches score lower than spread matches", () => {
        const tight = fuzzyMatch("ab", "ab")!;
        const spread = fuzzyMatch("axb", "ab")!;
        expect(tight).toBeLessThan(spread);
    });

    it("is case-insensitive", () => {
        expect(fuzzyMatch("Hello", "hello")).not.toBeNull();
        expect(fuzzyMatch("WORLD", "world")).not.toBeNull();
    });
});

describe("fzf", () => {
    const items = [
        { id: "1", label: "Apple", value: "apple" },
        { id: "2", label: "Banana", value: "banana" },
        { id: "3", label: "Avocado", value: "avocado" },
    ];

    it("returns all items when keys is empty", () => {
        expect(fzf(items, "id", [])).toHaveLength(3);
    });

    it("filters by fuzzy value match", () => {
        const result = fzf(items, "id", [{ key: "value", value: "app" }]);
        expect(result.map((x) => x.id)).toContain("1");
        expect(result.map((x) => x.id)).not.toContain("2");
    });

    it("does not mutate the input array", () => {
        const original = [...items];
        fzf(items, "id", [{ key: "value", value: "app" }]);
        expect(items).toEqual(original);
    });

    it("filters by label match", () => {
        const result = fzf(items, "id", [{ key: "label", value: "Ban" }]);
        expect(result.map((x) => x.id)).toContain("2");
    });

    it("deduplicates when item matches multiple keys", () => {
        const result = fzf(items, "id", [
            { key: "value", value: "avo" },
            { key: "label", value: "Avo" },
        ]);
        expect(result.filter((x) => x.id === "3")).toHaveLength(1);
    });
});

describe("Should fuzzy find values", () => {
    it("Return only the result that match ifNotMatch", () => {
        const result = fzf(
            [
                {
                    id: "01965b0e-3f77-7f44-8718-f93e5b873d51",
                    document: "000.000.000-00",
                },
                {
                    id: "01965b0f-c8f4-7efb-bc0d-3db7d1b7e4ee",
                    document: "29.617.465/0001-78",
                },
            ],
            "id",
            [
                {
                    value: "",
                    key: "document",
                    ifNotMatch: (_, item) => {
                        return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(item);
                    },
                },
            ]
        );
        expect(result.length).toBe(1);
    });
});
