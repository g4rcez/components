# AI Skills Bundle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `ai/` at the npm package root and make the skill installable via `npx skills add g4rcez/components`, with a single source of truth for `SKILL.md` at `skills/g4rcez-components/SKILL.md` in the monorepo root.

**Architecture:** The `skills/` directory at the repo root becomes the authoritative source for SKILL.md; the build script copies it into `packages/lib/ai/` before publishing. The `ai/` directory (containing SKILL.md + `docs/`) is added to `files` in `package.json` so it lands at `node_modules/@g4rcez/components/ai/` after install.

**Tech Stack:** npm/pnpm package publishing, `package.json` `files` + `exports` fields, shell `cp`

---

### Task 1: Create `skills/g4rcez-components/SKILL.md` at monorepo root

**Files:**
- Create: `skills/g4rcez-components/SKILL.md`

- [ ] **Step 1: Create the directory and move the content**

  Create `skills/g4rcez-components/SKILL.md` with the exact content of `packages/lib/ai/SKILL.md`. Do not change the content — copy it verbatim.

  ```bash
  mkdir -p /Users/garcez/Documents/g4rcez/components/skills/g4rcez-components
  cp /Users/garcez/Documents/g4rcez/components/packages/lib/ai/SKILL.md \
     /Users/garcez/Documents/g4rcez/components/skills/g4rcez-components/SKILL.md
  ```

- [ ] **Step 2: Verify the file exists and content matches**

  ```bash
  diff /Users/garcez/Documents/g4rcez/components/packages/lib/ai/SKILL.md \
       /Users/garcez/Documents/g4rcez/components/skills/g4rcez-components/SKILL.md
  ```

  Expected: no output (files are identical).

- [ ] **Step 3: Commit**

  ```bash
  cd /Users/garcez/Documents/g4rcez/components
  git add skills/g4rcez-components/SKILL.md
  git commit -m "feat(skills): add g4rcez-components skill as single source of truth"
  ```

---

### Task 2: Update `packages/lib/package.json`

**Files:**
- Modify: `packages/lib/package.json` (lines 27, 92–96, 299)

- [ ] **Step 1: Update the `build` script**

  In `packages/lib/package.json`, change the `"build"` script from:

  ```json
  "build": "rm -rf ./dist; vite build; npm run lib:types; npm run preset; npm run lib:css; cp -r ai dist"
  ```

  to:

  ```json
  "build": "cp ../../skills/g4rcez-components/SKILL.md ./ai/SKILL.md; rm -rf ./dist; vite build; npm run lib:types; npm run preset; npm run lib:css"
  ```

  Changes: prepend the `cp` that refreshes `ai/SKILL.md` from the source of truth; drop `cp -r ai dist` at the end (no longer needed).

- [ ] **Step 2: Update the `files` array**

  Change:

  ```json
  "files": [
      "dist",
      "dist/index.css",
      "dist/ai"
  ]
  ```

  to:

  ```json
  "files": [
      "dist",
      "dist/index.css",
      "ai"
  ]
  ```

  `"dist/ai"` is replaced with `"ai"` (source directory published directly). `"dist/index.css"` is redundant since `"dist"` covers it, but leave it — it matches existing convention and causes no harm.

- [ ] **Step 3: Fix the `exports` wildcard**

  Change:

  ```json
  "./ai/*": "./**"
  ```

  to:

  ```json
  "./ai/*": "./ai/*"
  ```

- [ ] **Step 4: Verify `package.json` is valid JSON**

  ```bash
  cd /Users/garcez/Documents/g4rcez/components/packages/lib
  node -e "require('./package.json'); console.log('valid')"
  ```

  Expected output: `valid`

- [ ] **Step 5: Commit**

  ```bash
  cd /Users/garcez/Documents/g4rcez/components
  git add packages/lib/package.json
  git commit -m "feat(lib): publish ai/ at package root, fix exports wildcard, sync SKILL.md on build"
  ```

---

### Task 3: Run the build and verify output

**Files:**
- No new files — verifying build output

- [ ] **Step 1: Run the build**

  ```bash
  cd /Users/garcez/Documents/g4rcez/components/packages/lib
  pnpm build
  ```

  Expected: build completes without errors. The first line of output should show the `cp` completing silently.

- [ ] **Step 2: Verify `ai/SKILL.md` was refreshed by the build**

  ```bash
  diff /Users/garcez/Documents/g4rcez/components/skills/g4rcez-components/SKILL.md \
       /Users/garcez/Documents/g4rcez/components/packages/lib/ai/SKILL.md
  ```

  Expected: no output (files are identical after the build step copied them).

- [ ] **Step 3: Verify `dist/ai/` does NOT exist**

  ```bash
  ls /Users/garcez/Documents/g4rcez/components/packages/lib/dist/ai 2>&1
  ```

  Expected: `ls: .../dist/ai: No such file or directory`

- [ ] **Step 4: Verify `ai/docs/` still has all 50 component docs**

  ```bash
  ls /Users/garcez/Documents/g4rcez/components/packages/lib/ai/docs | wc -l
  ```

  Expected: `50`

- [ ] **Step 5: Check `npm pack --dry-run` includes `ai/`**

  ```bash
  cd /Users/garcez/Documents/g4rcez/components/packages/lib
  npm pack --dry-run 2>&1 | grep "^ai/"
  ```

  Expected: lines like `ai/SKILL.md` and `ai/docs/Button.md` etc. appear in the output.

- [ ] **Step 6: Commit if any incidental changes occurred; otherwise skip**

  If `pnpm build` dirtied any tracked files (e.g. regenerated types), stage and commit them:

  ```bash
  cd /Users/garcez/Documents/g4rcez/components
  git status
  # if dirty:
  git add packages/lib/dist
  git commit -m "chore(lib): rebuild dist after ai/ bundle change"
  ```
