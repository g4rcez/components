#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(repoRoot, "packages", "lib", "ai");
const dest = join(repoRoot, ".claude", "skills", "components-design-system");

const [, , subcommand] = process.argv;

if (subcommand !== "install") {
    process.stderr.write("Usage: npx components/skills install\n");
    process.exit(1);
}

if (!existsSync(join(src, "SKILL.md"))) {
    process.stderr.write(`error: skill source not found at ${join(src, "SKILL.md")}\n`);
    process.exit(1);
}

if (!existsSync(join(src, "docs"))) {
    process.stderr.write(`error: docs source not found at ${join(src, "docs")}\n`);
    process.exit(1);
}

mkdirSync(join(dest, "docs"), { recursive: true });

cpSync(join(src, "SKILL.md"), join(dest, "SKILL.md"));
process.stdout.write(`copied SKILL.md → .claude/skills/components-design-system/SKILL.md\n`);

cpSync(join(src, "docs"), join(dest, "docs"), { recursive: true });
process.stdout.write(`copied docs/    → .claude/skills/components-design-system/docs/\n`);
