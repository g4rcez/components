// Run with: node --test scripts/
import assert from "node:assert/strict";
import { test } from "node:test";
import { Lexer } from "marked";

// The generator's parsing relies on how marked tokenizes the awkward shapes in packages/lib/ai/docs; these pin that behaviour.
const table = (source) => Lexer.lex(source).find((token) => token.type === "table");

test("a pipe escaped inside a code span in a table cell stays one cell", () => {
    const token = table('| Prop | Type |\n|---|---|\n| `theme` | `"a" \\| "b"` |');
    assert.equal(token.rows[0].length, 2);
    assert.equal(token.rows[0][1].tokens[0].type, "codespan");
    assert.equal(token.rows[0][1].tokens[0].text, '"a" | "b"');
});

test("compact tables without padding spaces parse the same as spaced ones", () => {
    const compact = table("|Prop|Type|\n|---|---|\n|a|b|");
    const spaced = table("| Prop | Type |\n| --- | --- |\n| a | b |");
    assert.deepEqual(
        compact.header.map((cell) => cell.text),
        spaced.header.map((cell) => cell.text)
    );
    assert.equal(compact.rows[0][0].text, spaced.rows[0][0].text);
});

test("an H2 inside a code fence is not a section heading", () => {
    const tokens = Lexer.lex("## Real\n\n```md\n## Fake\n```\n\n## Next");
    assert.deepEqual(
        tokens.filter((token) => token.type === "heading").map((token) => token.text),
        ["Real", "Next"]
    );
});

test("placeholders in angle brackets arrive as inline html, which the generator keeps as text", () => {
    const token = table("| Token |\n|---|\n| `--var-tag-soft-<theme>-background` and <b>x</b> |");
    const kinds = token.rows[0][0].tokens.map((node) => node.type);
    assert.ok(kinds.includes("codespan"));
    assert.ok(kinds.includes("html"));
});

test("several tables under sub-headings stay separate blocks in order", () => {
    const tokens = Lexer.lex("## Props\n\n### One\n\n| A |\n|---|\n| 1 |\n\ntext between\n\n### Two\n\n| B |\n|---|\n| 2 |");
    assert.deepEqual(
        tokens.filter((token) => ["heading", "table", "paragraph"].includes(token.type)).map((token) => token.type),
        ["heading", "heading", "table", "paragraph", "heading", "table"]
    );
});
