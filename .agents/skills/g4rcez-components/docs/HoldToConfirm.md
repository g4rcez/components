---
title: HoldToConfirm
description: Button that runs its action only after being held down, for destructive actions whose consequence is already visible.
package: "@g4rcez/components"
export: "{ HoldToConfirm }"
import: "import { HoldToConfirm } from '@g4rcez/components'"
category: core
---

# HoldToConfirm

A button that runs its action only after the person holds it down for a set time. A fill advances across the button while it is held and rewinds when released early. Use it for destructive or hard-to-undo actions, like deleting a branch or force pushing, where the consequence is already visible on screen.

## Import

```tsx
import { HoldToConfirm } from "@g4rcez/components";
```

## Props

`HoldToConfirm` renders a `<button type="button">` and forwards every other button attribute (`className`, `disabled`, `style`, `data-*`, `aria-*`, handlers other than `onClick`). `children` and `onClick` are not accepted.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | required | Instruction shown on the button, for example "Hold to delete branch". It is also the accessible name. |
| `onConfirm` | `() => void` | required | Called once when the hold completes. |
| `confirmedLabel` | `string` | `"Done"` (translatable) | Label after completion. |
| `duration` | `number` | `1200` | Hold length in milliseconds. |
| `icon` | `ReactNode` | `<TrashIcon />` | Leading icon. A check that draws itself in replaces it when confirmed. |
| `tone` | `"danger" \| "neutral"` | `"danger"` | Fill color. |
| `confirmed` | `boolean` | `undefined` | Controls the done state. Pass `false` to reset after an undo or a failed request, `true` to show it done. Leave `undefined` to let the component manage it. |
| `onHoldChange` | `(holding: boolean) => void` | — | Reports when a hold starts and ends, for example to show a nearby hint. |
| `translations` | `Partial<Translations>` | — | Overrides `holdToConfirmDone` and `holdToConfirmHint`. |

## Design Tokens

The geometry reuses the Button tokens, so it matches `Button` at the default size and follows any theme override.

| Token | Use |
| --- | --- |
| `--var-button-height`, `--var-button-px`, `--var-button-py`, `--var-button-gap` | Size and spacing |
| `--var-button-rounded` | Corner radius |
| `--var-button-font-size`, `--var-button-icon-font-size` | Text and icon size |
| `--var-color-danger`, `--var-color-danger-foreground` | Danger fill and the text on it |
| `--var-color-foreground`, `--var-color-background` | Neutral fill and the text on it |
| `--var-color-border`, `--var-color-ring` | Hairline and focus ring |

## Variants

- `tone="danger"` (default): the fill is `--var-color-danger`.
- `tone="neutral"`: the fill is `--var-color-foreground`.

## Examples

### Delete a branch

```tsx
import { useState } from "react";
import { HoldToConfirm } from "@g4rcez/components";

export default function DeleteBranch() {
    const [deleted, setDeleted] = useState(false);
    return <HoldToConfirm label="Hold to delete branch" confirmedLabel="Branch deleted" confirmed={deleted} onConfirm={() => setDeleted(true)} />;
}
```

### Neutral tone, custom duration and a hint

```tsx
import { useState } from "react";
import { GitMergeIcon } from "@phosphor-icons/react";
import { HoldToConfirm } from "@g4rcez/components";

export default function MergePullRequest() {
    const [holding, setHolding] = useState(false);
    return (
        <>
            <HoldToConfirm tone="neutral" duration={2000} icon={<GitMergeIcon aria-hidden />} label="Hold to merge" onHoldChange={setHolding} onConfirm={merge} />
            <p aria-live="polite">{holding ? "Keep holding to merge into main." : "Hold the button for two seconds."}</p>
        </>
    );
}
```

## Do

- Write the label as an instruction ("Hold to delete branch").
- Use it where the person can already see what will happen.
- Pass `confirmed` to reset the button after an undo or a failed request.
- Pair it with `onHoldChange` to show a nearby hint while the button is held.

## Don't

- Don't use it for safe, easily reversed actions. Use `Button`.
- Don't use it when people need to read the consequences first. Use `Modal` with a confirmation.
- Don't rely on it as the only protection for an action that is truly irreversible on the server. Validate there too.

## Interaction design and acceptance criteria

- Mouse, pen and touch use pointer events with capture. Sliding more than 24px outside the button cancels the hold. A pointer cancel (for example the browser taking a vertical scroll) cancels it too.
- Holding Space or Enter fills the button. Releasing early or tabbing away (blur) cancels. Key repeat is ignored.
- Releasing early rewinds the fill on a spring that starts from rest. A quick re-press resumes from the current position.
- Completion is timer-driven: `onConfirm` runs once after the remaining time, then the button sets `aria-disabled`, swaps the label, draws a check and gives a short vibration where the device supports it.
- A plain `click` (including a synthesized one) never confirms. The native key activation is prevented so Space and Enter do not also click.
- A disabled button never starts. A confirmed button ignores new holds.
- With `confirmed` controlled to `false`, a completed hold still calls `onConfirm`, then the fill rewinds, so the parent decides when to show the done state.

## Accessibility

- It is a native button. Its accessible name is the visible text (the confirmed label once done). The duplicate copy of the label used for the color flip is `aria-hidden`.
- `aria-describedby` points to a visually hidden hint that explains the hold time and the keyboard use. The hint and the live status are siblings of the button, so they do not become part of its name.
- A polite `role="status"` announces `confirmedLabel`.
- Once done the button sets `aria-disabled` and stays focusable.
- The focus ring uses `--var-color-ring`, with a forced-colors outline fallback.

## Notes

- Reduced motion removes the press scale and the rewind spring, and fades the label and icon. The fill still tracks the hold, because it carries the meaning.
- The fill is a single motion value animated linearly, so holding does not re-render React per frame.
- The width springs to fit the new label through a `ResizeObserver` on the content.
- The long-press context menu is suppressed on the button.

## Verification

Acceptance criteria for tests and reviews: [verify/HoldToConfirm.md](verify/HoldToConfirm.md).
