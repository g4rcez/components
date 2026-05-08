import { describe, expect, it } from "vitest";
import { createPaginationItems } from "../src/components/table/pagination";
import { multiSort } from "../src/components/table/sort";

type Row = { name: string; age: number; score: number };

describe("multiSort", () => {
    it("sorts ascending by a string field", () => {
        const rows: Row[] = [
            { name: "Charlie", age: 30, score: 80 },
            { name: "Alice", age: 25, score: 90 },
            { name: "Bob", age: 28, score: 85 },
        ];
        const result = multiSort([...rows], [{ id: "s1", value: "name", type: "asc", label: "Name" }]);
        expect(result.map((r) => r.name)).toEqual(["Alice", "Bob", "Charlie"]);
    });

    it("sorts descending by a number field", () => {
        const rows: Row[] = [
            { name: "Alice", age: 25, score: 90 },
            { name: "Bob", age: 28, score: 85 },
            { name: "Charlie", age: 30, score: 80 },
        ];
        const result = multiSort([...rows], [{ id: "s1", value: "age", type: "desc", label: "Age" }]);
        expect(result.map((r) => r.age)).toEqual([30, 28, 25]);
    });

    it("applies multi-field sort with tiebreaker", () => {
        const rows: Row[] = [
            { name: "Alice", age: 28, score: 90 },
            { name: "Bob", age: 28, score: 85 },
            { name: "Charlie", age: 25, score: 95 },
        ];
        const result = multiSort(
            [...rows],
            [
                { id: "s1", value: "age", type: "asc", label: "Age" },
                { id: "s2", value: "score", type: "desc", label: "Score" },
            ]
        );
        expect(result.map((r) => r.name)).toEqual(["Charlie", "Alice", "Bob"]);
    });

    it("returns array unchanged when sorters list is empty", () => {
        const rows: Row[] = [
            { name: "Charlie", age: 30, score: 80 },
            { name: "Alice", age: 25, score: 90 },
        ];
        const copy = [...rows];
        multiSort(copy, []);
        expect(copy).toEqual(rows);
    });
});

describe("createPaginationItems", () => {
    it("returns empty array for falsy inputs", () => {
        expect(createPaginationItems(0, 10)).toEqual([]);
        expect(createPaginationItems(1, 0)).toEqual([]);
    });

    it("returns [1] for single page", () => {
        expect(createPaginationItems(1, 1)).toEqual([1]);
    });

    it("includes all pages when total is small", () => {
        const items = createPaginationItems(1, 5);
        const numbers = items.filter((x): x is number => typeof x === "number");
        expect(numbers).toContain(1);
        expect(numbers).toContain(5);
    });

    it("inserts ellipsis separators for large page ranges", () => {
        const items = createPaginationItems(1, 20);
        const hasEllipsis = items.some((x) => typeof x === "string");
        expect(hasEllipsis).toBe(true);
    });

    it("always includes page 1 and last page", () => {
        const items = createPaginationItems(10, 20);
        const numbers = items.filter((x): x is number => typeof x === "number");
        expect(numbers).toContain(1);
        expect(numbers).toContain(20);
    });

    it("centers the window around current page", () => {
        const items = createPaginationItems(10, 20);
        const numbers = items.filter((x): x is number => typeof x === "number");
        expect(numbers).toContain(10);
        expect(numbers).toContain(9);
        expect(numbers).toContain(11);
    });
});
