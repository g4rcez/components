# Plan 013: Make disabled Button anchors non-navigable

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the STOP conditions occurs, stop and report; do not improvise. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat b0b11ff..HEAD -- packages/lib/src/components/core/button/button.tsx packages/lib/ai/docs/Button.md packages/lib/tests/button-disabled-anchor.test.tsx`
> If an in-scope file changed since this plan was written, compare the excerpt below with live code; a mismatch is a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `b0b11ff`, 2026-10-05

## Why this matters

`Button` supports polymorphic rendering, including anchors. Its loading/disabled path removes the click handler and adds `aria-disabled`, but an anchor keeps its `href`, so the browser can still navigate through native link activation. A disabled or loading link must not navigate; normal enabled links and native buttons must remain unchanged.

## Current state

`packages/lib/src/components/core/button/button.tsx` implements both native and polymorphic buttons. The relevant current code is:

```tsx
const disabled = loading || props.disabled;
return (
    <Polymorph
        {...props}
        disabled={disabled}
        aria-busy={loading}
        aria-disabled={disabled}
        as={props.as ?? "button"}
        onClick={disabled ? undefined : props.onClick}
        className={css(buttonStyles.className({ size, rounded, theme }), className)}
    >
```

The `href` is still part of `props` passed to `Polymorph`; `disabled` is not a native anchor disabling mechanism. Component tests use Vitest and React Testing Library under `packages/lib/tests`; follow `button-styles.test.tsx` for library test conventions. The canonical public reference is `packages/lib/ai/docs/Button.md`.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Focused test | `pnpm --filter @g4rcez/components test tests/button-disabled-anchor.test.tsx` | All new regression cases pass |
| Existing style tests | `pnpm --filter @g4rcez/components test tests/button-styles.test.tsx` | Existing Button styling cases pass |
| Package build | `pnpm --filter @g4rcez/components build` | Exit 0; declarations and library output build |
| Lint | `pnpm --filter @g4rcez/components lint` | Exit 0 |
| Canonical doc sync | `pnpm components:skills sync` then `pnpm components:skills check` | Sync completes; check reports no stale generated references |
| Sync regression | `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` | All sync checks pass |

## Scope

**In scope**:

- `packages/lib/src/components/core/button/button.tsx`
- `packages/lib/tests/button-disabled-anchor.test.tsx` (create)
- `packages/lib/ai/docs/Button.md`
- Generated skill copies only through the documented sync command.

**Out of scope**:

- Other polymorphic components or changing the generic `Polymorph` contract.
- Changing enabled-anchor behavior, button styling, or navigation policy outside disabled/loading states.
- Editing generated skill copies by hand.

## Git workflow

- Work in the current branch. Do not create/switch branches or worktrees.
- Before implementation, run `git diff --cached --quiet --`. If staged changes exist, stop and list their paths for the user.
- Preserve all pre-existing unstaged and untracked work. Do not stage, commit, push, or open a PR.

## Steps

### Step 1: Add focused disabled-anchor regression tests

Create a Vitest/Testing Library test covering `as="a"` with `href` under both `disabled` and `loading`, plus an enabled anchor and a native disabled button. Verify disabled/loading anchors expose no navigable `href`, remain marked disabled/busy as appropriate, and do not invoke activation handlers; verify the enabled anchor retains its URL and handler. Do not rely solely on `aria-disabled` or a removed click callback as proof of inert navigation.

**Verify**: `pnpm --filter @g4rcez/components test tests/button-disabled-anchor.test.tsx` → all cases pass.

### Step 2: Remove anchor navigation while unavailable

In `button.tsx`, preserve the existing polymorphic API, but when the rendered element is an anchor and `loading || disabled` is true, omit its navigable `href` while retaining the disabled/busy state. Keep the native button `disabled` behavior and enabled anchor `href` behavior unchanged. Do not add synthetic keyboard handlers that duplicate native semantics.

**Verify**: `pnpm --filter @g4rcez/components test tests/button-disabled-anchor.test.tsx tests/button-styles.test.tsx` → all focused tests pass.

### Step 3: Update the canonical Button reference and validate

Review `packages/lib/ai/docs/Button.md`; document the disabled/loading anchor behavior if the current API description discusses polymorphic anchors. Run the canonical sync; never edit generated skill copies directly.

**Verify**: `pnpm components:skills sync && pnpm components:skills check` → both commands succeed; then `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` → pass.

## Test plan

- New file: `packages/lib/tests/button-disabled-anchor.test.tsx`.
- Cover disabled anchor, loading anchor, enabled anchor, and native disabled button behavior, including the actual `href` attribute.
- Use `packages/lib/tests/button-styles.test.tsx` as the structural pattern.
- Run the focused tests, package build, lint, and skill sync checks listed above.

## Done criteria

- [ ] Disabled/loading `Button as="a"` cannot navigate through its `href`; enabled links retain existing behavior.
- [ ] New regression tests and existing Button style tests pass.
- [ ] Package build and lint exit 0.
- [ ] Canonical Button reference and generated skill copies are synchronized.
- [ ] No files outside the in-scope list are changed; status row is updated.

## STOP conditions

- The current Button implementation no longer matches the excerpt or the polymorphic layer cannot omit `href` without changing enabled-anchor behavior.
- A repository contract explicitly requires a disabled anchor to retain a navigable URL.
- Fix requires modifying `Polymorph` or any out-of-scope component.
- Any focused verification fails twice after a reasonable correction attempt.

## Maintenance notes

Review future changes to polymorphic rendering and URL props against native anchor activation, including keyboard and context-menu activation. Do not treat `aria-disabled` alone as an interaction guard.
