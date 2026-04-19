# AI Skills Bundle Design

**Date:** 2026-04-19

## Goal

Publish `ai/` (SKILL.md + component docs) at `node_modules/@g4rcez/components/ai/` in the npm package, and make the skill installable via `npx skills add g4rcez/components` from the GitHub repo — with a single source of truth for the SKILL.md content.

## Directory Structure After

```
# Monorepo root (new)
skills/
  g4rcez-components/
    SKILL.md              ← single source of truth

# Package (unchanged source)
packages/lib/
  ai/
    SKILL.md              ← build artifact, copied from skills/ during build
    docs/
      *.md                ← 50 component docs, source of truth stays here
```

## Changes

### 1. Create `skills/g4rcez-components/SKILL.md`

Move content from `packages/lib/ai/SKILL.md` here. This becomes the single source of truth for the Claude Code skill.

### 2. `packages/lib/package.json` — `build` script

- Add `cp ../../skills/g4rcez-components/SKILL.md ./ai/SKILL.md` before the build runs so `ai/SKILL.md` is always fresh.
- Remove `cp -r ai dist` (no longer needed; `ai/` is published from source via `files`).

### 3. `packages/lib/package.json` — `files`

- Add `"ai"` so the directory is included in the published package.
- Remove `"dist/ai"` (redundant; already covered by `"dist"`).

### 4. `packages/lib/package.json` — `exports`

- Fix `"./ai/*": "./**"` → `"./ai/*": "./ai/*"`.

## Distribution

- `npx skills add g4rcez/components` → CLI finds `skills/g4rcez-components/SKILL.md` at repo root.
- `node_modules/@g4rcez/components/ai/SKILL.md` → same content, copied by build.
- `node_modules/@g4rcez/components/ai/docs/<Component>.md` → component docs, sourced from `packages/lib/ai/docs/`.

## Out of Scope

- Generating component docs (`ai/docs/*.md`) automatically — they remain hand-authored.
- Changing the SKILL.md content itself.
