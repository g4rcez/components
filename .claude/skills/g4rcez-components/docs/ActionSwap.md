---
title: ActionSwap
description: Pill button that cycles through related states, such as Pin and Pinned, morphing width, tone, icon and label together.
package: "@g4rcez/components"
export: "{ ActionSwap }"
import: "import { ActionSwap } from '@g4rcez/components'"
category: core
---

# ActionSwap

A compact pill button that moves to the next of a few related states on every press: Pin → Pinned, Compile → Compiled, dynamic, gradual and static typing. The icon, tone, width and label change together; only the characters that differ roll in.

## Import

```tsx
import { ActionSwap, type ActionSwapState } from "@g4rcez/components";
```

## Props

`ActionSwap` renders a `<button type="button">` and forwards the other button attributes. `children`, `value`, `defaultValue` and `onClick` belong to the component.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `states` | `ActionSwapState[]` | required | Ordered list of at least two states. The list wraps around. |
| `value` | `string` | — | Controlled state id. |
| `defaultValue` | `string` | first state's `id` | Initial state id when uncontrolled. |
| `onValueChange` | `(id, state) => void` | — | Called when the state changes, including `holdFor` advances. |
| `onAction` | `(current, next) => void \| Promise<unknown>` | — | Runs on press with the state being left and the one coming next. Return a promise to show a working phase. |
| `failureLabel` | `string` | `"Try again"` (translatable) | Shown for 1.8 seconds after `onAction` rejects or throws. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Pill size. |
| `translations` | `Partial<Translations>` | — | Overrides `actionSwapTryAgain`. |

`ActionSwapState`:

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable identifier. Used as the value. |
| `label` | `string` | Visible label and accessible name. Keep it short: each character is its own motion element. |
| `icon` | `ReactNode` | 16px icon. Wrapped, so any Phosphor icon works. |
| `tone` | `"neutral" \| "primary" \| "success" \| "warn" \| "danger" \| "quiet"` | Color treatment. `success` draws its icon in with a left-to-right wipe. Default `"neutral"`. |
| `pendingLabel` | `string` | Shown while `onAction` is pending. Without it the pill folds into a round spinner. |
| `holdFor` | `number` | Milliseconds before the component advances to the next state on its own. Useful for brief confirmations. |

## Design Tokens

Geometry reuses the Button tokens for each size.

| Size | Height | Horizontal padding | Font size |
| --- | --- | --- | --- |
| `sm` | `--var-button-small-height` | `--var-button-small-px` | `--var-button-small-font-size` |
| `md` | `--var-button-height` | `--var-button-px` | `--var-button-font-size` |
| `lg` | `--var-button-big-height` | `--var-button-big-px` | `--var-button-big-font-size` |

| Tone | Background | Text |
| --- | --- | --- |
| `neutral` | `--var-color-background` with a `--var-color-border` hairline | `--var-color-foreground` |
| `primary` | `--var-color-primary` | `--var-color-primary-foreground` |
| `success` | `--var-color-success` | `--var-color-success-foreground` |
| `warn` | `--var-color-warn` | `--var-color-warn-foreground` |
| `danger` | `--var-color-danger` (also used for the failure phase) | `--var-color-danger-foreground` |
| `quiet` | `--var-color-muted` | `--var-color-muted-foreground` |

It also uses `--var-rounded-full`, `--var-button-gap`, `--var-button-icon-font-size`, `--var-color-ring` and the Spinner styles for the working indicator.

## Variants

- `size`: `sm`, `md`, `lg`.
- Per state `tone`: see the table above.

## Examples

### Pin a language

```tsx
import { PushPinIcon, PushPinSlashIcon } from "@phosphor-icons/react";
import { ActionSwap, type ActionSwapState } from "@g4rcez/components";

const states: ActionSwapState[] = [
    { id: "pin", label: "Pin", icon: <PushPinIcon aria-hidden weight="bold" />, tone: "primary" },
    { id: "pinned", label: "Pinned", icon: <PushPinSlashIcon aria-hidden weight="bold" />, tone: "neutral" },
];

export default function PinLanguage() {
    return <ActionSwap states={states} onAction={(_, next) => api.setPinned("rust", next.id === "pinned")} />;
}
```

### Compile, then a brief confirmation

```tsx
const states: ActionSwapState[] = [
    { id: "compile", label: "Compile", icon: <HammerIcon aria-hidden weight="bold" />, tone: "primary", pendingLabel: "Compiling" },
    { id: "compiled", label: "Compiled", icon: <CheckIcon aria-hidden weight="bold" />, tone: "success", holdFor: 1800 },
];

<ActionSwap states={states} failureLabel="Build failed" onAction={() => compiler.build("main.rs")} />;
```

### Controlled

```tsx
const [mode, setMode] = useState("dynamic");
<ActionSwap states={typingStates} value={mode} onValueChange={setMode} />; // dynamic → gradual → static
```

## Do

- Use it for one control that cycles through a short list of related states.
- Return a promise from `onAction` when the change needs the network, so the button shows a working phase and a failure.
- Keep labels short and limit the number of swaps on a screen.
- Give every state an `id` that means something to your data.

## Don't

- Don't use it for a one-off save. Use `Button` with `loading`.
- Don't use it to choose among many options. Use `Select`, `MorphSelect` or `Tabs`.
- Don't put the only copy of important information in the icon: the label carries it.

## Interaction design and acceptance criteria

- Enter or Space advances to the next state; a pointer press does too. At the end the list wraps to the first state.
- With a sync `onAction` (or none) the state changes immediately. With a promise, the button enters the working phase, sets `aria-busy` and `aria-disabled`, ignores further presses, and shows the working phase for at least 450ms so it never flashes. When the promise resolves the next state appears.
- A rejection (or a throw) keeps the current state and shows `failureLabel` in the `danger` tone for 1.8 seconds. Pressing during that time retries. After it, the button returns to the current state.
- `holdFor` returns or advances the state on its own, without calling `onAction`.
- Controlled: with `value`, a press calls `onValueChange` and the parent decides.
- A disabled button never acts. Unmounting while working cancels the timers and does not update state.

## Accessibility

- It is a native button. Its accessible name is the visible label; while working it is `pendingLabel`, or the current state's label when the pill is a round spinner; after a failure it is the failure label.
- `aria-busy` and `aria-disabled` are set while working.
- A sibling polite `role="status"` announces each new label and any failure. It stays empty on mount.
- The icon and the spinner are `aria-hidden`. The rolling characters are `aria-hidden`; the full label is exposed once in a visually hidden node.
- Hover styles apply only to fine pointers. The focus ring uses `--var-color-ring`.

## Notes

- Reduced motion replaces the width spring, the character roll and the icon swap with instant changes and a short fade.
- Width, padding, tone and icon move on one spring. The width is measured from the content with a `ResizeObserver` and applied through a motion value.
- Composes [RollingText](RollingText.md) and the Spinner styles.

## Verification

Acceptance criteria for tests and reviews: [verify/ActionSwap.md](verify/ActionSwap.md).
