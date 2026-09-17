/// <reference types="node" />

import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";

const sourceScript = resolve(__dirname, "../../../scripts/skills.mjs");
const roots: string[] = [];
const references = new Map([
    ["index.md", "# Fixture catalog\n"],
    ["Button.md", "# Button\n\nFixture reference.\n"],
    ["nested/Style.md", "# Nested style\n"],
    ["style-dependencies.md", "# Style dependencies\n"],
]);
const skill = `---
name: csscomponents
description: Fixture skill.
---

# Fixture skill

Use the canonical skill.\n`;

const destinationDocs = (root: string) => [
    resolve(root, ".claude/skills/components-design-system/docs"),
    resolve(root, ".agents/skills/csscomponents/docs"),
    resolve(root, ".agents/skills/components-design-system/docs"),
];

const managedPaths = (root: string) => [
    resolve(root, "packages/lib/SKILL.md"),
    resolve(root, "packages/lib/ai/SKILL.md"),
    resolve(root, ".claude/skills/components-design-system/SKILL.md"),
    resolve(root, ".agents/skills/csscomponents/SKILL.md"),
    resolve(root, ".agents/skills/components-design-system/SKILL.md"),
    ...destinationDocs(root),
];

const sourceCases: Array<[string, (root: string) => void, string]> = [
    ["missing source", (root) => rmSync(resolve(root, "skills/csscomponents/SKILL.md")), "canonical skill not found"],
    [
        "empty references",
        (root) => {
            for (const path of references.keys()) rmSync(resolve(root, "packages/lib/ai/docs", path));
        },
        "contains no Markdown references",
    ],
    ["invalid frontmatter", (root) => writeFileSync(resolve(root, "skills/csscomponents/SKILL.md"), "not frontmatter\n"), "frontmatter"],
];

function createFixture() {
    const root = mkdtempSync(join(tmpdir(), "g4-skills-sync-"));
    roots.push(root);
    mkdirSync(resolve(root, "scripts"), { recursive: true });
    copyFileSync(sourceScript, resolve(root, "scripts/skills.mjs"));
    mkdirSync(resolve(root, "skills/csscomponents"), { recursive: true });
    writeFileSync(resolve(root, "skills/csscomponents/SKILL.md"), skill);
    mkdirSync(resolve(root, "packages/lib/ai/docs"), { recursive: true });
    for (const [path, content] of references) {
        const target = resolve(root, "packages/lib/ai/docs", path);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, content);
    }
    writeFileSync(resolve(root, "packages/lib/ai/docs/notes.txt"), "leave this source file alone\n");
    mkdirSync(resolve(root, "work"));
    return root;
}

function run(root: string, operation?: string, cwd = root) {
    const args = [resolve(root, "scripts/skills.mjs")];
    if (operation) args.push(operation);
    return spawnSync(process.execPath, args, { cwd, encoding: "utf8" });
}

function sync(root: string) {
    const result = run(root, "sync", resolve(root, "work"));
    expect(result.status).toBe(0);
    return result;
}

function snapshotEntry(root: string, path: string): unknown {
    const relativePath = relative(root, path).replaceAll("\\", "/");
    if (!existsSync(path)) return { relativePath, missing: true };
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) return { relativePath, symlink: true, mtimeMs: stat.mtimeMs.toString() };
    if (stat.isDirectory()) {
        return {
            relativePath,
            directory: readdirSync(path)
                .toSorted((left, right) => left.localeCompare(right))
                .map((name) => snapshotEntry(root, resolve(path, name))),
            mtimeMs: stat.mtimeMs.toString(),
        };
    }
    return { relativePath, content: readFileSync(path).toString("base64"), mtimeMs: stat.mtimeMs.toString() };
}

function snapshotManaged(root: string) {
    return JSON.stringify(managedPaths(root).map((path) => snapshotEntry(root, path)));
}

