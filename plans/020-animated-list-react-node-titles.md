# Plan 020: Preserve ReactNode titles and descriptions in AnimatedList

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the STOP conditions occurs, stop and report; do not improvise. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat b0b11ff..HEAD -- packages/lib/src/components/display/list/list.tsx packages/lib/ai/docs/AnimatedList.md packages/lib/ai/docs/List.md packages/lib/tests/list-a11y.test.tsx`
> If an in-scope file changed since this plan was written, compare the excerpt below with live code; a mismatch is a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `b0b11ff`, 2026-10-05

## Why this matters

AnimatedList accepts `Label`/ReactNode values for item title and description, but stringifies titles for the modal and action `aria-label`; React elements can become `[object Object]`. The row button's explicit label also replaces its rendered description. Preserve ReactNode rendering, use visible content as the accessible source, and retain translated action wording when a plain text title is available.

## Current state

`packages/lib/src/components/display/list/list.tsx` declares `title` and `description` as `Label`, but currently does:

```tsx
const ariaDescription = typeof item?.description === "string" ? item.description : undefined;
const title = item ? String(item.title) : translations.listCloseDetails;
...
<Modal title={title} ariaTitle={title} ariaDescription={ariaDescription}>
...
<button aria-label={translations.listOpenDetails(String(item.title))}>
    <h3>{item.title}</h3>
    <p>{item.description}</p>
</button>
```

The avatar button uses the same `String(item.title)` label. The existing Modal accepts a visible `Label` title and derives its dialog name from the rendered title heading (`modal.tsx:140`, `509`); its `ariaDescription` is a string. Canonical references are `packages/lib/ai/docs/AnimatedList.md` and `List.md`. Follow the existing accessibility test pattern in `packages/lib/tests/list-a11y.test.tsx`.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Focused regression | `pnpm --filter @g4rcez/components test tests/list-a11y.test.tsx` | ReactNode title/description naming cases pass |
| Package build | `pnpm --filter @g4rcez/components build` | Exit 0 |
| Lint | `pnpm --filter @g4rcez/components lint` | Exit 0 |
| Canonical doc sync | `pnpm components:skills sync` then `pnpm components:skills check` | Sync completes; check reports no stale generated references |
| Sync regression | `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` | All sync checks pass |

## Scope

**In scope**:

- `packages/lib/src/components/display/list/list.tsx`
- `packages/lib/tests/list-a11y.test.tsx`
- `packages/lib/ai/docs/AnimatedList.md`
- `packages/lib/ai/docs/List.md`
- Generated skill copies only through the documented sync command.

**Out of scope**:

- Changing Modal's accessible-name API or the public `Label` type.
- Coercing arbitrary React elements to text, serializing JSX, or parsing element trees.
- Changing list selection, animation, or detail-dismissal behavior.
- Editing generated skill copies by hand.

## Git workflow

- Work in the current branch. Before implementation run `git diff --cached --quiet --`; if staged changes exist, stop and list paths.
- Preserve pre-existing changes. Do not stage, commit, push, switch branches, or create a worktree.

## Steps

### Step 1: Add ReactNode accessibility regression cases

Extend `list-a11y.test.tsx` with a title and description rendered as nested React elements. Open details and assert the visible modal title contains the actual rendered text, the dialog has that title as its accessible name, and neither the visible UI nor accessible names contain `[object Object]`. Verify the row action's accessible name/description uses rendered text when `titleText` is absent; with `titleText` supplied, verify the existing localized `listOpenDetails` action name uses that text. Confirm the avatar-only action is named from the visible title, and retain string-title localization behavior.

**Verify**: `pnpm --filter @g4rcez/components test tests/list-a11y.test.tsx` → all old and new cases pass.

### Step 2: Keep ReactNode values rendered and name actions without coercion

In `FloatItem`, pass `item.title` to `Modal` unchanged so its visible heading supplies the dialog name through the existing `aria-labelledby` behavior. Keep non-string descriptions rendered in the modal body; pass `ariaDescription` only when a genuine string alternative exists. Add an optional `titleText?: string` plain-text alternative to the item props for complex titles whose action label needs explicit text. For row actions, do not use `String()` on ReactNode values: use the existing localized `listOpenDetails` text with a string title or `titleText`; otherwise derive the action name from stable IDs on the rendered title and description. Name avatar-only actions from the rendered title. Do not add hard-coded English text.

**Verify**: `pnpm --filter @g4rcez/components test tests/list-a11y.test.tsx` → string and ReactNode cases expose meaningful computed names/descriptions.

### Step 3: Update canonical docs and validate

Review the AnimatedList/List references and clarify that title/description accept ReactNode and that complex accessible action text should be supplied as plain text only where the visual content cannot provide it. Sync generated references through the project command.

**Verify**: `pnpm components:skills sync && pnpm components:skills check` → both succeed; `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` → pass.

## Test plan

- Extend `packages/lib/tests/list-a11y.test.tsx` (do not create duplicate list accessibility suites).
- Cover ReactNode heading/description, computed dialog name, row-button name/description, avatar button name, and string-title translated action text.
- Run package build and lint after focused tests.

## Done criteria

- [x] ReactNode title is rendered without coercion and names the details dialog from visible content.
- [x] ReactNode description remains present and accessible; no explicit `aria-label` discards its text.
- [x] No user-visible or accessible `[object Object]` string remains for ReactNode titles.
- [x] String-title translation behavior and list selection flow remain unchanged.
- [x] Focused tests, package build, lint, and skill sync checks pass; canonical refs are accurate.
- [x] No files outside the in-scope list are changed; status row is updated.

## STOP conditions

- `Modal` no longer derives its name from a visible `Label` title or its API requires changes outside scope.
- A complex title cannot be named from visible rendered content and solving it requires arbitrary ReactNode serialization; stop and report the precise consumer-facing text-alternative choice needed.
- The existing test suite shows a deliberate contract that requires a translated action label even for arbitrary ReactNode titles; do not replace it with a misleading label.
- Any focused verification fails twice after a reasonable correction attempt.

## Maintenance notes

Do not use `String()` as a ReactNode-to-text conversion. When ReactNode content is used for accessible names, prefer the actual rendered heading/description IDs. Keep any explicit plain-text alternative separate from presentation content and pass it through existing translation functions where applicable.
