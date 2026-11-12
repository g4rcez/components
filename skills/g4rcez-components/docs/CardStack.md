---
title: CardStack
description: Review a deck one card at a time by dragging, flicking, pressing a button or using the arrow keys, with undo.
package: "@g4rcez/components"
export: "{ CardStack }"
import: "import { CardStack } from '@g4rcez/components'"
category: display
---

# CardStack

A deck you decide one card at a time. Drag or flick the top card left or right, press a button, or use the arrow keys. Undo returns the last card to the stack. It suits learning lists, review queues and onboarding picks. It is not a carousel: each card is decided, not just browsed.

## Import

```tsx
import { CardStack } from "@g4rcez/components";
```

## Props

`CardStack` is generic in the item type `T`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `T[]` | required | Cards in order. The top card is the first one not yet decided. |
| `getKey` | `(item: T) => string` | required | Stable key per item. Decisions are tracked by key. |
| `getLabel` | `(item: T) => string` | required | Short name used in card labels and announcements. |
| `renderCard` | `(item: T) => ReactNode` | required | Card content. |
| `onDecide` | `(item, "left" \| "right") => void` | — | Called on a swipe, a button or a key. |
| `onUndo` | `(item, "left" \| "right") => void` | — | Called when the last decision is undone. |
| `onReset` | `() => void` | — | Called when every card comes back. |
| `labels` | `{ left: string; right: string }` | `{ left: "Pass", right: "Keep" }` | Button and stamp labels. |
| `outcomes` | `{ left: string; right: string }` | `labels` | Past-tense labels for announcements, such as "skipped". |
| `label` | `string` | `"Cards"` (translatable) | Accessible name of the stack. |
| `renderEmpty` | `(reset: () => void) => ReactNode` | a "Start over" button | Shown after every card is decided. |
| `className` | `string` | — | Class for the root. |
| `translations` | `Partial<Translations>` | — | Overrides every `cardStack*` string. |

## Design Tokens

| Token | Use |
| --- | --- |
| `--var-card-background`, `--var-card-border`, `--var-card-surface-radius`, `--var-shadow-card` | Card surface |
| `--var-color-danger`, `--var-color-success` | Left and right stamp colors |
| `--var-color-ring` | Focus ring on the stage |
| Button tokens | The Pass, Undo and Keep buttons are `Button` |

The stage is `min(100%, 20rem)` wide. In containers narrower than 26rem the cards are shorter, and in containers narrower than 22.5rem the Undo button becomes icon-only. The container is the component's own outer box, so these follow the space available, not the viewport.

## Examples

```tsx
import { CardStack } from "@g4rcez/components";

type Language = { id: string; name: string };

export default function Shortlist({ languages }: { languages: Language[] }) {
    return (
        <CardStack
            items={languages}
            getKey={(language) => language.id}
            getLabel={(language) => language.name}
            renderCard={(language) => <h3>{language.name}</h3>}
            labels={{ left: "Skip", right: "Learn" }}
            outcomes={{ left: "skipped", right: "queued" }}
            onDecide={(language, decision) => save(language.id, decision)}
        />
    );
}
```

## Do

- Use it for one-by-one triage where a left or right decision should be undoable.
- Persist in `onDecide` and `onUndo`.
- Provide `outcomes` in the past tense so the announcements read naturally.
- Keep card content self-contained: only the top four cards render and only the top one is exposed to assistive technology.

## Don't

- Don't use it when people need to compare items side by side. Use a list or `Table`.
- Don't use it to browse without deciding. Use a carousel pattern.
- Don't use it for quick actions on list rows. Use [SwipeableList](SwipeableList.md).
- Don't make swiping the only way to decide: the buttons and keys are always present.

## Interaction design and acceptance criteria

- The top card follows the pointer with a tilt and shows a stamp for the side it is heading to. Releasing decides it when it has moved farther than 28% of the card width (at least 80px), or when it is flicked faster than 500px/s after moving at least 24px. Otherwise it snaps back. The decision goes to the side of the movement.
- A decided card is thrown off to its side and the cards beneath rise into place. Only the top four cards render, however long the deck is.
- The Pass and Keep buttons mirror the gestures. Left and Right arrows decide the top card when the stage is focused. Backspace, Cmd+Z or Ctrl+Z undo. These keys are ignored while the target is a text field inside a card.
- Undo returns the last decided card to the top, flying back from the side it left, and calls `onUndo`. It is disabled when nothing has been decided.
- When every card is decided, `renderEmpty(reset)` is shown (or "Start over"), and the Pass and Keep buttons are disabled. Reset brings every card back and calls `onReset`.
- Decisions are tracked by `getKey`, so appending items to `items` continues the deck.

## Accessibility

- The stage is a focusable `role="group"` with `aria-roledescription="card stack"` and a visually hidden hint, linked with `aria-describedby`, that describes the drag and key controls.
- The top card is a group labelled with its position, for example "Rust, 1 of 4". The cards beneath are `aria-hidden` and not interactive.
- Decisions, undo and reset are announced in a polite status, for example "Rust: skipped".
- Buttons provide every action that the gestures do, so swiping is never required. Undo keeps its accessible name when it is icon-only.
- Cards use `touch-action: pan-y`, so vertical swipes still scroll the page.

## Notes

- Reduced motion fades cards out and in at their home position, without travel or tilt.
- Dragging and throwing run on motion values, so they do not re-render React per frame. Release thresholds are a pure function (`dragDecision`) so they can be unit-tested.

## Verification

Acceptance criteria for tests and reviews: [verify/CardStack.md](verify/CardStack.md).
