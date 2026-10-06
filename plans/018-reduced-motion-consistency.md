# Plan 018: Respect reduced-motion preferences across animated components

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the STOP conditions occurs, stop and report; do not improvise. Obtain explicit maintainer approval before any library build that validates source CSS changes. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat b0b11ff..HEAD -- packages/lib/src/components/core/button/button.css packages/lib/src/components/core/tag/tag.css packages/lib/src/components/display/skeleton/skeleton.css packages/lib/src/components/display/spinner/spinner.css packages/lib/src/components/form/task-list/task-list.tsx packages/lib/ai/docs/Button.md packages/lib/ai/docs/Tag.md packages/lib/ai/docs/Skeleton.md packages/lib/ai/docs/Spinner.md packages/lib/ai/docs/TaskList.md packages/docs/e2e/reduced-motion.spec.ts`
> If an in-scope file changed since this plan was written, compare the excerpts below with live code; a mismatch is a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `b0b11ff`, 2026-10-05

## Why this matters

Several loading and completion states use perpetual CSS motion or nonessential Motion transforms without a consistent reduced-motion response. The affected paths include Button and Tag loading pulses, Skeleton pulsing, Spinner rotation, and TaskList's scale/rotation celebration. Honor the operating-system preference while keeping loading/completion information and task functionality available.

## Current state

- `button.css:33-36` and `tag.css:18-22` use infinite loading pulse animations.
- `skeleton.css:1-6` uses an infinite opacity pulse.
- `spinner.css:1-12` rotates continuously.
- `task-list.tsx:18-26` animates checked inputs with scale and rotation when all tasks become complete.
- Existing patterns include `MotionConfig reducedMotion="user"` in `tabs.tsx:118` and `useReducedMotion` in SwipeableList. Follow those patterns rather than introducing a second preference API. The TaskList animation is not in its CSS file; it is initiated through Motion's `useAnimate`.

The current motion rules include:

```css
.__button[data-loading="true"] {
    animation: var-button-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.__tag[data-loading="true"],
.__tag--theme-loading {
    animation: var-tag-pulse var(--var-tag-loading-pulse-duration) var(--var-tag-loading-pulse-timing) infinite;
}

.__skeleton {
    animation: skeleton-pulse var(--var-skeleton-pulse-duration) cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.__spinner {
    animation: var-spinner-spin var(--var-spinner-spin-duration) var(--var-motion-timing-linear) infinite;
}
```

TaskList currently calls `animate("input", { scale: [1, 1.35, 1], rotate: [0, 20, -20, 0] }, ...)` when all tasks are checked.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Browser regression (includes build; requires approval) | `pnpm --filter docs test:e2e -- e2e/reduced-motion.spec.ts` | All normal/reduced preference assertions pass |
| Library CSS build (requires approval) | `pnpm --filter @g4rcez/components build` | Exit 0 |
| Lint | `pnpm --filter @g4rcez/components lint` | Exit 0 |
| Canonical doc sync | `pnpm components:skills sync` then `pnpm components:skills check` | Sync completes; check reports no stale generated references |
| Sync regression | `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` | All sync checks pass |

## Scope

**In scope**:

- `packages/lib/src/components/core/button/button.css`
- `packages/lib/src/components/core/tag/tag.css`
- `packages/lib/src/components/display/skeleton/skeleton.css`
- `packages/lib/src/components/display/spinner/spinner.css`
- `packages/lib/src/components/form/task-list/task-list.tsx`
- `packages/docs/e2e/reduced-motion.spec.ts` (create)
- `packages/docs/src/app/docs/tags/page.tsx` (add a rendered loading Tag state to the demo and code sample).
- Canonical references for Button, Tag, Skeleton, Spinner, and TaskList where behavior needs documentation.
- Generated outputs only through approved build and documented sync commands.

Scope correction (2026-10-05): `/docs/tags` did not render a loading Tag. Add `<Tag loading>Loading</Tag>` to its Tag Themes example and code sample so the real-browser test exercises a valid component state instead of skipping the target.


**Out of scope**:

- Removing loading/status semantics, redesigning animations, or changing unrelated transition timing.
- Changing SwipeableList/Tabs, which already use reduced-motion-aware Motion behavior.
- Editing generated CSS metadata or skill copies by hand.

## Git workflow

- Work in the current branch. Before implementation run `git diff --cached --quiet --`; if staged changes exist, stop and list paths.
- Preserve pre-existing changes. Do not stage, commit, push, switch branches, or create a worktree.
- Obtain explicit maintainer approval before source CSS build validation; the docs E2E script also invokes a package build and therefore requires that approval.

## Steps

### Step 1: Add browser preference coverage

Create a Playwright E2E test following `packages/docs/e2e/docs-shell.spec.ts`. Visit `/docs/buttons`, `/docs/tags`, `/docs/skeleton`, `/docs/spinner`, and `/docs/task-list`. Explicitly emulate `reducedMotion: \"no-preference\"` and `reducedMotion: \"reduce\"`; verify loading/completion affordances still render in both modes, continuous animations stop or become non-moving under reduce, and TaskList does not apply scale/rotation while its checked state remains available. Test computed styles/observed behavior, not source text.

**Verify**: `pnpm --filter docs test:e2e -- e2e/reduced-motion.spec.ts` → both media-preference modes pass (run only after build approval).

### Step 2: Add the CSS reduced-motion policy

For the four CSS-driven targets, add narrowly scoped `@media (prefers-reduced-motion: reduce)` rules that remove perpetual pulse/rotation and avoid unnecessary transitions while preserving static state indicators. Do not replace one continuous animation with another. Ensure normal-motion styling is unchanged.

**Verify**: `pnpm --filter docs test:e2e -- e2e/reduced-motion.spec.ts` → CSS-driven animations stop under reduced motion and remain in normal mode (run only after build approval).

### Step 3: Gate TaskList's Motion animation

Use Motion's existing `useReducedMotion` hook and skip the nonessential scale/rotation sequence when the preference is active. Keep task state updates and completion semantics unchanged; do not suppress the checked-state update or focus behavior.

**Verify**: `pnpm --filter docs test:e2e -- e2e/reduced-motion.spec.ts` → TaskList state completes without motion under reduce and still works under normal preference (run only after build approval).

### Step 4: Review canonical docs and validate

Review canonical component references and document reduced-motion behavior if the current public description covers animation/loading states. Obtain build approval, build the library, then sync references without editing derived copies directly.

**Verify**: `pnpm --filter @g4rcez/components build` → exit 0; `pnpm components:skills sync && pnpm components:skills check` → both succeed; `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` → pass.

## Test plan

- Add `packages/docs/e2e/reduced-motion.spec.ts` using `page.emulateMedia({ reducedMotion: "reduce" })` and the existing docs component pages.
- Cover Button, Tag, Skeleton, Spinner, and TaskList with normal and reduced motion settings.
- Assert user-visible state remains while motion is removed; do not assert that an implementation-specific animation name is absent if a computed motion/visibility assertion can be used.
- Run the E2E test after build approval, then lint and skill sync checks.

## Done criteria

- [x] All identified infinite CSS animations stop under `prefers-reduced-motion: reduce`.
- [x] TaskList completion works without scale/rotation under reduced motion; checked state remains visible.
- [x] Normal-motion behavior remains unchanged and both E2E preference modes pass.
- [x] Approved library build, lint, and skill sync checks pass.
- [x] Canonical references remain accurate; generated files were not edited manually.
- [x] No files outside the in-scope list are changed; status row is updated.

## STOP conditions

- A targeted component no longer uses the cited motion behavior.
- Removing motion would also remove an essential status cue and the current component has no static equivalent; report before changing design.
- A docs route lacks a usable component state; do not silently skip that target.
- Build approval has not been received; do not run build or E2E command that invokes it.
- Any focused verification fails twice after a reasonable correction attempt.

## Maintenance notes

Review new infinite animations and completion celebrations against the same user preference. Keep status meaning separate from motion so future changes cannot make loading/completion undiscoverable for reduced-motion users.
