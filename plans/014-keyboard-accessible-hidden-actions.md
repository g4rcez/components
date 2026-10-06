# Plan 014: Make revealed row actions keyboard reachable

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the STOP conditions occurs, stop and report; do not improvise. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat b0b11ff..HEAD -- packages/lib/src/components/display/swipeable-list/swipeable-list.tsx packages/lib/src/components/table/row.tsx packages/lib/ai/docs/SwipeableList.md packages/lib/ai/docs/Table.md packages/lib/tests/swipeable-list.test.tsx packages/lib/tests/row-aside-keyboard.test.tsx`
> If an in-scope file changed since this plan was written, compare the excerpts below with live code; a mismatch is a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `b0b11ff`, 2026-10-05

## Why this matters

`SwipeableList` exposes action buttons only after a pointer swipe, and marks closed rails `aria-hidden` and `inert`; keyboard users therefore cannot reach the actions that are the row's primary secondary operation. The Table row aside has the same pointer-only reveal pattern and makes hidden descendants inert. Preserve swipe/hover behavior while making keyboard focus reveal actions before activation.

## Current state

`packages/lib/src/components/display/swipeable-list/swipeable-list.tsx` stores the open row/side and only changes it through drag handling. Closed action groups currently suppress their descendants:

```tsx
<div aria-hidden={openSide !== "left"} inert={openSide !== "left" ? true : undefined}>
    {leftActions.map((action) => (
        <SwipeActionButton ... focusable={openSide === "left"} side="left" />
    ))}
