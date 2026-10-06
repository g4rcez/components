# Plan 015: Preserve and synchronize Input and Textarea error semantics

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the STOP conditions occurs, stop and report; do not improvise. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat b0b11ff..HEAD -- packages/lib/src/components/form/input/free-text.tsx packages/lib/src/components/form/input/input-field.tsx packages/lib/src/components/form/input/input.css packages/lib/ai/docs/Input.md packages/lib/ai/docs/Textarea.md packages/lib/tests/free-text-a11y.test.tsx`
> If an in-scope file changed since this plan was written, compare the excerpts below with live code; a mismatch is a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `b0b11ff`, 2026-10-05

## Why this matters

The shared free-text renderer is used by both Input and Textarea. It currently overwrites caller-provided `aria-invalid` and `aria-describedby`; it also reports only the custom-error state, while CSS visibly marks a native constraint-invalid field after interaction. Screen-reader descriptions can be lost and assistive state can disagree with the visible invalid state. Fix the shared contract once and verify both controls.

## Current state

`packages/lib/src/components/form/input/free-text.tsx` currently renders:

```tsx
<Render
    {...defaultProps}
    {...props}
    id={id}
    aria-invalid={!!error}
    aria-disabled={props.disabled}
    aria-readonly={props.readOnly}
    aria-describedby={error ? `${id}-error` : undefined}
    ref={mergeRefs(ref, inputRef) as unknown as React.Ref<Html>}
>
```

This replaces caller ARIA values. The internal error and feedback nodes have IDs `${ID}-error` and `${ID}-feedback` in `packages/lib/src/components/form/input/input-field.tsx:213-224`. `packages/lib/src/components/form/input/input.css:299-327` applies its native invalid styles after `data-initialized="true"` and blur, using `:invalid`. Follow existing React event/ref composition in this input package; preserve caller handlers and refs.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Focused regression | `pnpm --filter @g4rcez/components test tests/free-text-a11y.test.tsx` | Input and Textarea cases pass |
| Package build | `pnpm --filter @g4rcez/components build` | Exit 0 |
| Lint | `pnpm --filter @g4rcez/components lint` | Exit 0 |
| Canonical doc sync | `pnpm components:skills sync` then `pnpm components:skills check` | Sync completes; check reports no stale generated references |
| Sync regression | `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` | All sync checks pass |

## Scope

**In scope**:

- `packages/lib/src/components/form/input/free-text.tsx`
- `packages/lib/src/components/form/input/input-field.tsx` only if needed to expose existing error/feedback IDs.
- `packages/lib/src/components/form/input/input.css` only if the current native-invalid visual selector must be aligned with state.
- `packages/lib/tests/free-text-a11y.test.tsx` (create)
- `packages/lib/ai/docs/Input.md`
- `packages/lib/ai/docs/Textarea.md`
- Generated skill copies only through the documented sync command.

**Out of scope**:

- Changing native validation constraints, labels, error copy, or the visual design of errors.
- Changing Select or other form components.
- Editing generated skill copies by hand.

## Git workflow

- Work in the current branch. Before implementation run `git diff --cached --quiet --`; if staged changes exist, stop and list paths.
- Preserve all pre-existing changes. Do not stage, commit, push, switch branches, or create a worktree.

## Steps

### Step 1: Specify the ARIA precedence and regression cases

Add `free-text-a11y.test.tsx` using Vitest/Testing Library. Cover Input and Textarea with caller-provided `aria-describedby`, custom error, feedback, caller `aria-invalid`, required/native-invalid state before interaction, invalid state after blur, and a valid value after correction. The precedence must be deterministic: custom error is invalid; otherwise an interacted native-invalid field is invalid; otherwise preserve an explicit caller `aria-invalid`; otherwise omit the attribute for a valid/untouched field. Do not emit the string `"false"` solely because there is no error.

**Verify**: `pnpm --filter @g4rcez/components test tests/free-text-a11y.test.tsx` → all cases pass.

### Step 2: Compose descriptions and invalid state in the shared renderer

In `free-text.tsx`, merge whitespace-separated caller description IDs with applicable internal error and feedback IDs, de-duplicate IDs, and retain caller IDs. Use only internal IDs for nodes that actually contain error/feedback text. Compose caller `onBlur`/`onChange` handlers and update native validity state after the same interaction boundary used by the current `data-initialized` CSS. Preserve forwarded refs. Keep the precedence defined in Step 1 so custom/native invalid states cannot be hidden by a stale caller value.

If CSS is changed, keep its visible native-invalid state aligned with the exposed `aria-invalid` state; do not broaden the timing so untouched required fields appear invalid prematurely.
If `input.css` is changed, obtain explicit maintainer approval before running the required package build; do not run it without approval.

**Verify**: `pnpm --filter @g4rcez/components test tests/free-text-a11y.test.tsx` → description relationships and validity transitions pass for both controls.

### Step 3: Update canonical references and validate

Review Input and Textarea canonical docs; clarify that caller descriptions are preserved alongside error/feedback descriptions and that custom/native invalid states are exposed accessibly. Run skill synchronization without editing generated copies directly.

**Verify**: `pnpm components:skills sync && pnpm components:skills check` → both succeed; `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` → pass.

## Test plan

- Create `packages/lib/tests/free-text-a11y.test.tsx` with paired Input and Textarea cases.
- Assert computed `aria-describedby` token membership, `aria-invalid` precedence, and validity state transitions; do not test just implementation text or attribute existence.
- Run package build and lint after focused tests.

## Done criteria

- [ ] Caller description IDs survive and are combined with applicable internal feedback/error IDs.
- [ ] Custom and native invalid states agree with the visible invalid state after interaction; caller state is preserved when neither applies.
- [ ] Input and Textarea regression cases pass; package build and lint exit 0.
- [ ] Canonical docs and generated skill references are synchronized.
- [ ] No files outside the in-scope list are changed; status row is updated.

## STOP conditions

- The current `data-initialized` transition differs from this plan and the intended native-invalid boundary cannot be identified.
- A shared validity implementation changes native validation or requires modifying unrelated form controls.
- The error/feedback ID generation moves outside the listed files.
- Any focused verification fails twice after a reasonable correction attempt.

## Maintenance notes

Keep ARIA ID composition centralized in the shared free-text path so Input and Textarea do not drift. When error or feedback markup changes, update the description-token tests and ensure the nodes referenced by `aria-describedby` exist in the rendered control.
