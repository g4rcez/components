# Plan 016: Give floating and role-based widgets accessible names

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the STOP conditions occurs, stop and report; do not improvise. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat b0b11ff..HEAD -- packages/lib/src/components/floating/dropdown/dropdown.tsx packages/lib/src/components/floating/expand/expand.tsx packages/lib/src/components/display/progress/progress.tsx packages/lib/src/components/display/tabs/tabs.tsx packages/lib/src/components/form/switch/switch.tsx packages/lib/ai/docs/Dropdown.md packages/lib/ai/docs/Expand.md packages/lib/ai/docs/Progress.md packages/lib/ai/docs/Tabs.md packages/lib/ai/docs/Switch.md packages/lib/tests/role-accessible-names.test.tsx`
> If an in-scope file changed since this plan was written, compare the excerpts below with live code; a mismatch is a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `b0b11ff`, 2026-10-05

## Why this matters

Several components expose dialog, progressbar, tablist, or switch semantics without a reliable accessible name in every supported state. Names should come from visible labels/headings when available, with standard `aria-label`/`aria-labelledby` forwarding for unnamed or icon-only cases. Do not invent English fallback labels; consumers must be able to provide localized names.

## Current state

- `packages/lib/src/components/floating/dropdown/dropdown.tsx`: `title` is optional, but the floating panel always points `aria-labelledby` at its heading ID. An empty optional title can therefore leave the dialog unnamed.
- `packages/lib/src/components/floating/expand/expand.tsx:48-80`: Floating UI assigns dialog semantics; the visible trigger contains `trigger`, but the dialog has no explicit label relationship.
- `packages/lib/src/components/display/progress/progress.tsx:33-48`: Radix renders the progressbar root without a supplied `aria-label`/`aria-labelledby`; percentage text is a child, which is not a dependable name for a progressbar.
- `packages/lib/src/components/display/tabs/tabs.tsx:126`: the `ul` has `role="tablist"` but no naming props.
- `packages/lib/src/components/form/switch/switch.tsx:70-108`: a visible child label is referenced by the switch button; however, incoming ARIA props are spread onto the hidden checkbox rather than the actual `role="switch"` button, so an icon-only/consumer-named switch has no direct name route.

Use the existing standard ARIA prop conventions and preserve native visible labels. Relevant current excerpts include:

```tsx
// Dropdown
aria-labelledby={headingId}
<h3 id={headingId}>{props.title}</h3>

// Expand
const role = useRole(context, { role: "dialog" });
...
<motion.div {...getFloatingProps()} ...>{children}</motion.div>

// Tabs
<ul role="tablist" onKeyDown={onKeyDown} ref={ref}>

