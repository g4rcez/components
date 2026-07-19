/// <reference types="node" />

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const cli = resolve(__dirname, "../bin/csscomponents.mjs");
const manifest = resolve(__dirname, "../ai/component-style-manifest.json");

const createProject = () => {
    const root = mkdtempSync(resolve(tmpdir(), "g4-styles-cli-"));
    mkdirSync(resolve(root, "src"), { recursive: true });
    writeFileSync(
        resolve(root, "src/app.tsx"),
        `import { Button } from "@g4rcez/components";

export const App = () => <Button>Save</Button>;
`
    );
    writeFileSync(resolve(root, "src/app.css"), `@import "@g4rcez/components/index.css";\nbody { margin: 0; }\n`);
    return root;
};

describe("csscomponents CLI", () => {
    it("exports the styles runner without executing the CLI", async () => {
        const module = await import(pathToFileURL(cli).href);

        expect(module).toMatchObject({
            detectUsedComponents: expect.any(Function),
            runStyles: expect.any(Function),
            updateStylesheet: expect.any(Function),
        });
    });

    it("auto-detects the stylesheet and writes package CSS imports", () => {
        const root = createProject();

        execFileSync(process.execPath, [cli, "--manifest", manifest], {
            cwd: root,
        });

        const css = readFileSync(resolve(root, "src/app.css"), "utf8");
        expect(css).not.toContain("@g4rcez/components auto-imports");
        expect(css).toContain('@import "@g4rcez/components/foundation.css";');
        expect(css).toContain('@import "@g4rcez/components/button.css";');
        expect(css).not.toContain('@import "@g4rcez/components/index.css";');
    });

    it("can write local source CSS imports for workspace docs", () => {
        const root = createProject();
        const libraryRoot = resolve(root, "../lib");
        mkdirSync(resolve(libraryRoot, "src/styles"), { recursive: true });
        mkdirSync(resolve(libraryRoot, "src/components/core"), { recursive: true });
        writeFileSync(resolve(libraryRoot, "src/styles/foundation.css"), "");
        writeFileSync(resolve(libraryRoot, "src/styles/index.css"), "");
        writeFileSync(resolve(libraryRoot, "src/components/core/button.css"), "");

        execFileSync(process.execPath, [
            cli,
            "styles",
            "--root",
            root,
            "--content",
            "src",
            "--css",
            "src/app.css",
            "--manifest",
            manifest,
            "--library-root",
            libraryRoot,
        ]);

        const css = readFileSync(resolve(root, "src/app.css"), "utf8");
        expect(css).toContain('@import "../../lib/src/styles/foundation.css";');
        expect(css).toContain('@import "../../lib/src/components/core/button.css";');
    });
});
