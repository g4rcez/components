import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, test } from "vitest";

const PACKAGE_DIR = resolve(import.meta.dirname, "..");
const ROOT_DIR = resolve(PACKAGE_DIR, "../..");

type PublishFile = { path: string };
type PublishResult = { files?: PublishFile[]; id?: string };

function run(command: string, args: string[], cwd: string) {
    const result = spawnSync(command, args, {
        cwd,
        encoding: "utf8",
        shell: process.platform === "win32",
        timeout: 120_000,
    });
    if (result.error) throw result.error;
    return result;
}

function parseJson<T>(text: string, source: string): T {
    try {
        return JSON.parse(text) as T;
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`Could not parse ${source}: ${reason}`);
    }
}

function publishResult(stdout: string): PublishResult {
    const value = parseJson<PublishResult | PublishResult[]>(stdout, "npm publish output");
    return Array.isArray(value) ? value[0] : value;
}

describe("published lint bundle", () => {
    test("includes the bundled Oxlint plugin in the components publish dry-run", () => {
        const build = run("pnpm", ["--filter", "@g4rcez/components", "run", "lib:lint"], ROOT_DIR);
        expect(build.status, build.stderr).toBe(0);

        const publish = run("npm", ["publish", "--dry-run", "--ignore-scripts", "--json"], PACKAGE_DIR);
        expect(publish.status, publish.stderr).toBe(0);

        const result = publishResult(publish.stdout);
        const files = new Set((result.files ?? []).map((file) => file.path));
        const packageJson = parseJson<{
            scripts: { build: string; "lib:lint": string };
            exports: { "./lint": { import: string; types: string } };
        }>(readFileSync(join(PACKAGE_DIR, "package.json"), "utf8"), "packages/lib/package.json");
        const lintExport = packageJson.exports["./lint"];

        expect(packageJson.scripts.build).toContain("npm run lib:lint");
        expect(packageJson.scripts["lib:lint"]).toContain("copy-lint.mjs");
        expect(result.id).toMatch(/^@g4rcez\/components@/);
        expect(files).toContain(lintExport.import.slice(2));
        expect(files).toContain(lintExport.types.slice(2));
        expect(files).toContain("dist/lint/similar.mjs");
        expect(files).toContain("dist/lint/tailwind-worker.mjs");
    });
});
