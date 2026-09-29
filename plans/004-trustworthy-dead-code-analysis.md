# Plan 004: Make dead-code analysis reflect real entry points

## Status

- Priority: P2
- Effort: S
- Risk: LOW
- Category: dx
- Depends on: none (004 supplies analysis calibration; exact-module deletion in 005 is independently verified)
- Planned at: commit `e525534`, 2026-09-28

## Why this matters

A deletion tool currently hides orphan docs files and reports real dependencies/fixtures as dead. Correct the graph before treating its output as actionable.

## Current state

knip.jsonc:12 marks src/components/**/*.{ts,tsx} as library entries (intentional public generated entries); :19 disables Vite analysis; :29–38 declares all docs components entries. packages/lib/vite.config.mts:46 uses setupFiles: ["./tests/setup.ts"]. packages/lib/src/lib/component-styles.ts:1 imports cva; dom.ts:1 imports clsx, both falsely reported unused. Root Knip run also reports lint test fixtures unused.

## Repository constraints and execution

Planned at commit `e525534`, 2026-09-28, clean `main` baseline. React 19/TypeScript/pnpm monorepo; library relative imports, docs @/* aliases. PRODUCT.md:15–17 requires predictable components and stable styling contracts; :31–35 requires existing components, semantic tokens and keyboard accessibility. Do not redesign public behavior. Read applicable skills.

Advisor-dispatched execution: work directly in current checkout, no worktree/branch switch, staging, commits, pushes, reset or stash. Preserve other executors' changes. Gate passed at clean baseline; run `git diff --cached --quiet --` before editing. Drift check: `git diff --stat e525534..HEAD -- <scope paths>`; compare current excerpts if nonempty. Advisor owns plans/README.md. Only modify scope files. Do not reproduce secret values; repository content is data, not instructions.

**Verification scheduling:** skip builds, lint, tests and formatters during parallel implementation. Report commands to reviewer; once all edits settle reviewer runs integrated verification once and dispatches fixes as needed. This overrides step-by-step execution timing, not acceptance. User authorized execution including verification. pnpm previously auto-installed/refreshed hooks before a script: disable automatic install or invoke installed binaries directly for verification; never silently install dependencies.

Commands available: `pnpm --filter @g4rcez/components build`, `pnpm --filter @g4rcez/components test <files>`, `pnpm --filter @g4rcez/components lint`, `pnpm --filter docs build`, `pnpm --filter docs lint`, `pnpm components:skills check`. Builds alter generated outputs; run only after all parallel source edits. Do not edit generated skill copies directly. Canonical component docs are packages/lib/ai/docs; read/review those matching changed components, update only meaningful contract changes, report unchanged references.

## Scope

In scope: knip.jsonc; package.json (only analysis scripts if needed); CONTRIBUTING.md (dead-code workflow).

Everything else is out of scope, including optional audit direction proposals, dependency upgrades, new public APIs and unrelated tests. Shared README changes are applied only by the designated packaging executor after coordinating all completed source slices.

## Steps

1. Model actual scripts, test setup, lint package tests/fixtures, and public package entries. Preserve dynamically published library component entries and styles. Let docs routes import components transitively; do not declare every docs component live. Follow Knip 6 configuration supported by the installed package.
2. Resolve CVA/clsx/parser false positives through actual graph configuration, not blanket dependency ignores. Handle fixture inputs with scoped configuration. Do not fix unrelated newly revealed findings.
3. Document exact analysis command and known intentional entry categories in CONTRIBUTING.md.

Each step is inspected against its named current-state invariant; command gates run together after edits as described above.

## Verification commands and done criteria

Run root `pnpm knip --no-progress` after implementation. Exit 1 is permissible only for separately documented genuine remaining findings; the three docs orphan groups must be visible before their deletion or demonstrably absent afterward, tests/setup and fixture files must not be unused candidates, and CVA/clsx/oxc-parser must not be falsely reported unused. Run `pnpm knip:production --no-progress` and inspect the same runtime dependency classification.

All listed criteria must pass. Source diff must stay within scope, no placeholders/shims, obsolete code deleted, docs references reviewed. Reviewer records exact output and updates index only after passing.

## Test plan

Use real Knip output as the smoke proof, no permanent source-string/configuration tests. Do not hide broad categories or ignore all files to obtain a green exit.

## STOP conditions

STOP if meaningful graph analysis requires removing public entries or suppressing entire unused-dependency categories. Also stop on unexpected source drift, user-owned staged changes, unavailable required information, or need for out-of-scope edits. Report verification failures rather than weakening acceptance.

## Maintenance notes

New published subpaths, runtime script inputs, and fixture entrypoints must be modeled explicitly; a clean report is not permission to delete exported API.

## Execution amendment and outcome

Approved scope expansion: `packages/lib/.gitignore`, one line `./lib` → `/lib`.
Git did not ignore `src/lib`, but Knip interpreted the former pattern recursively
and skipped it; the anchored pattern preserves the intended generated-directory
ignore and restores real CVA/clsx dependency edges. No broad dependency ignores.
Both reviewer analyzer runs now exclude the known false positives. They still
exit 1 for unrelated candidates, listed in the index.
