import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
// PostCSS already depends on this source-map consumer.
const { SourceMapConsumer } = createRequire(require.resolve("postcss"))("source-map-js") as {
    SourceMapConsumer: new (map: object) => {
        originalPositionFor(position: { line: number; column: number }): {
            source: string | null;
            line: number | null;
            column: number | null;
        };
        sourceContentFor(source: string): string;
    };
};

function readCssMap(cssFile: string) {
    const css = readFileSync(cssFile, "utf8");
    const footer = /\/\*# sourceMappingURL=([^\s*]+) \*\/\s*$/u.exec(css);
    expect(footer, `Missing map URL in ${cssFile}`).not.toBeNull();
    const mapFile = resolve(dirname(cssFile), footer![1]!);
    const map = JSON.parse(readFileSync(mapFile, "utf8")) as { file: string };
    expect(resolve(dirname(mapFile), map.file)).toBe(cssFile);
    return { css, mapFile, consumer: new SourceMapConsumer(map) };
}

function positionAt(text: string, token: string) {
    const offset = text.indexOf(token);
    expect(offset, `Missing ${token}`).toBeGreaterThanOrEqual(0);
    const preceding = text.slice(0, offset).split("\n");
    return { line: preceding.length, column: preceding[preceding.length - 1]!.length };
}

describe("published CSS source maps (build the library first)", () => {
    it.each([
        ["button", ".__button:focus-visible", "src/components/core/button/button.css"],
        ["foundation", "html{", "src/styles/base.css"],
        ["index", ".__button:focus-visible", "src/components/core/button/button.css"],
        ["index", "html{", "src/styles/base.css"],
        ["tokens", ":root", "src/styles/tokens.css"],
    ])("maps %s %s to its original source position", (entry, selector, sourcePath) => {
        const { css, mapFile, consumer } = readCssMap(resolve(root, `dist/css/${entry}.css`));
        const original = consumer.originalPositionFor(positionAt(css, selector));
        const sourceFile = resolve(root, sourcePath);
        const source = readFileSync(sourceFile, "utf8");
        const sourceSelector = selector === "html{" ? "html {" : selector;
        expect(original.source).not.toBeNull();
        expect(resolve(dirname(mapFile), original.source!)).toBe(sourceFile);
        expect(original.line).toBe(positionAt(source, sourceSelector).line);
        expect(consumer.sourceContentFor(original.source!)).toBe(source);
    });

    it("publishes CSS and a usable map URL for every CSS export", () => {
        const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as {
            exports: Record<string, string | { default?: string }>;
        };
        const files = new Set<string>();
        for (const [specifier, target] of Object.entries(packageJson.exports)) {
            if (specifier.endsWith(".css") && typeof target !== "string" && target.default) {
                files.add(resolve(root, target.default));
            }
        }
        for (const file of files) readCssMap(file);
    });
});
