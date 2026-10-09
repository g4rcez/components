# Plan 027: Reuse calendar formatters and repeated hour labels

## Status
Priority: P2. Effort: S. Risk: LOW. Category: perf. Depends on: none.
Planned at: commit cfc8f2c, 2026-10-09. User approved implementation of all eight audit findings.

## Drift check
Run `git diff --stat cfc8f2c..HEAD -- packages/lib/src/components/page-calendar/page-calendar.utils.ts`; compare excerpts below to live code. Preserve unrelated working-tree Autocomplete changes.

## Why this matters and current state
`formatHourLabel` creates new Intl.DateTimeFormat for every invocation. Week view invokes it 23 times in gutter plus 168 slot names for only 24 distinct labels. Other date helpers likewise construct identical formatters.

## Scope
Only modify: packages/lib/src/components/page-calendar/page-calendar.utils.ts; packages/lib/src/components/page-calendar/week-view.tsx; packages/lib/src/components/page-calendar/day-view.tsx; packages/lib/tests/page-calendar.test.tsx. All other source, CSS, public exports, dependency versions, generated references and git operations are out of scope.

## Conventions and boundaries
React 19/TypeScript, relative imports in library, existing stable CSS selectors and public APIs stay intact. PRODUCT.md requires predictable form semantics and keyboard accessibility. Use Bun for commands. Match existing Vitest/RTL tests; no any or diagnostic suppression. Work in current checkout; preserve prior Autocomplete dynamicOption edits. Never stage, commit, push, switch branches, or create worktrees. Reviewer updates plans/README.md.

## Verification gates
Run focused tests listed below before edits (expected pass), then after adding regression coverage and implementing. Run `bunx tsc -p tsconfig.lib.json --noEmit` from packages/lib (exit 0). Run `bunx oxlint <changed TS paths>` from root (no new warnings/errors) and `git diff --check` (exit 0). Review matching canonical references in packages/lib/ai/docs; behavioral/API/CSS changes are out of scope. Reviewer runs combined tests, skill synchronization check and real-browser QA.

## STOP conditions
Stop and report if excerpts drift, public semantics/CSS changes are necessary, an out-of-scope file needs editing, or verification fails twice after reasonable fixes. Do not weaken tests. Record verification and maintenance concerns in executor report.

## Steps and test plan
1. Characterize all existing format helper output for multiple locales and hours, plus locale changes through ComponentsProvider. Add constructor-count coverage and existing date/time slot behavior checks.
2. Reuse Intl formatters through a bounded locale/options cache or scoped formatter bundle, preserving default timezone, public signatures, new Date conversion, all options and invalid-locale errors. Derive 24 hour labels once per locale per view with useMemo and reuse in both gutter/slot names. Avoid unbounded global caches.
3. Verify constructor reuse and locale-switch output, calendar selection and accessibility. Do not change event geometry or layout.

Focused verification before edits and after implementation: `bun run --cwd packages/lib test tests/page-calendar.test.tsx tests/month-view-a11y.test.tsx` must exit 0 with all tests passed. Tests use Vitest/RTL, following the existing listed files. Add regression assertions before changing behavior. Run typecheck/lint/diff gates after focused tests.

## Done criteria
Focused regression tests pass, typecheck exits 0, no new lint diagnostics, git diff check passes, and no changes beyond scope. Reviewer verifies current-checkout implementation and browser behavior before marking DONE.

## Maintenance notes
Cache keys must distinguish omitted locale and explicit locale, plus option sets. Keep memory bounded and invalid-input behavior unchanged.

## Final review
APPROVE — DONE on 2026-10-09. Implementation and regression coverage reviewed.
Combined reviewer gates passed: 115 tests in 14 files, library TypeScript,
changed-file lint (one existing warning), skill consistency, and diff checks.
Browser evidence and verification limits are recorded in plans/README.md under
the performance execution review. No API or CSS contract changes were required.

