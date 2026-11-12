# CardStack acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** a deck, **when** it renders, **then** the stage is a focusable group described as a card stack with a hint, at most four cards render, the top card is labelled with its position ("Rust, 1 of 4") and the cards beneath are hidden from assistive technology.
2. **Current behavior:** **Given** the top card, **when** it is dragged farther than 28% of its width (at least 80px) and released, **or** flicked faster than 500px/s after moving at least 24px, **then** it is decided to the side it moved, `onDecide(item, side)` runs and the next card rises into place. A shorter, slower drag snaps back and decides nothing.
3. **Current behavior:** **Given** the buttons and keys, **when** Pass or Keep is pressed, or Left or Right arrow is pressed on the focused stage, **then** the top card is decided the same way. Arrow and undo keys are ignored while typing in a field inside a card.
4. **Current behavior:** **Given** at least one decision, **when** Undo is pressed, or Backspace, Cmd+Z or Ctrl+Z, **then** the last card returns to the top, flying in from the side it left, and `onUndo(item, side)` runs. Undo is disabled when nothing has been decided.
5. **Current behavior:** **Given** every card is decided, **then** `renderEmpty(reset)` (or a "Start over" button) shows, Pass and Keep are disabled, and reset brings every card back and calls `onReset`.
6. **Current behavior:** **Given** items appended to `items`, **then** earlier decisions are kept (tracked by `getKey`) and the deck continues.
7. **Current behavior:** **Given** a decision, undo or reset, **then** a polite status announces it, using `outcomes` when provided.
8. **Current behavior:** **Given** a touch device, **then** the cards use `touch-action: pan-y`: a horizontal swipe decides and a vertical swipe scrolls the page.
9. **Current behavior:** **Given** a container narrower than 26rem the cards are shorter, and narrower than 22.5rem the Undo button is icon-only while keeping its name.
10. **Current behavior:** **Given** reduced motion, **then** decided and returning cards fade at their home position without travel.
11. **Integration target:** **Given** the real content, **then** each card is understandable on its own, with any interactive content inside it reachable by keyboard.
