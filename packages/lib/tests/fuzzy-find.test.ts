import { describe, expect, it } from "vitest";
import { fzf } from "../src/lib/fzf";

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
                    ifNotMatch: (item) => {
                        return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(item);
                    },
                },
            ]
        );
        expect(result.length).toBe(1);
    });
});
