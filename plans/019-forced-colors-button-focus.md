# Plan 019: Preserve Button focus indication in forced-colors mode

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the STOP conditions occurs, stop and report; do not improvise. Obtain explicit maintainer approval before any library build that validates source CSS changes. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat b0b11ff..HEAD -- packages/lib/src/components/core/button/button.css packages/lib/ai/docs/Button.md packages/docs/e2e/forced-colors-focus.spec.ts`
> If an in-scope file changed since this plan was written, compare the excerpt below with live code; a mismatch is a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `b0b11ff`, 2026-10-05

## Why this matters

Button's visible focus ring is drawn only with `box-shadow`, while the component resets `outline` to zero. Browsers force `box-shadow` to `none` in forced-colors mode, so keyboard focus can become invisible. Restore a system-color outline specifically in forced-colors mode and prove it in Chromium's forced-color emulation.

## Current state

`packages/lib/src/components/core/button/button.css:1-25` currently contains:

```css
.__button {
    outline: 0;
    transition-property: color, background-color, border-color, opacity, box-shadow;
}

.__button:focus-visible {
    box-shadow: 0 0 0 var(--var-button-focus-ring-width, calc(var(--var-spacing-base) / 4)) var(--var-color-ring);
}
```

The MDN `forced-colors` reference states that `box-shadow` is forced to `none`, while `outline-color` is forced to a system color; its example restores focus with a system-color border. Source: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors. The existing transparent, nonzero outlines on Modal/Table/PageCalendar are not in this plan: forced colors replaces their outline color at paint time, so the audit evidence did not establish the same defect there.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Browser regression (includes build; requires approval) | `pnpm --filter docs test:e2e -- e2e/forced-colors-focus.spec.ts` | Button focus outline is visible under emulation |
| Library CSS build (requires approval) | `pnpm --filter @g4rcez/components build` | Exit 0 |
| Lint | `pnpm --filter @g4rcez/components lint` | Exit 0 |
| Canonical doc sync | `pnpm components:skills sync` then `pnpm components:skills check` | Sync completes; check reports no stale generated references |
| Sync regression | `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` | All sync checks pass |

## Scope

**In scope**:

- `packages/lib/src/components/core/button/button.css`
- `packages/docs/e2e/forced-colors-focus.spec.ts` (create)
- `packages/lib/ai/docs/Button.md` only if its focus behavior contract needs updating.
- Generated outputs only through approved build and documented sync commands.

**Out of scope**:

- Modal, Table, and PageCalendar focus outlines with nonzero outline widths.
- General focus-ring token changes or a redesign of Button variants.
- Editing generated files by hand.

## Git workflow

- Work in the current branch. Before implementation run `git diff --cached --quiet --`; if staged changes exist, stop and list paths.
- Preserve pre-existing work. Do not stage, commit, push, switch branches, or create a worktree.
- Obtain explicit maintainer approval before source CSS build validation; the E2E command also invokes a build and requires the same approval.

## Steps

### Step 1: Add a forced-colors browser regression

Create a Playwright test following `packages/docs/e2e/docs-shell.spec.ts`. Navigate to `/docs/buttons`, focus a visible Button with the keyboard, and enable `page.emulateMedia({ forcedColors: "active" })`. Assert the focused button has a nonzero solid outline in a system color and does not rely on a box shadow. Also confirm the button is still visibly identifiable under the emulated palette.

**Verify**: `pnpm --filter docs test:e2e -- e2e/forced-colors-focus.spec.ts` → focused Button has a visible outline (run only after build approval).

### Step 2: Add the system-color focus fallback

In `button.css`, add a narrowly scoped `@media (forced-colors: active)` rule for `.__button:focus-visible` that restores a nonzero `outline` using an appropriate CSS system color (for example `ButtonText`) and disables the shadow-only dependency. Keep normal-color styling unchanged.

**Verify**: `pnpm --filter docs test:e2e -- e2e/forced-colors-focus.spec.ts` → computed outline style/width/color pass under emulation (run only after build approval).

### Step 3: Review docs and validate

Review the canonical Button reference; document the forced-colors fallback only if the reference currently specifies focus styling. Obtain build approval, build the library, sync the canonical source, and run the regression checks.

**Verify**: `pnpm --filter @g4rcez/components build` → exit 0; `pnpm components:skills sync && pnpm components:skills check` → both succeed; `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` → pass.

## Test plan

- Add `packages/docs/e2e/forced-colors-focus.spec.ts`.
- Cover keyboard focus on an actual Button in the docs page with forced-colors emulation; assert a real outline, not only a changed computed `box-shadow`.
- Run the browser test after build approval, plus library lint and skill sync checks.

## Done criteria

- [x] Button keyboard focus remains visible in forced-colors mode through a system-color outline.
- [x] Normal focus styling is unchanged.
- [x] Browser regression, approved library build, lint, and skill sync checks pass.
- [x] No unrelated focus styles are changed; no generated file is edited by hand.
- [x] No files outside the in-scope list are changed; status row is updated.

## STOP conditions

- Button focus styling no longer matches the excerpt.
- Browser emulation does not support forced colors and no equivalent browser test is available; report this instead of treating a source assertion as proof.
- A fix requires changing the global ring token or any explicitly out-of-scope outline.
- Build approval has not been received; do not run build or the E2E command that invokes it.
- Any focused verification fails twice after a reasonable correction attempt.

## Maintenance notes

Review `outline: 0` and box-shadow-only focus changes against forced-colors behavior. Keep the fallback scoped to the affected Button selector; do not add broad forced-color overrides to components that already retain a real outline.
