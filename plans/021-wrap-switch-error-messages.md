# Plan 021: Allow Switch error messages to wrap

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the STOP conditions occurs, stop and report; do not improvise. Obtain explicit maintainer approval before any library build that validates source CSS changes. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat b0b11ff..HEAD -- packages/lib/src/components/form/switch/switch.css packages/docs/src/app/docs/switch/page.tsx packages/lib/ai/docs/Switch.md packages/docs/e2e/switch-error-wrap.spec.ts`
> If an in-scope file changed since this plan was written, compare the excerpt below with live code; a mismatch is a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `b0b11ff`, 2026-10-05

## Why this matters

Switch error text is styled with `white-space: nowrap`, so a long validation message can overflow its container on narrow layouts instead of wrapping. Permit normal wrapping, including for long unbroken text, without changing the switch control or error association.

## Current state

`packages/lib/src/components/form/switch/switch.css:101-107` currently defines:

```css
.__switch__error {
    flex: 1 1 0%;
    margin-block-start: var(--var-switch-error-margin-block-start, calc(var(--var-spacing-base) * 0.25));
    color: var(--var-color-danger);
    font-size: var(--var-switch-error-font-size);
    white-space: nowrap;
}
```

The docs app already has an actual error-state Switch demo at `/docs/switch` (`packages/docs/src/app/docs/switch/page.tsx`, “Disabled and Error States”). Use the existing docs E2E style in `packages/docs/e2e/docs-shell.spec.ts`. The canonical component reference is `packages/lib/ai/docs/Switch.md`.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Browser regression (includes build; requires approval) | `pnpm --filter docs test:e2e -- e2e/switch-error-wrap.spec.ts` | Error text wraps at narrow viewport without page overflow |
| Library CSS build (requires approval) | `pnpm --filter @g4rcez/components build` | Exit 0 |
| Lint | `pnpm --filter @g4rcez/components lint` | Exit 0 |
| Canonical doc sync | `pnpm components:skills sync` then `pnpm components:skills check` | Sync completes; check reports no stale generated references |
| Sync regression | `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` | All sync checks pass |

## Scope

**In scope**:

- `packages/lib/src/components/form/switch/switch.css`
- `packages/docs/src/app/docs/switch/page.tsx` (update its existing error example to exercise wrapping)
- `packages/docs/e2e/switch-error-wrap.spec.ts` (create)
- `packages/lib/ai/docs/Switch.md` only if its layout contract needs documentation.
- Generated outputs only through approved build and documented sync commands.

**Out of scope**:

- Changing Switch error state semantics, text, ARIA association, or color.
- Changing the Switch label or control layout beyond what is required for wrapping.
- Editing generated output by hand.

## Git workflow

- Work in the current branch. Before implementation run `git diff --cached --quiet --`; if staged changes exist, stop and list paths.
- Preserve pre-existing changes. Do not stage, commit, push, switch branches, or create a worktree.
- Obtain explicit maintainer approval before source CSS build validation; the E2E command also invokes the package build.

## Steps

### Step 1: Add a narrow-viewport browser regression

Create a Playwright test following `docs-shell.spec.ts`. Visit `/docs/switch`, set a 320px viewport, and target the existing error-state Switch. Expand the demo's error string and corresponding code example to a representative long message so the test covers real component content. Assert the error text fits within its rendered box and the document has no horizontal overflow.

**Verify**: `pnpm --filter docs test:e2e -- e2e/switch-error-wrap.spec.ts` → error text wraps within its parent and `document.documentElement.scrollWidth <= window.innerWidth` (run only after build approval).

### Step 2: Permit word and sentence wrapping

In `switch.css`, remove the no-wrap constraint and allow long unbroken error text to wrap within the available inline size (use `overflow-wrap: anywhere` only if the browser test demonstrates it is needed). Do not change error font/color, spacing, or control state.

**Verify**: `pnpm --filter docs test:e2e -- e2e/switch-error-wrap.spec.ts` → narrow viewport assertion passes; existing error demo remains readable (run only after build approval).

### Step 3: Review canonical docs and validate

Review `Switch.md` and document the responsive wrapping behavior only if it describes layout constraints. Obtain build approval, run the library build, then sync canonical references.

**Verify**: `pnpm --filter @g4rcez/components build` → exit 0; `pnpm components:skills sync && pnpm components:skills check` → both succeed; `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` → pass.

## Test plan

- Add `packages/docs/e2e/switch-error-wrap.spec.ts` against the real docs Switch demo.
- Cover the narrow 320px viewport, the rendered error width, and document-level horizontal overflow; keep default-width appearance intact.
- Run the E2E test after build approval, then library lint and skill sync checks.

## Done criteria

- [x] Switch error messages wrap at narrow widths, including a long message.
- [x] No page-level horizontal overflow is introduced at the tested viewport.
- [x] Default layout/error styling remains intact; browser test passes.
- [x] Approved library build, lint, and skill sync checks pass.
- [x] No generated output is edited by hand; status row is updated.

## STOP conditions

- The current Switch error selector or docs route no longer matches the excerpt.
- Wrapping causes a measurable regression to the default layout that cannot be corrected within the listed CSS file.
- A fix requires changing markup, ARIA, or component props outside scope.
- Build approval has not been received; do not run build or the E2E command that invokes it.
- Any focused verification fails twice after a reasonable correction attempt.

## Maintenance notes

Keep error text readable at narrow widths and test long localized strings; translations are often longer than the English demo. Avoid reintroducing `white-space: nowrap` on validation or helper text without proving that overflow cannot occur.
