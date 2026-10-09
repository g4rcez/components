# Plan 029: Keep Masonry observers stable when notification callbacks change

## Status
Priority: P2. Effort: S. Risk: MED. Category: perf. Depends on: none.
Planned at: commit cfc8f2c, 2026-10-09. User approved implementation of all eight audit findings.

## Drift check
Run `git diff --stat cfc8f2c..HEAD -- packages/lib/src/components/display/masonry/masonry.tsx`; compare excerpts below to live code. Preserve unrelated working-tree Autocomplete changes.

## Why this matters and current state
`measure` depends on `[childrenArray, columns, gutter, onLayoutChange]`; scheduleMeasure depends on measure and observer effect depends on scheduleMeasure. Callback identity changes restart all observations and geometry reads.

## Scope
Only modify: packages/lib/src/components/display/masonry/masonry.tsx; packages/lib/tests/masonry.test.tsx. All other source, CSS, public exports, dependency versions, generated references and git operations are out of scope.

## Conventions and boundaries
React 19/TypeScript, relative imports in library, existing stable CSS selectors and public APIs stay intact. PRODUCT.md requires predictable form semantics and keyboard accessibility. Use Bun for commands. Match existing Vitest/RTL tests; no any or diagnostic suppression. Work in current checkout; preserve prior Autocomplete dynamicOption edits. Never stage, commit, push, switch branches, or create worktrees. Reviewer updates plans/README.md.

## Verification gates
Run focused tests listed below before edits (expected pass), then after adding regression coverage and implementing. Run `bunx tsc -p tsconfig.lib.json --noEmit` from packages/lib (exit 0). Run `bunx oxlint <changed TS paths>` from root (no new warnings/errors) and `git diff --check` (exit 0). Review matching canonical references in packages/lib/ai/docs; behavioral/API/CSS changes are out of scope. Reviewer runs combined tests, skill synchronization check and real-browser QA.

## STOP conditions
Stop and report if excerpts drift, public semantics/CSS changes are necessary, an out-of-scope file needs editing, or verification fails twice after reasonable fixes. Do not weaken tests. Record verification and maintenance concerns in executor report.

## Steps and test plan
1. Add test with stable children and callback-only rerender: spy observer construction/disconnect and geometry reads. Trigger subsequent real resize and assert newest callback receives changed layout.
2. Keep latest onLayoutChange in existing useStableRef or equivalent ref and remove callback identity from geometry dependencies. Preserve actual children/layout/fresh triggers, RAF cancellation, equal-layout guard and cleanup.
3. Verify height changes, wide items, fresh, equal layouts and latest-callback behavior without observer rebuild on callback-only changes.

Focused verification before edits and after implementation: `bun run --cwd packages/lib test tests/masonry.test.tsx` must exit 0 with all tests passed. Tests use Vitest/RTL, following the existing listed files. Add regression assertions before changing behavior. Run typecheck/lint/diff gates after focused tests.

## Done criteria
Focused regression tests pass, typecheck exits 0, no new lint diagnostics, git diff check passes, and no changes beyond scope. Reviewer verifies current-checkout implementation and browser behavior before marking DONE.

## Maintenance notes
Observer lifecycle should follow geometry dependencies. New callbacks must receive future changes without forced equal-layout notifications.

## Final review
APPROVE — DONE on 2026-10-09. Implementation and regression coverage reviewed.
Combined reviewer gates passed: 115 tests in 14 files, library TypeScript,
changed-file lint (one existing warning), skill consistency, and diff checks.
Browser evidence and verification limits are recorded in plans/README.md under
the performance execution review. No API or CSS contract changes were required.

