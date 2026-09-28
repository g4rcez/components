# Plan 001: Validate skills installer paths before recursive deletion

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 294542b..HEAD -- scripts/skills.mjs packages/lib/tests/skills-sync.test.ts`
> If either in-scope source file changed since this plan was written, compare
> the "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `294542b`, 2026-09-22

## Why this matters

The `install` command removes `.claude/skills/components-design-system` recursively
before copying the generated skill. The shared `validatePath` helper already
rejects symlinks in every existing path component, but `runInstall` does not call
it before `rmSync`. If an ancestor such as `.claude` or `.claude/skills` points
outside the repository, the recursive removal can operate on the external
location. Validate the source and destination path chains before any deletion,
while preserving the existing idempotent install behavior and missing-source
error messages.

## Current state

- `scripts/skills.mjs` — the repository's ESM skill install/sync/check CLI.
- `packages/lib/tests/skills-sync.test.ts` — Vitest coverage for source/destination
  validation, synchronization, and the normal install operation.
- `docs/superpowers/specs/2026-05-13-skills-installer-design.md` — the intended
  installer contract: Node built-ins only, idempotent copying, and a non-zero
  exit with an error on invalid or missing sources.

The existing validator uses `lstatSync`, walks from `repoRoot`, and rejects a
symlink at any existing component:

```js
// scripts/skills.mjs:45-58
function validatePath(path, label, expectedType) {
    const pathParts = relative(repoRoot, path).split(sep).filter(Boolean);
    let current = repoRoot;

    for (const [index, part] of pathParts.entries()) {
        current = join(current, part);
        const stat = getStat(current);
        if (!stat) return undefined;
        if (stat.isSymbolicLink()) {
            throw new Error(`${label} contains symlink at ${toRelativePath(current)}`);
        }
        if (index < pathParts.length - 1 && !stat.isDirectory()) {
            throw new Error(`${label} parent is not a directory at ${toRelativePath(current)}`);
        }
    }
    // ... final-type validation follows
}
```

`runInstall` currently checks only existence with `existsSync`, then deletes
without validating the destination path:

```js
// scripts/skills.mjs:240-265
function runInstall() {
    const sourceSkill = join(packageAi, "SKILL.md");
    const sourceDocs = join(packageAi, "docs");

    if (!existsSync(packageAi)) { /* error and exit */ }
    if (!existsSync(sourceSkill)) { /* error and exit */ }
    if (!existsSync(sourceDocs)) { /* error and exit */ }

    rmSync(installDestination, { recursive: true, force: true });
    mkdirSync(join(installDestination, "docs"), { recursive: true });
    cpSync(sourceSkill, join(installDestination, "SKILL.md"));
    cpSync(sourceDocs, join(installDestination, "docs"), { recursive: true });
}
```

The existing fixture creates the source tree and copies the script into a
throwaway root (`packages/lib/tests/skills-sync.test.ts:50-72`). The existing
install test checks successful copying (`:239-252`), while the symlink tests
currently cover `sync` destinations, not an install ancestor (`:232-238` and
`:245-265`).

Follow the existing ESM/Node built-in style. Do not add a dependency, replace
`lstatSync` with `statSync`, or weaken the existing `sync`/`check` validation.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Syntax check | `pnpm exec node --check scripts/skills.mjs` | Exit 0 and no output |
| Focused regression tests | `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` | All tests pass, including the new install symlink test |
| Managed-copy integrity | `pnpm components:skills check` | `check passed: managed files are synchronized` |
| Formatting | `pnpm exec oxfmt --check scripts/skills.mjs packages/lib/tests/skills-sync.test.ts` | All matched files use the correct format |

## Scope

**In scope** (the only implementation files to modify):

- `scripts/skills.mjs`
- `packages/lib/tests/skills-sync.test.ts`
- `plans/README.md` — update only this plan's status row after completion.

**Out of scope**:

- `scripts/skills.mjs` `sync` and `check` semantics, except for shared helper
  reuse needed by the installer preflight.
- Any package dependency, lockfile, generated skill copy, or documentation
  wording change.
- Any change to the external output paths or the public install command.

## Git workflow

- Work in the currently checked-out branch. Do not create or switch branches or
  worktrees.
- Before implementation, run `git diff --cached --quiet --`. If it reports
  staged changes, stop, list the staged paths, and ask the user to commit them.
- Preserve all pre-existing unstaged and untracked work. Never revert, delete,
  stage, or overwrite user-owned changes.
- Do not stage, commit, push, or open a pull request.

## Steps

### Step 1: Add an install preflight using the existing validator

In `scripts/skills.mjs`, validate every source and destination path chain before
`rmSync` can run. The preflight must cover:

1. `packageAi` as an existing regular directory.
2. `sourceSkill` as an existing regular file.
3. `sourceDocs` as an existing regular directory.
4. `installDestination` as either absent or a regular directory tree whose
   existing ancestors contain no symlinks. The validator must reject a final
   symlink and a symlink ancestor before deletion.

Use `validatePath`/`getStat` rather than adding a second symlink checker. Keep
the current missing-source messages and exit status for absent source paths.
If an existing install destination is a file or a symlink, fail before any
recursive deletion. The normal case where the final destination does not yet
exist must remain valid because `mkdirSync(..., { recursive: true })` creates
it afterward.

**Verify**: `pnpm exec node --check scripts/skills.mjs` → exit 0.

### Step 2: Add an install ancestor-symlink regression test

In `packages/lib/tests/skills-sync.test.ts`, add a test beside the existing
install test. Use the existing `createFixture`, `run`, `roots`, and Node fs
helpers. Create a temporary external directory with a sentinel file, replace
the fixture's `.claude` directory with a symlink to that external directory,
run `install`, and assert:

- the process exits non-zero;
- stderr identifies a destination symlink/path validation failure;
- the external sentinel content is unchanged; and
- the installer did not create or overwrite managed files through the link.

Also retain the existing successful install test. If the implementation adds a
source-path preflight, add a focused source-ancestor symlink case only if it
can be expressed with the existing fixture helpers without duplicating the
sync tests.

**Verify**: `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` → all tests pass, including the new regression case.

### Step 3: Run integrity and scope checks

Run the commands in the table above. Review `git diff -- scripts/skills.mjs
packages/lib/tests/skills-sync.test.ts` and confirm every hunk is limited to
pre-deletion validation and its regression coverage.

**Verify**: `pnpm components:skills check` → managed copies are synchronized;
`git diff --check -- scripts/skills.mjs packages/lib/tests/skills-sync.test.ts`
→ no whitespace errors.

## Test plan

- Extend `packages/lib/tests/skills-sync.test.ts`, following its existing
  disposable-fixture and external-sentinel patterns.
- Cover a symlinked destination ancestor before deletion, the existing normal
  install path, and the existing missing-source/sync symlink cases.
- Do not add a new test framework or install a filesystem package.
- Verification: `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts`
  must pass with the new regression test.

## Done criteria

- [ ] `runInstall` validates source and destination path chains before `rmSync`.
- [ ] A symlinked `.claude` or `.claude/skills` ancestor causes a non-zero exit
  without changing the external sentinel.
- [ ] The normal install fixture still passes.
- [ ] `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` exits 0.
- [ ] `pnpm components:skills check` exits 0.
- [ ] `pnpm exec oxfmt --check scripts/skills.mjs packages/lib/tests/skills-sync.test.ts` exits 0.
- [ ] No implementation files outside the in-scope list are modified.
- [ ] `plans/README.md` status row is updated.

## STOP conditions

Stop and report instead of improvising if:

- `validatePath` no longer walks existing ancestors or its error contract has
  changed from the excerpt above.
- The destination is intentionally allowed to be a symlink by a documented
  repository decision; do not weaken the safety check without maintainer input.
- Protecting against a time-of-check/time-of-use race requires a new dependency
  or a broader filesystem rewrite.
- The test needs to write outside its disposable temporary directory to prove
  safety.
- Any verification failure persists after one focused correction attempt.

## Maintenance notes

Future installer destinations must also pass the same preflight before any
recursive removal. Reviewers should look for new `rmSync(..., { recursive:
true })` calls that operate on repository-derived paths without `lstatSync`
ancestor validation. This plan does not address concurrent filesystem races or
make symlinked installations opt-in; those are separate design decisions.