afterEach(() => {
    for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("skills sync CLI", () => {
    it("creates package skill copies and all three local reference mirrors", () => {
        const root = createFixture();
        const result = sync(root);

        expect(result.stdout).toContain("sync complete");
        expect(existsSync(resolve(root, "dist"))).toBe(false);
        for (const path of managedPaths(root)) expect(existsSync(path)).toBe(true);
        expect(readFileSync(resolve(root, "packages/lib/SKILL.md"), "utf8")).toBe(skill);
        expect(readFileSync(resolve(root, ".agents/skills/components-design-system/SKILL.md"), "utf8")).toBe(
            skill.replace("name: csscomponents", "name: g4rcez-components")
        );
        for (const docs of destinationDocs(root)) {
            for (const [path, content] of references) {
                expect(readFileSync(resolve(docs, path), "utf8")).toBe(content);
            }
        }
    });

    it("runs without dist output and resolves the fixture root from another cwd", () => {
        const root = createFixture();
        const result = run(root, "sync", resolve(root, "work"));

        expect(result.status).toBe(0);
        expect(existsSync(resolve(root, "dist"))).toBe(false);
        expect(readFileSync(resolve(root, "packages/lib/SKILL.md"), "utf8")).toBe(skill);
    });

    it("replaces stale content and restores missing references", () => {
        const root = createFixture();
        sync(root);
        writeFileSync(resolve(root, ".agents/skills/csscomponents/docs/nested/Style.md"), "stale\n");
        rmSync(resolve(root, ".claude/skills/components-design-system/docs/Button.md"));

        const before = run(root, "check");
        expect(before.status).toBe(1);
        expect(before.stderr).toContain(".agents/skills/csscomponents/docs/nested/Style.md: different");
        expect(before.stderr).toContain(".claude/skills/components-design-system/docs/Button.md: missing");

        expect(run(root, "sync").status).toBe(0);
        expect(run(root, "check").status).toBe(0);
    });

    it("is idempotent and does not rewrite identical files", () => {
        const root = createFixture();
        sync(root);
        const before = snapshotManaged(root);

        const result = run(root, "sync", resolve(root, "work"));

        expect(result.status).toBe(0);
        expect(result.stdout).toContain("0 file(s) written");
        expect(snapshotManaged(root)).toBe(before);
        expect(run(root, "check").status).toBe(0);
    });

    it("reports sorted missing, different, and extra files without writing", () => {
        const root = createFixture();
        sync(root);
        writeFileSync(resolve(root, ".agents/skills/csscomponents/docs/index.md"), "different\n");
        rmSync(resolve(root, ".claude/skills/components-design-system/docs/nested/Style.md"));
        writeFileSync(resolve(root, ".agents/skills/components-design-system/docs/extra.md"), "keep\n");
        writeFileSync(resolve(root, ".agents/skills/components-design-system/docs/keep.txt"), "unrelated\n");
        const before = snapshotManaged(root);

        const result = run(root, "check");

        expect(result.status).toBe(1);
        expect(result.stderr.split("\n").slice(1, -1)).toEqual([
            ".agents/skills/components-design-system/docs/extra.md: extra",
            ".agents/skills/csscomponents/docs/index.md: different",
            ".claude/skills/components-design-system/docs/nested/Style.md: missing",
        ]);
        expect(snapshotManaged(root)).toBe(before);
        expect(readFileSync(resolve(root, ".agents/skills/components-design-system/docs/extra.md"), "utf8")).toBe("keep\n");
        expect(readFileSync(resolve(root, ".agents/skills/components-design-system/docs/keep.txt"), "utf8")).toBe("unrelated\n");

        const syncResult = run(root, "sync");
        expect(syncResult.status).toBe(1);
        expect(snapshotManaged(root)).toBe(before);
    });

    it.each(sourceCases)("rejects %s before writing destinations", (_name, mutate, errorText) => {
        const root = createFixture();
        sync(root);
        const before = snapshotManaged(root);
        mutate(root);
        const result = run(root, "sync");

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(errorText);
        expect(snapshotManaged(root)).toBe(before);
    });

    it("rejects source symlinks before writing and preserves the external sentinel", () => {
        const root = createFixture();
        sync(root);
        const externalRoot = mkdtempSync(join(tmpdir(), "g4-skills-external-"));
        roots.push(externalRoot);
        const sentinel = resolve(externalRoot, "sentinel.txt");
        writeFileSync(sentinel, "do not change\n");
        rmSync(resolve(root, "skills/csscomponents/SKILL.md"));
        symlinkSync(sentinel, resolve(root, "skills/csscomponents/SKILL.md"));
        const before = snapshotManaged(root);

        const result = run(root, "sync");

        expect(result.status).toBe(1);
        expect(result.stderr).toContain("canonical skill contains symlink");
        expect(readFileSync(sentinel, "utf8")).toBe("do not change\n");
        expect(snapshotManaged(root)).toBe(before);
    });

    it("rejects destination symlinks before writing and preserves the external sentinel", () => {
        const root = createFixture();
        sync(root);
        const externalRoot = mkdtempSync(join(tmpdir(), "g4-skills-external-"));
        roots.push(externalRoot);
        const sentinel = resolve(externalRoot, "sentinel.md");
        writeFileSync(sentinel, "do not change\n");
        const destination = resolve(root, ".agents/skills/csscomponents/docs/Button.md");
        rmSync(destination);
        symlinkSync(sentinel, destination);
        const before = snapshotManaged(root);

        const result = run(root, "sync");

        expect(result.status).toBe(1);
        expect(result.stderr).toContain("managed path contains symlink");
        expect(readFileSync(sentinel, "utf8")).toBe("do not change\n");
        expect(snapshotManaged(root)).toBe(before);
    });

    it("fails unknown and missing operations without mutation", () => {
        const root = createFixture();
        sync(root);
        const before = snapshotManaged(root);

        for (const operation of [undefined, "unknown"]) {
            const result = run(root, operation);
            expect(result.status).toBe(1);
            expect(result.stderr).toContain("Usage: npx components:skills <install|sync|check>");
            expect(snapshotManaged(root)).toBe(before);
        }
    });

    it("preserves the existing install operation in a disposable fixture", () => {
        const root = createFixture();
        writeFileSync(resolve(root, "packages/lib/ai/SKILL.md"), "installed fixture skill\n");

        const result = run(root, "install");

        expect(result.status).toBe(0);
        expect(readFileSync(resolve(root, ".claude/skills/components-design-system/SKILL.md"), "utf8")).toBe("installed fixture skill\n");
        for (const path of references.keys()) {
            expect(readFileSync(resolve(root, ".claude/skills/components-design-system/docs", path), "utf8")).toBe(references.get(path));
        }
    });

    it("repository copies match canonical sources", () => {
        const repositoryRoot = resolve(__dirname, "../../..");
        const result = spawnSync(process.execPath, [sourceScript, "check"], {
            cwd: repositoryRoot,
            encoding: "utf8",
        });

        expect(result.status).toBe(0);
    });
});