// Switch
<button role="switch" aria-checked={checked} aria-labelledby={`${id}-label`} ...>
```

Canonical references are `packages/lib/ai/docs/{Dropdown,Expand,Progress,Tabs,Switch}.md`. Follow Vitest/Testing Library conventions in `packages/lib/tests/tabs.test.tsx` and `packages/lib/tests/progress-styles.test.tsx`.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Focused regression | `pnpm --filter @g4rcez/components test tests/role-accessible-names.test.tsx` | All widget accessible-name cases pass |
| Package build | `pnpm --filter @g4rcez/components build` | Exit 0 |
| Lint | `pnpm --filter @g4rcez/components lint` | Exit 0 |
| Canonical doc sync | `pnpm components:skills sync` then `pnpm components:skills check` | Sync completes; check reports no stale generated references |
| Sync regression | `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` | All sync checks pass |

## Scope

**In scope**:

- `packages/lib/src/components/floating/dropdown/dropdown.tsx`
- `packages/lib/src/components/floating/expand/expand.tsx`
- `packages/lib/src/components/display/progress/progress.tsx`
- `packages/lib/src/components/display/tabs/tabs.tsx`
- `packages/lib/src/components/form/switch/switch.tsx`
- `packages/lib/tests/role-accessible-names.test.tsx` (create)
- `packages/lib/ai/docs/Dropdown.md`, `Expand.md`, `Progress.md`, `Tabs.md`, and `Switch.md`
- Generated skill copies only through the documented sync command.

**Out of scope**:

- Adding hard-coded user-facing labels or changing localized visible copy.
- Changing tab keyboard navigation, progress calculations, switch checked state, or dropdown/expand dismissal behavior.
- Editing generated skill copies by hand.

## Git workflow

- Work in the current branch. Before implementation run `git diff --cached --quiet --`; if staged changes exist, stop and list paths.
- Preserve all pre-existing changes. Do not stage, commit, push, switch branches, or create a worktree.

## Steps

### Step 1: Add accessible-name regression tests

Create one focused test file that renders each role-bearing component in its existing supported states. Assert non-empty names for: Dropdown with a visible title and with an explicit ARIA name when title is absent; Expand dialog named by its visible trigger or an explicit label; Progress with a visible label and explicit `aria-label`/`aria-labelledby`; Tabs tablist with standard naming props; Switch with visible child text and a consumer-supplied name on the actual switch button. Include a test proving ARIA name props are not stranded on the hidden checkbox.

**Verify**: `pnpm --filter @g4rcez/components test tests/role-accessible-names.test.tsx` → all cases pass.

### Step 2: Connect names to the actual semantic roles

For each component, use visible title/label text as the preferred name when present. For Dropdown, set `aria-labelledby` only when its title is nonempty; otherwise allow consumer `aria-label`/`aria-labelledby` to name the panel. For Expand, give the trigger a stable ID and reference it from the dialog; an icon-only trigger must receive a consumer name. For Progress, reference a visible label only when present, otherwise forward the consumer name props without attaching an empty label reference. Forward naming props to the Tabs tablist. In Switch, route name props to the visible `role=\"switch\"` button, and omit its internal `aria-labelledby` when the visible label is empty so a consumer `aria-label` can work; preserve the hidden checkbox behavior.

**Verify**: `pnpm --filter @g4rcez/components test tests/role-accessible-names.test.tsx` → all role queries expose the expected accessible name and preserve existing state.

### Step 3: Document and validate the name contract

Update the five canonical references with the naming requirements and examples for optional/icon-only cases. Synchronize generated skill files through the script only.

**Verify**: `pnpm components:skills sync && pnpm components:skills check` → both succeed; `pnpm --filter @g4rcez/components test tests/skills-sync.test.ts` → pass.

## Test plan

- Create `packages/lib/tests/role-accessible-names.test.tsx`.
- Use `getByRole(..., { name })` or `toHaveAccessibleName` for dialog, progressbar, tablist, and switch; verify the ARIA prop reaches the element that owns the role.
- Cover visible-label and explicit-label paths; preserve existing tabs/progress tests.
- Run package build and lint after focused tests.

## Done criteria

- [ ] All listed role-bearing elements have a reliable visible or consumer-supplied accessible name in supported states.
- [ ] ARIA props reach the semantic element, not a hidden input or unrelated wrapper.
- [ ] Regression tests, package build, lint, and canonical sync checks pass.
- [ ] All five canonical references describe naming requirements accurately.
- [ ] No files outside the in-scope list are changed; status row is updated.

## STOP conditions

- A component already receives an accessible name from a wrapper not described here; verify the rendered accessibility tree before duplicating the label.
- A required naming change would alter the public API beyond standard ARIA forwarding, or requires new user-facing text/translation decisions.
- The component role has changed since the cited evidence.
- Any focused verification fails twice after a reasonable correction attempt.

## Maintenance notes

When a role-bearing element is moved between wrappers, retest the computed accessible name at the role owner. Keep `aria-labelledby` references pointed at rendered, non-empty IDs and avoid competing `aria-label`/`aria-labelledby` sources.
