# Plan 023: Use boolean fuzzy membership without computing scores

## Status
Priority: P2. Effort: S. Risk: LOW. Category: perf. Depends on: none.
Planned at: commit cfc8f2c, 2026-10-09. User approved implementation of all eight audit findings.

## Drift check
Run `git diff --stat cfc8f2c..HEAD -- packages/lib/src/lib/fzf.ts`; compare excerpts below to live code. Preserve unrelated working-tree Autocomplete changes.

## Why this matters and current state
`strCompare` calls `fuzzyMatch(text, value)` then returns `r !== null`; scorer enumerates matching starts, allocates indexes and sorts them. Autocomplete and MultiSelect invoke this on each query.

## Scope
Only modify: packages/lib/src/lib/fzf.ts; packages/lib/tests/fuzzy-find.test.ts. All other source, CSS, public exports, dependency versions, generated references and git operations are out of scope.

## Conventions and boundaries
React 19/TypeScript, relative imports in library, existing stable CSS selectors and public APIs stay intact. PRODUCT.md requires predictable form semantics and keyboard accessibility. Use Bun for commands. Match existing Vitest/RTL tests; no any or diagnostic suppression. Work in current checkout; preserve prior Autocomplete dynamicOption edits. Never stage, commit, push, switch branches, or create worktrees. Reviewer updates plans/README.md.

## Verification gates
Run focused tests listed below before edits (expected pass), then after adding regression coverage and implementing. Run `bunx tsc -p tsconfig.lib.json --noEmit` from packages/lib (exit 0). Run `bunx oxlint <changed TS paths>` from root (no new warnings/errors) and `git diff --check` (exit 0). Review matching canonical references in packages/lib/ai/docs; behavioral/API/CSS changes are out of scope. Reviewer runs combined tests, skill synchronization check and real-browser QA.

## STOP conditions
Stop and report if excerpts drift, public semantics/CSS changes are necessary, an out-of-scope file needs editing, or verification fails twice after reasonable fixes. Do not weaken tests. Record verification and maintenance concerns in executor report.

## Steps and test plan
1. Characterize fzf membership against exported fuzzyMatch across generated small strings, repeated characters, empty queries, casing/diacritics, array queries, duplicate IDs, key order, ifNotMatch callbacks, and no mutation. Preserve scorer scores exactly.
2. Add an internal boolean greedy subsequence matcher for FUZZY only. Keep normalization/other match modes and callback semantics untouched; do not short-circuit outer filter keys because callbacks/order may matter.
3. Verify equivalence tests and inspect the boolean path to confirm no score calculation/index arrays/sorting remain.

Focused verification before edits and after implementation: `bun run --cwd packages/lib test tests/fuzzy-find.test.ts tests/autocomplete-selection.test.tsx tests/multi-select.test.tsx` must exit 0 with all tests passed. Tests use Vitest/RTL, following the existing listed files. Add regression assertions before changing behavior. Run typecheck/lint/diff gates after focused tests.

## Done criteria
Focused regression tests pass, typecheck exits 0, no new lint diagnostics, git diff check passes, and no changes beyond scope. Reviewer verifies current-checkout implementation and browser behavior before marking DONE.

## Maintenance notes
Keep fuzzyMatch as the public scoring implementation. Future ranked search must explicitly use the scorer.

## Final review
APPROVE — DONE on 2026-10-09. Implementation and regression coverage reviewed.
Combined reviewer gates passed: 115 tests in 14 files, library TypeScript,
changed-file lint (one existing warning), skill consistency, and diff checks.
Browser evidence and verification limits are recorded in plans/README.md under
the performance execution review. No API or CSS contract changes were required.

