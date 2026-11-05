import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss, { type AnyNode, type Rule } from "postcss";
import { describe, expect, it } from "vitest";

const sourceRoot = resolve(__dirname, "../src");
const hoverQuery = "(hover: hover) and (pointer: fine)";

// Hover rules that stay ungated on purpose.
// - The row aside is revealed by JS pointer events and is positioned outside the cell.
// - Checked controls only repeat their checked colors, so a stuck hover is not visible.
const allowedSelectors = new Set([
    ".__table-inner-table__row:hover .__table-row__aside",
    ".__checkbox__control-state:checked:hover, .__checkbox__control-state:checked:focus, .__checkbox__control-state:indeterminate:hover, .__checkbox__control-state:indeterminate:focus",
    ".__radiobox__control-state:checked:hover, .__radiobox__control-state:checked:focus",
]);

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

const isGated = (rule: Rule) => {
    let node: AnyNode | undefined = rule.parent as AnyNode | undefined;
    while (node && node.type !== "root") {
        if (node.type === "atrule" && node.name === "media" && normalize(node.params) === hoverQuery) return true;
        node = node.parent as AnyNode | undefined;
    }
    return false;
};

const ungatedHoverSelectors = () => {
    const files = readdirSync(sourceRoot, { recursive: true, encoding: "utf8" }).filter((path) => path.endsWith(".css"));
    const found: string[] = [];
    for (const file of files) {
        postcss.parse(readFileSync(resolve(sourceRoot, file), "utf8")).walkRules((rule) => {
            const selector = normalize(rule.selector);
            if (!selector.includes(":hover") || isGated(rule) || allowedSelectors.has(selector)) return;
            found.push(`${file}: ${selector}`);
        });
    }
    return found;
};

describe("hover gating", () => {
    it("keeps every :hover rule behind (hover: hover) and (pointer: fine)", () => {
        expect(ungatedHoverSelectors()).toEqual([]);
    });
});