</div>
```

The right rail uses the equivalent condition. The action button's focusability is explicitly disabled while its rail is closed. In `packages/lib/src/components/table/row.tsx`, `RowAside` changes visibility only in `onMouseEnter`/`onMouseLeave` and sets `inert` plus `tabIndex={-1}` while hidden (lines 17–49). Existing focused tests are `packages/lib/tests/swipeable-list.test.tsx` and `packages/lib/tests/table-group-a11y.test.tsx`; use their Vitest/Testing Library conventions. Canonical references are `packages/lib/ai/docs/SwipeableList.md` and `packages/lib/ai/docs/Table.md`.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Swipe regression | `pnpm --filter @g4rcez/components test tests/swipeable-list.test.tsx` | All existing and new keyboard cases pass |
| Row aside regression | `pnpm --filter @g4rcez/components test tests/row-aside-keyboard.test.tsx` | Keyboard reveal and activation cases pass |
| Browser gesture regression | `env -u CI pnpm --filter docs exec playwright test e2e/swipeable-list-pointer.spec.ts` | Both action rails reveal and activate in Chromium |
| Package build | `pnpm --filter @g4rcez/components build` | Exit 0 |
| Lint | `pnpm --filter @g4rcez/components lint` | Exit 0 |
| Canonical doc sync | `pnpm components:skills sync` then `pnpm components:skills check` | Sync completes; check reports no stale generated references |
| Sync regression | `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` | All sync checks pass |

## Scope

**In scope**:

- `packages/lib/src/components/display/swipeable-list/swipeable-list.tsx`
- `packages/lib/src/components/table/row.tsx`
- `packages/lib/tests/swipeable-list.test.tsx`
- `packages/lib/tests/row-aside-keyboard.test.tsx` (create)
- `packages/lib/ai/docs/SwipeableList.md`
- `packages/lib/ai/docs/Table.md`
- `packages/docs/e2e/swipeable-list-pointer.spec.ts` (real-browser gesture coverage because JSDOM does not exercise Motion pointer drags).
- Generated skill copies only through the documented sync command.

**Out of scope**:

- Changing the pointer gesture thresholds, action payload API, virtual-list behavior, or table data model.
- Replacing swipe rails with a menu or adding new translation keys.
- Making hidden actions focusable without revealing them on focus.
- Editing generated skill copies by hand.

## Git workflow

- Work in the current branch. Do not create/switch branches or worktrees.
- Before implementation, run `git diff --cached --quiet --`. If staged changes exist, stop and list their paths for the user.
- Preserve pre-existing work. Do not stage, commit, push, or open a PR.

## Steps

### Step 1: Add keyboard-focus regression coverage

Extend the SwipeableList tests to tab to closed left- and right-side actions, confirm focus causes the correct rail to open, and activate an action once. Add `row-aside-keyboard.test.tsx` using the existing table accessibility tests as a pattern; tab into an aside action and confirm it is visible and activatable. Also verify that pointer swipe/hover still reveals the same actions and that leaving the focused action area does not hide a control while it retains focus.

**Verify**: `pnpm --filter @g4rcez/components test tests/swipeable-list.test.tsx tests/row-aside-keyboard.test.tsx` → all cases pass.

### Step 2: Reveal SwipeableList rails on keyboard focus

In `swipeable-list.tsx`, make closed action controls part of the sequential keyboard order instead of setting them `inert`, `aria-hidden`, or `tabIndex=-1`. When an action button receives focus, call the existing state/animation path to open its own row and side before it can be activated. Keep `aria-expanded`/visibility state coherent if already exposed, keep the inactive opposite rail from receiving focus, and preserve disabled-action semantics. Do not add a new action toggle or hard-coded text.

**Verify**: `pnpm --filter @g4rcez/components test tests/swipeable-list.test.tsx` → pointer and keyboard cases pass.

### Step 3: Reveal Table row asides on keyboard focus

In `RowAside`, reveal on focus entering its descendants as well as pointer hover. Do not set a subtree `inert` or parent `tabIndex=-1` state that prevents keyboard navigation. Keep the aside visible while focus remains within it, including when the pointer leaves; hide only after both focus and pointer have left. Preserve existing pointer entry/exit positioning.

**Verify**: `pnpm --filter @g4rcez/components test tests/row-aside-keyboard.test.tsx tests/table-group-a11y.test.tsx` → all cases pass.

### Step 4: Update canonical references and validate

Document that keyboard focus reveals row actions and explain the resulting tab behavior in the SwipeableList/Table references. Sync generated skill references; do not edit derived copies manually.

**Verify**: `pnpm components:skills sync && pnpm components:skills check` → both succeed; `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` → pass.

## Test plan

- Extend `packages/lib/tests/swipeable-list.test.tsx` for both action sides, focus visibility, and action activation.
- Create `packages/lib/tests/row-aside-keyboard.test.tsx` for focus reveal, pointer/focus interaction, and keyboard activation.
- Verify pointer swipes in Chromium with `swipeable-list-pointer.spec.ts`; JSDOM pointer events do not trigger Motion drag state. Use `table-group-a11y.test.tsx` as the Table test pattern.
- Run package build and lint after focused tests.

## Done criteria

- [ ] Keyboard can reach and activate closed SwipeableList actions; focus reveals the correct side and does not leave focused controls inert/hidden.
- [ ] Keyboard can reach and activate Table row-aside actions; pointer hover behavior remains intact.
- [ ] SwipeableList keyboard tests, Table tests, the Chromium pointer regression, package build, and lint pass.
- [ ] Canonical docs and generated skill references are synchronized.
- [ ] No files outside the in-scope list are changed; status row is updated.

## STOP conditions

- Current code no longer matches the excerpts, or an action rail depends on `inert` for a documented reason other than visual hiding.
- Revealing on focus would cause focus to be lost or would make controls unreachable without modifying an out-of-scope virtualizer.
- A source stylesheet change becomes necessary; obtain maintainer build approval before changing CSS or running the required package build.
- Any focused verification fails twice after a reasonable correction attempt.

## Maintenance notes

Review changes to row virtualization, focus order, and pointer exit handling together. A control must never remain `aria-hidden` or inert while it owns focus; maintain tests for both left/right rails and for a pointer leaving while keyboard focus remains.
