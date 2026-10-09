import { describe, expect, it, vi } from "vitest";
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

    it("preserves scorer membership across repeated characters, empty queries, and normalized text", () => {
        const strings = [""];
        let layer = [""];
        for (let length = 1; length <= 4; length++) {
            layer = layer.flatMap((prefix) => ["a", "b"].map((letter) => prefix + letter));
            strings.push(...layer);
        }
        strings.push(" ÁbA ", "Àéîôü", " ABBA ", "İstanbul", "😀a😀");
        const normalize = (value: string) =>
            value
                .toLocaleLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();
        const candidates = strings.map((label, id) => ({ id, label }));
        for (const query of strings) {
            const expected = candidates.filter(({ label }) => label !== "" && fuzzyMatch(normalize(label), normalize(query)) !== null);
            expect(fzf(candidates, "id", [{ key: "label", value: query }])).toEqual(expected);
        }
    });

    it("does not sort scoring candidates when only membership is needed", () => {
        const sort = vi.spyOn(Array.prototype, "sort");
        let calls: number;
        try {
            fzf([{ id: "1", label: "abacabadabacaba" }], "id", [{ key: "label", value: "aaa" }]);
            calls = sort.mock.calls.length;
        } finally {
            sort.mockRestore();
        }
        expect(calls).toBe(0);
    });

    it("preserves array queries, duplicate IDs, key order, and fallback callbacks", () => {
        const candidates = Object.freeze([
            Object.freeze({ id: "same", label: "Alpha", value: "first" }),
            Object.freeze({ id: "other", label: "Bravo", value: "second" }),
            Object.freeze({ id: "same", label: "Gamma", value: "third" }),
        ]);
        const fallback = vi.fn(() => false);
        const result = fzf([...candidates], "id", [
            { key: "label", value: ["apa", "ba", "gma"] },
            { key: "value", value: "missing", ifNotMatch: fallback },
        ]);
        expect(result).toEqual([candidates[2], candidates[1]]);
        expect(fallback.mock.calls).toEqual([
            ["missing", "first"],
            ["missing", "second"],
            ["missing", "third"],
        ]);
    });

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
