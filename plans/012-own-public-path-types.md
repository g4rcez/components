# Plan 012: Keep public declaration types independent of invalid third-party declarations

## Status

- Priority: P1
- Effort: M
- Risk: MED
- Category: bug
- Depends on: declaration layout implementation in 006; both are verified together
- Planned at: commit `e525534`, 2026-09-28, during approved unstaged execution
- Authorization: user explicitly selected “Fix the dependency boundary too” when presented with the existing sidekicker strict-type blocker.

## Why this matters

The corrected package declaration layout exposes an existing dependency defect when consumers disable skipLibCheck. sidekicker 0.1.10's declarations import missing ts-toolbelt and use NaN$1 as a value when it is only a type. Do not suppress these diagnostics or weaken the full consumer check. Own the tiny type contracts needed by this library while retaining runtime sidekicker behavior.

## Current state

- `packages/lib/src/components/form/file-upload/file-upload.tsx:18` imports `Override` from sidekicker; `packages/lib/src/types.ts:7` already defines the identical `Omit<Source, keyof New> & New`.
- `packages/lib/src/components/table/filter.tsx:5,37` imports AllPaths and exposes it as FilterConfig.name.
- `packages/lib/src/components/table/table-lib.ts:4,73–76` imports AllPaths for column paths and cell props.
- `packages/lib/src/hooks/use-form.ts:5,262` imports AllPaths alongside runtime getPath/Is and uses it for field names.
- `packages/lib/src/lib/fns.ts:1,32` imports AllPaths to constrain public path(obj, path).
- Installed sidekicker's AllPaths has a ParentPath generic, primitive leaves, unknown/any arbitrary paths, bracket notation for arrays/tuples, dot notation for object string keys and distributed union behavior. Tuple recursion uses T[number], not per-index values. Objects with non-string keys fall back to the parent; this includes Date because it has a symbol key. Existing public Walk differs and must not substitute.
- Actual isolated strict compiler probes: Button named and both wildcard forms compile without sidekicker. Root, FileUpload and Table each produce the same two external errors. New full package-types.test.ts must remain strict and cover the entire public surface.

## Scope

Only modify the five source files above, add `packages/lib/src/lib/path-types.ts`, extend `packages/lib/tests/package-types.test.ts`, and update existing README maintenance guidance. Review canonical Table/Form/FileUpload references, changing them only if meaningful guidance changes. Do not change runtime behavior, dependency versions, lockfile, public export conditions, validation strictness or unrelated source. Do not add a new named root API just for AllPaths: keep its module private.

## Steps

1. Independently implement the established AllPaths consumer contract locally with small private helpers. Preserve the exact listed semantics and ParentPath argument. The installed dependency's package metadata and LICENSE disagree (MIT versus GPLv3), so do not copy its implementation or assert a license resolution. Avoid unrelated type utilities.
2. Reuse local Override for FileUpload. Migrate all four exposed AllPaths imports to the private local module. Retain runtime getPath/Is and other sidekicker usage. Inspect emitted declarations for inferred third-party edges as well as explicit imports.
3. Extend the existing published consumer compilation regression with accepted and rejected nested object, bracket-array, tuple, optional and union paths through path/createColumns/useForm, plus FileUpload's native/custom prop boundary. Full compile uses skipLibCheck:false. Do not cast away errors or filter dependency diagnostics.
4. Compare local AllPaths with installed original in a throwaway type-equivalence probe across representative edge cases. That auxiliary comparison may skip invalid dependency implementation checks, but is not a substitute for the strict published-consumer gate.
5. Rebuild, run focused type/component tests, then review references and update existing README after proof. Remove throwaway files.

## Commands and done criteria

- `npm run build` from packages/lib (installed tools, no auto-install) exits 0.
- `node node_modules/vitest/vitest.mjs run tests/package-types.test.ts tests/fns.test.ts tests/table.test.ts tests/table-properties.test.tsx tests/table-filter-a11y.test.tsx tests/file-upload-a11y.test.tsx tests/form-contracts.test.tsx` from packages/lib passes.
- A real consumer imports root, FileUpload, Table, useForm and public path helpers with strict:true and skipLibCheck:false and produces zero diagnostics; invalid path examples are rejected.
- Native/wildcard declaration targets and runtime export targets remain compatible with baseline.
- No emitted public declaration imports sidekicker; runtime bundles may still use it.
- Equivalence probe passes for primitive, optional, union, unknown/any, arrays/tuples and ParentPath cases.

## Conventions and safety

Library uses relative imports and local exported prop types. Tests use Vitest and consumer-visible acceptance/rejection, not text snapshots. PRODUCT.md requires stable type-safe component contracts and familiar platform behavior. Advisor is read-only for source; assigned executor edits current main checkout. Staged gate passed; preserve all existing plan 004–011 changes. Never stage, commit, push, create branches/worktrees, reset, stash or overwrite other work. Reviewer maintains plans/README.md.

## STOP conditions

Stop if the local type cannot preserve existing semantics, a runtime change is needed, dependency installation/upgrades become necessary, or strict compilation reveals another unrelated dependency defect. Report it before widening scope. Do not weaken strict checks to claim completion.

## Maintenance

Keep public path constraints owned by this package and behaviorally checked. Runtime helper dependencies must not leak unneeded type-only imports into published declaration graphs. Review new exported inferred types for accidental reintroduction.

## Execution outcome

The independent private implementation passed 70 auxiliary equivalence cases
reported by the executor. Reviewer full consumer compilation with
`strict: true` and `skipLibCheck: false` passes with no filtered diagnostics,
including all public imports and accepted/rejected path and FileUpload cases.
Runtime sidekicker use and dependency versions are unchanged. No new named root
type API was added. Canonical Table, Form and FileUpload references were reviewed
and intentionally unchanged.
