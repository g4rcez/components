# Skills Installer CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `npx components/skills install` command that copies `packages/lib/ai/SKILL.md` and `packages/lib/ai/docs/` into `.claude/skills/components-design-system/`.

**Architecture:** A single ESM script at `scripts/skills.mjs` with a shebang. The root `package.json` registers it under `"bin": { "components/skills": ... }` so pnpm links it into `node_modules/.bin/components/skills`, making the `npx` invocation work without publishing. No dependencies beyond Node built-ins.

**Tech Stack:** Node.js ≥ 20, ESM (`node:fs`, `node:path`, `node:url`), pnpm workspaces.

---

### Task 1: Create `scripts/skills.mjs`

**Files:**
- Create: `scripts/skills.mjs`

- [ ] **Step 1: Create the file with this exact content**

```js
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
```

- [ ] **Step 2: Make the script executable**

```bash
chmod +x scripts/skills.mjs
```

- [ ] **Step 3: Verify the script runs correctly before wiring the bin**

```bash
node scripts/skills.mjs install
```

Expected output (two lines):
```
copied SKILL.md → .claude/skills/components-design-system/SKILL.md
copied docs/    → .claude/skills/components-design-system/docs/
```

- [ ] **Step 4: Verify the files were created**

```bash
ls .claude/skills/components-design-system/
```

Expected:
```
SKILL.md
docs/
```

```bash
ls .claude/skills/components-design-system/docs/
```

Expected: same files as `packages/lib/ai/docs/` — at minimum `index.md` and individual component `.md` files.

- [ ] **Step 5: Verify the unknown-subcommand path**

```bash
node scripts/skills.mjs && echo "exit $?"
```

Expected: prints `Usage: npx components/skills install` to stderr and exits with code 1.

- [ ] **Step 6: Commit**

```bash
git add scripts/skills.mjs
git commit -m "feat(skills): add install script"
```

---

### Task 2: Register the bin in `package.json`

**Files:**
- Modify: `package.json` (repo root)

- [ ] **Step 1: Add the bin entry to root `package.json`**

The full file after the change:

```json
{
  "name": "components",
  "version": "1.0.4",
  "description": "",
  "main": "index.js",
  "author": {
    "email": "allan.f.garcez@gmail.com",
    "name": "Allan Garcez",
    "url": "https://garcez.dev"
  },
  "keywords": [],
  "license": "MIT",
  "bin": {
    "components/skills": "./scripts/skills.mjs"
  },
  "devDependencies": {
    "lefthook": "2.1.6",
    "oxfmt": "0.48.0",
    "oxlint": "1.63.0"
  },
  "scripts": {
    "build": "pnpm run --filter ./packages/lib lib:css; pnpm run -r build",
    "dev": "pnpm run --filter ./packages/docs dev",
    "format": "pnpm run -r format",
    "lint": "pnpm run -r --workspace-concurrency=1 lint",
    "prepare": "lefthook install",
    "start": "pnpm run --filter ./packages/docs start"
  }
}
```

- [ ] **Step 2: Re-run pnpm install to create the symlink**

```bash
pnpm install
```

Expected: no errors; pnpm links the bin.

- [ ] **Step 3: Confirm the symlink exists**

```bash
ls -la node_modules/.bin/components/
```

Expected: a `skills` symlink pointing to `../../scripts/skills.mjs` (relative path may vary).

- [ ] **Step 4: Smoke-test the full npx invocation**

Remove the previously installed output first so the test is clean:

```bash
rm -rf .claude/skills/components-design-system
npx components/skills install
```

Expected output:
```
copied SKILL.md → .claude/skills/components-design-system/SKILL.md
copied docs/    → .claude/skills/components-design-system/docs/
```

- [ ] **Step 5: Confirm idempotency — run install a second time**

```bash
npx components/skills install
```

Expected: same output as above, no error.

- [ ] **Step 6: Commit**

```bash
git add package.json
git commit -m "feat(skills): register components/skills bin"
```
