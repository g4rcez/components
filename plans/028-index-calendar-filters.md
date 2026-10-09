# Plan 028: Resolve each event filter once through an indexed lookup

## Status
Priority: P2. Effort: S. Risk: LOW. Category: perf. Depends on: none.
Planned at: commit cfc8f2c, 2026-10-09. User approved implementation of all eight audit findings.

## Drift check
Run `git diff --stat cfc8f2c..HEAD -- packages/lib/src/components/page-calendar/page-calendar.tsx`; compare excerpts below to live code. Preserve unrelated working-tree Autocomplete changes.

## Why this matters and current state
`events.filter(e => effectiveFilters.find(f => f.id === get(e))?.enabled ?? true)` repeats filter scans and custom resolver execution.

## Scope
Only modify: packages/lib/src/components/page-calendar/page-calendar.tsx; packages/lib/tests/page-calendar.test.tsx. All other source, CSS, public exports, dependency versions, generated references and git operations are out of scope.

## Conventions and boundaries
React 19/TypeScript, relative imports in library, existing stable CSS selectors and public APIs stay intact. PRODUCT.md requires predictable form semantics and keyboard accessibility. Use Bun for commands. Match existing Vitest/RTL tests; no any or diagnostic suppression. Work in current checkout; preserve prior Autocomplete dynamicOption edits. Never stage, commit, push, switch branches, or create worktrees. Reviewer updates plans/README.md.

## Verification gates
Run focused tests listed below before edits (expected pass), then after adding regression coverage and implementing. Run `bunx tsc -p tsconfig.lib.json --noEmit` from packages/lib (exit 0). Run `bunx oxlint <changed TS paths>` from root (no new warnings/errors) and `git diff --check` (exit 0). Review matching canonical references in packages/lib/ai/docs; behavioral/API/CSS changes are out of scope. Reviewer runs combined tests, skill synchronization check and real-browser QA.

## STOP conditions
Stop and report if excerpts drift, public semantics/CSS changes are necessary, an out-of-scope file needs editing, or verification fails twice after reasonable fixes. Do not weaken tests. Record verification and maintenance concerns in executor report.

## Steps and test plan
1. Characterize unknown IDs, absent IDs, duplicate filters (first entry wins), custom getFilterId, empty filters and controlled filter changes.
2. Create an ID-to-enabled lookup from effectiveFilters preserving first-entry semantics, then resolve each event ID once and preserve unmatched-events-visible default. Retain no-filter fast path and memo dependencies.
3. Add call-count coverage: one custom resolver invocation per event with filters, zero when filters are empty. Verify output parity.

Focused verification before edits and after implementation: `bun run --cwd packages/lib test tests/page-calendar.test.tsx` must exit 0 with all tests passed. Tests use Vitest/RTL, following the existing listed files. Add regression assertions before changing behavior. Run typecheck/lint/diff gates after focused tests.

## Done criteria
Focused regression tests pass, typecheck exits 0, no new lint diagnostics, git diff check passes, and no changes beyond scope. Reviewer verifies current-checkout implementation and browser behavior before marking DONE.

## Maintenance notes
Keep first-match semantics and existing controlled/internal filter behavior; do not alter event ordering.

## Final review
APPROVE — DONE on 2026-10-09. Implementation and regression coverage reviewed.
Combined reviewer gates passed: 115 tests in 14 files, library TypeScript,
changed-file lint (one existing warning), skill consistency, and diff checks.
Browser evidence and verification limits are recorded in plans/README.md under
the performance execution review. No API or CSS contract changes were required.

