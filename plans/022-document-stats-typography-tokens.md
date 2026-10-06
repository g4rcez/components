# Plan 022: Document Stats typography tokens

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the STOP conditions occurs, stop and report; do not improvise. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat b0b11ff..HEAD -- packages/lib/ai/docs/Stats.md`
> If an in-scope file changed since this plan was written, compare the excerpts below with live code; a mismatch is a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `b0b11ff`, 2026-10-05

## Why this matters

The Stats reference lists component tokens but omits the two typography CSS variables that its stylesheet reads and the generated token registry recognizes. Users who customize the component cannot discover those supported overrides from the canonical AI documentation. Add only the missing entries; do not edit generated registry output.

## Current state

`packages/lib/src/components/display/stats/stats.css:39-49` reads:

```css
.__stats__title { font-size: var(--var-stats-title-font-size); }
.__stats__value { font-size: var(--var-stats-value-font-size); }
```

`packages/lib/src/styles/theme-registry.generated.ts:626-640` includes `title-font-size` and `value-font-size` under `stats`. The canonical `packages/lib/ai/docs/Stats.md:43-52` token table currently lists background, border, rounded, shadow, and icon variables but omits `--var-stats-title-font-size` and `--var-stats-value-font-size`.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Canonical sync | `pnpm components:skills sync` | Derived references update from canonical source |
| Canonical check | `pnpm components:skills check` | No stale generated references |
| Sync regression | `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` | All sync checks pass |

## Scope

**In scope**:

- `packages/lib/ai/docs/Stats.md`
- Generated skill copies only through `pnpm components:skills sync`.

**Out of scope**:

- `stats.css`, generated theme registry, or any token implementation.
- Reclassifying tokens or changing their defaults.
- Editing derived skill files directly.

## Git workflow

- Work in the current branch. Before implementation run `git diff --cached --quiet --`; if staged changes exist, stop and list paths.
- Preserve pre-existing changes. Do not stage, commit, push, switch branches, or create a worktree.

## Steps

### Step 1: Update the canonical Stats token table

Add `--var-stats-title-font-size` and `--var-stats-value-font-size` to the “Tokens this component reads” table in `Stats.md`. Explain that they control the title and value font sizes and match the existing CSS variable naming. Do not modify `theme-registry.generated.ts`; it is already the generated source of truth for token enumeration.

**Verify**: `pnpm components:skills check` → the canonical doc and generated metadata are consistent after sync.

### Step 2: Synchronize and test the docs contract

Run the skills sync and check commands, then run the required sync test. Do not run a library build; this plan changes documentation only and does not change source CSS contracts.

**Verify**: `pnpm components:skills sync && pnpm components:skills check && pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` → every command exits 0.

## Test plan

- No component test is required because no runtime or token behavior changes.
- Run the repository-required `skills-sync.test.ts` to ensure canonical and derived references remain aligned.

## Done criteria

- [x] Stats canonical documentation lists both supported typography variables with accurate purposes.
- [x] Generated references are synchronized through the project command; no derived file was edited manually.
- [x] `components:skills check` and `skills-sync.test.ts` pass.
- [x] No files outside the in-scope list are changed; status row is updated.

## STOP conditions

- The live Stats CSS or theme registry no longer uses the two variables.
- The token table has moved or already lists the variables; do not duplicate entries.
- Updating the docs reveals an implementation/default mismatch; stop and report rather than changing source in this documentation-only plan.
- Any sync check fails twice after a reasonable correction attempt.

## Maintenance notes

When Stats adds or removes a CSS token, update the canonical token table and regenerate derived skill copies. The generated registry is maintained by the build pipeline and must not be manually edited.
