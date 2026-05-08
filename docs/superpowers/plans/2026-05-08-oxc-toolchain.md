# OXC Toolchain Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace ESLint + Prettier with `oxlint` + `oxfmt` across both workspace packages, with Tailwind class sorting handled natively by `oxfmt` and a `lefthook` pre-commit gate.

**Architecture:** Single `oxlint.json` and `.oxfmtrc.json` at workspace root cover both packages. Each package gets `lint` and `format` scripts that delegate to the workspace-installed binaries. `lefthook` wires both tools into git pre-commit.

**Tech Stack:** oxlint 1.63.0, oxfmt 0.48.0, lefthook 2.1.6, pnpm workspaces

> **Spec deviation from brainstorming:** `rustywind` is not needed. `oxfmt` has built-in Tailwind CSS class sorting via `sortTailwindcss: true`. This eliminates one dependency and merges formatting + class sorting into a single pre-commit step.

---

### Task 1: Strip ESLint and Prettier deps from packages/lib

**Files:**
- Modify: `packages/lib/package.json`
- Delete: `packages/lib/eslint.config.js`
- Delete: `packages/lib/.prettierrc.json`

- [ ] **Step 1: Remove devDeps from packages/lib/package.json**

Open `packages/lib/package.json` and remove these keys from `devDependencies`:

```
@eslint/js
eslint
eslint-config-react-app
eslint-plugin-jsx-a11y
eslint-plugin-react-hooks
eslint-plugin-react-refresh
globals
typescript-eslint
prettier
```

- [ ] **Step 2: Delete old config files**

```bash
rm packages/lib/eslint.config.js packages/lib/.prettierrc.json
```

Expected: both files gone, no error output.

- [ ] **Step 3: Commit**

```bash
git add packages/lib/package.json packages/lib/eslint.config.js packages/lib/.prettierrc.json
git commit -m "chore: remove ESLint and Prettier from packages/lib"
```

---

### Task 2: Update root package.json — remove Prettier, add oxlint + oxfmt + lefthook

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove Prettier deps from root package.json**

In `package.json` devDependencies, remove:
```
prettier
prettier-plugin-tailwindcss
```

- [ ] **Step 2: Add new devDeps and scripts to root package.json**

Add to `devDependencies`:
```json
"oxlint": "1.63.0",
"oxfmt": "0.48.0",
"lefthook": "2.1.6"
```

Add to `scripts`:
```json
"lint": "pnpm run -r lint",
"format": "pnpm run -r format",
"prepare": "lefthook install"
```

- [ ] **Step 3: Install packages**

```bash
pnpm install
```

Expected: lock file updated, no errors.

- [ ] **Step 4: Verify binaries are available**

```bash
pnpm exec oxlint --version
pnpm exec oxfmt --version
pnpm exec lefthook version
```

Expected output (approximately):
```
oxlint v1.63.0
0.48.0
lefthook version 2.1.6
```

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add oxlint, oxfmt, lefthook to workspace root"
```

---

### Task 3: Create /.oxfmtrc.json

**Files:**
- Create: `.oxfmtrc.json`

- [ ] **Step 1: Create the config file**

Create `/.oxfmtrc.json` at the workspace root:

```json
{
    "$schema": "./node_modules/oxfmt/configuration_schema.json",
    "printWidth": 150,
    "tabWidth": 4,
    "useTabs": false,
    "semi": true,
    "singleQuote": false,
    "trailingComma": "es5",
    "sortTailwindcss": {
        "config": "./packages/lib/tailwind.config.ts"
    }
}
```

- [ ] **Step 2: Verify formatter runs without errors**

```bash
pnpm exec oxfmt --check packages/lib/src/index.ts
```

Expected: exits 0 (file is already formatted) or exits 1 with diff output showing what would change. Either is acceptable — we are not enforcing format yet.

If the command errors (not a formatting diff, an actual crash), check `oxfmt --help` for the correct `--check` flag syntax.

- [ ] **Step 3: Commit**

```bash
git add .oxfmtrc.json
git commit -m "chore: add oxfmt config with Tailwind class sorting"
```

---

### Task 4: Create /oxlint.json

**Files:**
- Create: `oxlint.json`

- [ ] **Step 1: Create the config file**

Create `/oxlint.json` at the workspace root:

```json
{
    "$schema": "https://raw.githubusercontent.com/oxc-project/oxc/refs/heads/main/npm/oxlint/configuration_schema.json",
    "plugins": ["react", "typescript", "jsx-a11y"],
    "rules": {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    },
    "ignorePatterns": ["dist", ".next", "node_modules"]
}
```

- [ ] **Step 2: Run oxlint against packages/lib to confirm it loads the config**

```bash
pnpm exec oxlint packages/lib/src
```

Expected: linting output with zero errors, or errors that are real issues in the source (not config-load failures). A config-load failure would show "Failed to load config" or similar. If the config fails to load, check if the `$schema` URL is correct or try removing it temporarily.

- [ ] **Step 3: Run oxlint against packages/docs**

```bash
pnpm exec oxlint packages/docs
```

Expected: same as above — zero config-load errors.

- [ ] **Step 4: Commit**

```bash
git add oxlint.json
git commit -m "chore: add oxlint config with react, typescript, jsx-a11y plugins"
```

---

### Task 5: Update scripts in packages/lib and packages/docs

**Files:**
- Modify: `packages/lib/package.json`
- Modify: `packages/docs/package.json`

- [ ] **Step 1: Update packages/lib/package.json scripts**

In `packages/lib/package.json`, change the `format` script and add `lint`:

Replace:
```json
"format": "npx prettier --write ."
```
With:
```json
"format": "oxfmt --write .",
"lint": "oxlint ."
```

- [ ] **Step 2: Add scripts to packages/docs/package.json**

In `packages/docs/package.json`, remove the existing `"lint": "next lint"` entry and add:

```json
"lint": "oxlint .",
"format": "oxfmt --write ."
```

- [ ] **Step 3: Verify scripts run from each package**

```bash
pnpm --filter @g4rcez/components run lint
```

Expected: oxlint runs against packages/lib/src, exits 0 or reports actual lint issues.

```bash
pnpm --filter docs run lint
```

Expected: oxlint runs against packages/docs, exits 0 or reports actual lint issues.

- [ ] **Step 4: Verify format script**

```bash
pnpm --filter @g4rcez/components run format
```

Expected: oxfmt formats files in packages/lib. First run may rewrite files (Prettier-to-oxfmt diff). This is expected.

- [ ] **Step 5: Verify root scripts delegate correctly**

```bash
pnpm lint
pnpm format
```

Expected: both commands run across all workspace packages without errors.

- [ ] **Step 6: Commit**

```bash
git add packages/lib/package.json packages/docs/package.json
git commit -m "chore: wire oxlint and oxfmt scripts into workspace packages"
```

---

### Task 6: Create /lefthook.yml and install hooks

**Files:**
- Create: `lefthook.yml`

- [ ] **Step 1: Create lefthook.yml**

Create `/lefthook.yml` at the workspace root:

```yaml
pre-commit:
  commands:
    oxfmt:
      glob: "*.{ts,tsx}"
      run: pnpm exec oxfmt --write {staged_files}
      stage_fixed: true
    oxlint:
      glob: "*.{ts,tsx}"
      run: pnpm exec oxlint {staged_files}
