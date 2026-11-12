---
title: Reactions
description: Bar of reaction pills with a picker to add more, where counts roll digit by digit and pills reflow on a spring.
package: "@g4rcez/components"
export: "{ Reactions }"
import: "import { Reactions } from '@g4rcez/components'"
category: display
---

# Reactions

Vote on a post, comment or poll in one tap. Each reaction is a pill with an icon and a count; the add button opens a picker with every option. A pill whose count reaches zero leaves the bar and the rest reflow.

## Import

```tsx
import { Reactions, type Reaction, type ReactionOption } from "@g4rcez/components";
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `ReactionOption[]` | required | Every reaction the picker offers: `{ id, label, icon }`. |
| `value` | `Reaction[]` | — | Controlled reactions: `{ id, count, reacted }`. Pills keep this order. |
| `defaultValue` | `Reaction[]` | `[]` | Initial reactions when uncontrolled. |
| `onValueChange` | `(next, change) => void` | — | Receives the next list and `{ id, reacted }` for the change that produced it. |
| `label` | `string` | `"Reactions"` (translatable) | Accessible name of the bar. |
| `className` | `string` | — | Extra class on the bar. |
| `translations` | `Partial<Translations>` | — | Overrides every string (`reactionsLabel`, `reactionsAdd`, `reactionsPickerLabel`, `reactionsPill`, `reactionsAdded`, `reactionsRemoved`). |

`ReactionOption.icon` accepts an element, text such as an emoji, or an icon component. Phosphor icons work as they are: pass `ThumbsUpIcon`, not `<ThumbsUpIcon />`.

## Design Tokens

| Token | Use |
| --- | --- |
| `--var-reactions-height` | Minimum height of a pill and of the add button (default `calc(var(--var-spacing-base) * 2)`) |
| `--var-reactions-gap` | Gap between pills (default `calc(var(--var-spacing-base) * 0.375)`) |
| `--var-color-background`, `--var-color-foreground`, `--var-color-border` | Pill surface, text and hairline |
| `--var-color-primary` | The pressed pill's tinted background and border, and a used option in the picker |
| `--var-color-muted`, `--var-color-muted-foreground` | Hover, the picker highlight and the add button |
| `--var-dropdown-surface-*` | The picker surface (it is a `Dropdown`); the padding and radius are tightened locally |

## Examples

### Uncontrolled

```tsx
import { FileRsIcon, FileTsIcon } from "@phosphor-icons/react";
import { Reactions, type ReactionOption } from "@g4rcez/components";

const options: ReactionOption[] = [
    { id: "ts", label: "TypeScript", icon: FileTsIcon },
    { id: "rust", label: "Rust", icon: FileRsIcon },
    { id: "ruby", label: "Ruby", icon: "💎" },
];

export default function LanguagePoll() {
    return (
        <Reactions
            options={options}
            defaultValue={[
                { id: "ts", count: 12, reacted: false },
                { id: "rust", count: 3, reacted: true },
            ]}
        />
    );
}
```

### Server-backed counts

```tsx
const [value, setValue] = useState<Reaction[]>(initial);

<Reactions
    options={options}
    value={value}
    onValueChange={(next, change) => {
        setValue(next);
        save(change); // { id: "ts", reacted: true }
    }}
/>;
```

## Do

- Use it for lightweight voting and acknowledgement on comments, posts, polls and release notes.
- Persist in `onValueChange` and pass `value` back for counts that live on a server.
- Give every option a meaningful `label`: it is the pill's accessible name.

## Don't

- Don't use it for replies. Use a text field.
- Don't use it for a single like or follow toggle. Use [ActionSwap](ActionSwap.md).
- Don't use it for static counts that people cannot change. Use `Tag`.
- Don't render hundreds of bars at once, such as in a long comment thread without virtualization: each one measures its layout.

## Interaction design and acceptance criteria

- Pressing a pill toggles the person's own reaction: it adds one to the count and sets `reacted`, or takes it back. `onValueChange` receives the next list and `{ id, reacted }`.
- A reaction that does not exist yet is appended at the end of the list. A count that reaches zero removes the entry. Entries with a zero count, and ids that are not in `options`, are not shown.
- The add button opens the picker. Choosing an option toggles that reaction, closes the picker and returns focus to the add button.
- The picker is a toolbar with roving tabindex: ArrowRight/ArrowDown move forward and ArrowLeft/ArrowUp move back, both wrapping; Home and End jump to the first and last option; Enter or Space picks. Escape closes it and returns focus to the add button.
- When the focused pill leaves the bar, focus moves to the next pill, or the previous one if it was last, or the add button if none remain.
- Controlled: `value` is the source of truth and `onValueChange` only reports.

## Accessibility

- The bar is a `role="group"` named by `label`.
- Each pill is a button with `aria-pressed` and an `aria-label` that includes the label, the count and whether the person reacted, for example "Heart, 3, you reacted".
- The add button is named "Add reaction" and exposes `aria-expanded` and `aria-haspopup`.
- The picker is a `role="toolbar"` inside the `Dropdown` dialog, with one tabbable option at a time. Options are toggle buttons with `aria-pressed` and an `aria-label`.
- A sibling polite `role="status"` announces each change, for example "Thumbs up added, 13 total". It stays empty on mount.
- Icons and the rolling digits are `aria-hidden`. A pill that is leaving is hidden from assistive technology and cannot be focused.
- Hover highlights follow the mouse only. Touch taps select directly. The picker repositions near viewport edges.

## Notes

- Reduced motion replaces the scale and blur entrance, the layout springs, the tap kick and the count roll with short fades.
- Tapping quickly stacks a kick on the icon. Each tap adds to the scale and starts the spring again.
- Composes [Dropdown](Dropdown.md) and [RollingText](RollingText.md) (`RollingDigits`).

## Verification

Acceptance criteria for tests and reviews: [verify/Reactions.md](verify/Reactions.md).
