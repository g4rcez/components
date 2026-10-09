# Plan 025: Read initial table preferences only during initialization

## Status
Priority: P2. Effort: S. Risk: LOW. Category: perf. Depends on: none.
Planned at: commit cfc8f2c, 2026-10-09. User approved implementation of all eight audit findings.

## Drift check
Run `git diff --stat cfc8f2c..HEAD -- packages/lib/src/components/table/table-lib.ts`; compare excerpts below to live code. Preserve unrelated working-tree Autocomplete changes.

## Why this matters and current state
`const init = isSsr() ? null : LocalStorage.get(...) || null` and `cols: mergeCols(cols, init?.cols)` execute in the hook body before use-typed-reducer, which consumes initial state once.

## Scope
Only modify: packages/lib/src/components/table/table-lib.ts; packages/lib/tests/table-properties.test.tsx. All other source, CSS, public exports, dependency versions, generated references and git operations are out of scope.

## Conventions and boundaries
React 19/TypeScript, relative imports in library, existing stable CSS selectors and public APIs stay intact. PRODUCT.md requires predictable form semantics and keyboard accessibility. Use Bun for commands. Match existing Vitest/RTL tests; no any or diagnostic suppression. Work in current checkout; preserve prior Autocomplete dynamicOption edits. Never stage, commit, push, switch branches, or create worktrees. Reviewer updates plans/README.md.

## Verification gates
Run focused tests listed below before edits (expected pass), then after adding regression coverage and implementing. Run `bunx tsc -p tsconfig.lib.json --noEmit` from packages/lib (exit 0). Run `bunx oxlint <changed TS paths>` from root (no new warnings/errors) and `git diff --check` (exit 0). Review matching canonical references in packages/lib/ai/docs; behavioral/API/CSS changes are out of scope. Reviewer runs combined tests, skill synchronization check and real-browser QA.

## STOP conditions
Stop and report if excerpts drift, public semantics/CSS changes are necessary, an out-of-scope file needs editing, or verification fails twice after reasonable fixes. Do not weaken tests. Record verification and maintenance concerns in executor report.

## Steps and test plan
1. Add rerender/state-update tests spying on LocalStorage.get and set. Preserve saved column visibility/order/new columns, option precedence and current name-change behavior.
2. Put complete initial-state preparation in a lazy React state initializer (the custom typed reducer does not accept React's lazy initializer directly). Pass resulting initial state to typed reducer. Preserve storage format, dispatch and SSR behavior.
3. Verify storage reads and reconciliation do not repeat after mount; updates still persist.

Focused verification before edits and after implementation: `bun run --cwd packages/lib test tests/table-properties.test.tsx` must exit 0 with all tests passed. Tests use Vitest/RTL, following the existing listed files. Add regression assertions before changing behavior. Run typecheck/lint/diff gates after focused tests.

## Done criteria
Focused regression tests pass, typecheck exits 0, no new lint diagnostics, git diff check passes, and no changes beyond scope. Reviewer verifies current-checkout implementation and browser behavior before marking DONE.

## Maintenance notes
Do not redesign persistence or omit saved group rows in this refactor. Initialization is mount-scoped; preserve existing name/column update contract.

## Final review
APPROVE — DONE on 2026-10-09. Implementation and regression coverage reviewed.
Combined reviewer gates passed: 115 tests in 14 files, library TypeScript,
changed-file lint (one existing warning), skill consistency, and diff checks.
Browser evidence and verification limits are recorded in plans/README.md under
the performance execution review. No API or CSS contract changes were required.

