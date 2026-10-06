# Plan 017: Correct low-contrast theme token pairs

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the STOP conditions occurs, stop and report; do not improvise. Obtain explicit maintainer approval before any library build that validates source CSS changes. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat b0b11ff..HEAD -- packages/lib/src/styles/tokens.css packages/lib/ai/docs/theme-customization.md packages/lib/ai/docs/Button.md packages/lib/ai/docs/Tag.md packages/lib/ai/docs/Alert.md packages/lib/ai/docs/Notifications.md packages/lib/ai/docs/Autocomplete.md packages/docs/e2e/theme-contrast.spec.ts`
> If an in-scope file changed since this plan was written, compare the excerpts below with live code; a mismatch is a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `b0b11ff`, 2026-10-05

## Why this matters

Three audited foreground/background pairs used for text are below WCAG 2.1 AA normal-text contrast: the light warning pair is about 2.14:1, the dark autocomplete active option is about 1.62:1, and the dark secondary alert pair is about 1:1. These tokens feed real Button, Alert/Notification, Tag, and Autocomplete states. Correct the theme values while preserving the established semantic roles and verify actual rendered colors in both themes.

## Current state

`packages/lib/src/styles/tokens.css` defines the light warning pair:

```css
--var-color-warn: hsla(38, 92%, 50%);
--var-color-warn-foreground: hsla(0, 0%, 100%);
```

The dark theme defines these low-contrast pairs:

```css
--var-color-secondary: hsla(240, 5%, 96%);
--var-color-secondary-foreground: hsla(240, 5%, 96%);
--var-autocomplete-option-active-background: hsla(201, 49%, 22%);
--var-autocomplete-option-active-foreground: hsla(240, 6%, 10%);
```

Consumers verified in source include `button.css` warning buttons, `alert.css`/`notifications.css` secondary surfaces, and `autocomplete.css` active options. The measured contrast formula is `(Llighter + 0.05) / (Ldarker + 0.05)` after converting rendered sRGB channels to relative luminance. WCAG 2.1 AA requires at least 4.5:1 for normal text. Canonical theme/component references are under `packages/lib/ai/docs/`; generated token registry and skill outputs must not be edited by hand.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Library CSS build (requires approval) | `pnpm --filter @g4rcez/components build` | Exit 0; emitted theme/style artifacts reflect source token values |
| Docs browser suite (includes build; requires approval) | `pnpm --filter docs test:e2e -- e2e/theme-contrast.spec.ts` | New browser assertions pass in light and dark theme |
| Lint | `pnpm --filter @g4rcez/components lint` | Exit 0 |
| Canonical doc sync | `pnpm components:skills sync` then `pnpm components:skills check` | Sync completes; check reports no stale generated references |
| Sync regression | `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` | All sync checks pass |

## Scope

**In scope**:

- `packages/lib/src/styles/tokens.css`
- `packages/docs/e2e/theme-contrast.spec.ts` (create)
- Canonical references, only where the resulting color contract needs an update: `packages/lib/ai/docs/theme-customization.md`, `Button.md`, `Tag.md`, `Alert.md`, `Notifications.md`, `Autocomplete.md`
- Generated registry/skill outputs only through the project's build/sync commands.

**Out of scope**:

- A general color-token redesign, changing non-color tokens, or altering component state semantics.
- Changing typography or reducing text size to qualify for a lower contrast threshold.
- Adding a source-text assertion that merely pins HSL strings.
- Editing generated registry or skill copies by hand.

## Git workflow

- Work in the current branch. Before implementation run `git diff --cached --quiet --`; if staged changes exist, stop and list paths.
- Preserve pre-existing changes. Do not stage, commit, push, switch branches, or create a worktree.
- Before running the library build or docs E2E command (which invokes the library build), obtain explicit maintainer approval as required for source CSS contract changes.

## Steps

### Step 1: Add a rendered-color regression test

Create a Playwright test using `packages/docs/e2e/docs-shell.spec.ts` as the structural pattern. Visit `/docs/buttons`, `/docs/alert`, `/docs/notification`, and `/docs/autocomplete`, select the specific warning/secondary/active states, and test both light and dark themes. Read computed foreground and background colors from the rendered elements and calculate contrast from the actual browser values; assert at least 4.5:1 for the audited normal-size text. Do not parse source CSS or merely assert token strings. If an audited state has no existing interactive demo, stop and report the missing fixture rather than silently omitting it.

**Verify**: `pnpm --filter docs test:e2e -- e2e/theme-contrast.spec.ts` → all rendered token-pair assertions pass (run only after build approval).

### Step 2: Correct only the token values needed to meet contrast

Adjust per-theme foreground/background values for the three confirmed states. Preserve the semantic color roles and keep each pair readable in both light and dark themes. Before changing a shared token, inspect all its consumers listed above; if a value cannot be changed without damaging unrelated roles, stop and report rather than broadening into a token redesign. Re-run the browser assertions after each adjustment.

**Verify**: `pnpm --filter docs test:e2e -- e2e/theme-contrast.spec.ts` → every audited normal-text pair is at least 4.5:1 in the rendered app (run only after build approval).

### Step 3: Review canonical references and validate generated output

Review the theme guide and affected component references. Update only descriptions/examples whose documented appearance or override guidance changed. Obtain build approval, run the library build, then synchronize AI skill references; never edit generated output directly.

**Verify**: `pnpm --filter @g4rcez/components build` → exit 0; `pnpm components:skills sync && pnpm components:skills check` → both succeed; `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` → pass.

## Test plan

- Add `packages/docs/e2e/theme-contrast.spec.ts` against actual component examples.
- Cover the light warning foreground/background, dark secondary Alert/Notification foreground/background, and dark active Autocomplete option; assert WCAG AA 4.5:1 from computed sRGB colors.
- Exercise both theme modes with the existing docs theme switch or its established mechanism.
- Run docs E2E, package lint, and skill sync checks after authorized build.

## Done criteria

- [ ] All three audited token pairs render at least 4.5:1 for normal text in their applicable themes.
- [ ] Existing warning, secondary, and active-selection states retain their intended semantic meaning and remain distinguishable.
- [ ] Browser tests measure computed colors and pass; no source-string-only test is added.
- [ ] Approved library build, lint, and skill sync checks pass.
- [ ] Canonical docs are accurate; no generated file was manually edited.
- [ ] No files outside the in-scope list are changed; status row is updated.

## STOP conditions

- The live token values or consumers differ from the excerpts.
- A contrast correction requires a general token/API redesign or changes a consumer outside the listed roles.
- An existing docs example cannot render a target state; do not omit it or manufacture source-string proof.
- Build approval has not been received; do not run the CSS build or E2E script that invokes it.
- Any focused verification fails twice after a reasonable correction attempt.

## Maintenance notes

Review any change to the listed foreground/background tokens with computed contrast in both themes. Alpha colors must be composited against the actual rendered surface before calculating luminance. Keep a minimum 4.5:1 requirement for normal text and preserve the browser E2E test so later palette edits cannot silently regress these states.
