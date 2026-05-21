# Skills Installer CLI

## Overview

A single-file Node.js script that copies the library's agent skill into the
repository's `.claude/skills/` directory so Claude Code can load it
automatically. Invoked as `npx components/skills install` from the repo root.

## Motivation

The library ships a skill at `packages/lib/ai/SKILL.md` and supporting docs at
`packages/lib/ai/docs/`. Claude Code only auto-loads skills that live under
`.claude/skills/`. Without an install step a developer working in this repo has
to copy files manually or rely on an external skill manager.

## Constraints

- No new dependencies — Node `fs` and `path` only
- Node >= 20 (already required by the library)
- Idempotent: re-running must not error; it overwrites cleanly
- No mentions of the package scope in any user-visible output or paths
- ESM module format (`.mjs`)

## Files changed

- **`scripts/skills.mjs`** — new script (see below)
- **`package.json`** — adds `bin` entry `"components/skills": "./scripts/skills.mjs"`

## Script behaviour

### Invocation

```
npx components/skills install
```

After `pnpm install`, the bin entry creates `node_modules/.bin/components/skills`
(pnpm supports nested bin paths). `npx` resolves the local symlink before
querying the registry.

### `install` subcommand

1. Resolves paths relative to the script's own location so the script is
   position-independent within the repo.
2. Source: `packages/lib/ai/SKILL.md` and `packages/lib/ai/docs/`
3. Destination: `.claude/skills/components-design-system/`
4. Creates destination directories recursively if missing.
5. Copies `SKILL.md` to `.claude/skills/components-design-system/SKILL.md`.
6. Copies the entire `docs/` tree to
   `.claude/skills/components-design-system/docs/`, preserving file names.
7. Prints one confirmation line per file written to stdout.
8. On any I/O error, writes one line to stderr and exits with code 1.

### Unknown subcommands

Prints a usage message to stderr and exits with code 1. No subcommand also
triggers usage.

## Error handling

- Missing source file → stderr + exit 1
- Missing source docs directory → stderr + exit 1 (docs are required; a skill
  that references docs it cannot load is broken)
- Destination not writable → stderr + exit 1 (OS error propagated as-is)

## Testing

Manual smoke test only — the script is a straightforward file-copy with no
business logic to unit-test. Verification: run `npx components/skills install`,
confirm `.claude/skills/components-design-system/SKILL.md` and
`.claude/skills/components-design-system/docs/` exist with the expected content.
