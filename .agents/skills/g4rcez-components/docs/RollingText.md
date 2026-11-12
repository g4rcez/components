---
title: RollingText
description: Text and numbers whose changed characters roll in, with the full value kept for assistive technology.
package: "@g4rcez/components"
export: "{ RollingText, RollingDigits }"
import: "import { RollingText, RollingDigits } from '@g4rcez/components'"
category: core
---

# RollingText

The building block behind the rolling labels and counts in [ActionSwap](ActionSwap.md), [Reactions](Reactions.md) and [MorphSelect](MorphSelect.md). Use it on its own for a label or a counter whose value changes in place.

## Import

```tsx
import { RollingDigits, RollingText } from "@g4rcez/components";
```

## Props

| Component | Prop | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `RollingText` | `value` | `string` | required | The text. Only the characters that change animate. |
| `RollingDigits` | `value` | `number` | required | The number. Digits are keyed from the right, so the units stay put when a digit appears on the left. |
| both | `direction` | `1 \| -1` | derived | `1` rolls up, `-1` rolls down. Numbers derive it from the change; text defaults to `1`. |
| both | `className` | `string` | — | Extra class on the root. |

## Design Tokens

None of its own. It inherits the font and color of its parent and uses tabular numbers. The motion uses the shared morph spring.

## Examples

```tsx
<RollingDigits value={count} />
<RollingText value={status} direction={moved > 0 ? 1 : -1} />
```

## Do

- Use it for short strings and counters that change in place.
- Pass `direction` when the change has a meaning, such as moving down a list.

## Don't

- Don't use it for long text: every character is its own motion element.
- Don't rely on the animation to convey the change. Announce it with a live region where it matters.

## Interaction design and acceptance criteria

- Only the characters whose position and value changed re-key; the others keep their node and do not animate.
- Each glyph enters from the side of `direction` with a soft blur and leaves to the other side.
- Reduced motion replaces the travel and blur with a short fade.

## Accessibility

- The animated glyphs are `aria-hidden` and carry their character in a `data-char` attribute rendered by CSS. The full value is exposed exactly once, in a visually hidden node, so `getByText` and assistive technology each find it once.

## Notes

- The visible glyphs have no text node of their own, so copying the visible text selects the hidden full value.

## Verification

Acceptance criteria for tests and reviews: [verify/RollingText.md](verify/RollingText.md).