```

`stage_fixed: true` re-stages any files that `oxfmt` modifies, so the formatted version is what gets committed.

- [ ] **Step 2: Install lefthook hooks**

```bash
pnpm exec lefthook install
```

Expected output:
```
lefthook: installed
```

Verify the hook was written:

```bash
cat .git/hooks/pre-commit
```

Expected: a shell script that calls lefthook.

- [ ] **Step 3: Verify the hook fires on a test commit**

Stage any `.ts` or `.tsx` file and attempt a commit:

```bash
git add packages/lib/src/index.ts
git commit -m "test: verify pre-commit hook"
```

Expected: lefthook runs `oxfmt --write` then `oxlint` on staged files before the commit proceeds. If oxlint finds errors, the commit is blocked. If oxfmt rewrites a file, it is re-staged automatically.

Abort the commit after verifying the hook fires (use `git reset HEAD~1` if it went through).

- [ ] **Step 4: Commit lefthook config**

```bash
git add lefthook.yml
git commit -m "chore: add lefthook pre-commit with oxfmt and oxlint"
```

---

### Task 7: Remove Prettier from packages/docs (if present)

**Files:**
- Modify: `packages/docs/package.json` (verify)

- [ ] **Step 1: Check packages/docs for Prettier**

```bash
grep -i prettier packages/docs/package.json
```

Expected: no matches (Prettier was never in docs). If it appears, remove it from devDependencies and run `pnpm install`.

- [ ] **Step 2: Run pnpm install to clean lock file**

```bash
pnpm install
```

Expected: clean install, no Prettier packages remain.

- [ ] **Step 3: Confirm Prettier is fully gone from the workspace**

```bash
grep -r '"prettier"' package.json packages/*/package.json
```

Expected: no matches.

- [ ] **Step 4: Commit cleanup**

```bash
git add package.json packages/docs/package.json pnpm-lock.yaml
git commit -m "chore: complete Prettier removal from workspace"
```

---

### Task 8: End-to-end verification

- [ ] **Step 1: Full lint pass**

```bash
pnpm lint
```

Expected: oxlint runs across both packages. Note any real lint errors but do not fix them in this task — the goal is confirming the toolchain works.

- [ ] **Step 2: Full format pass**

```bash
pnpm format
```

Expected: oxfmt runs across both packages. Files may be rewritten on this first pass due to Prettier-to-oxfmt formatting differences. This is expected.

- [ ] **Step 3: Check build still passes**

```bash
pnpm build
```

Expected: build succeeds. Formatting changes should not break TypeScript compilation.

- [ ] **Step 4: Check tests still pass**

```bash
pnpm --filter @g4rcez/components run test
```

Expected: all tests pass.

- [ ] **Step 5: Commit the formatting diff**

The first `pnpm format` will produce a large diff across many files (Prettier vs oxfmt output). Commit it as a single formatting-only commit:

```bash
git add -A
git commit -m "style: apply oxfmt formatting across workspace (initial pass)"
```

- [ ] **Step 6: Update CLAUDE.md to reflect tool change**

Open `CLAUDE.md` at the workspace root. Replace any mention of `prettier` in the Commands section with:

```
pnpm lint      # oxlint across workspace
pnpm format    # oxfmt across workspace
```
