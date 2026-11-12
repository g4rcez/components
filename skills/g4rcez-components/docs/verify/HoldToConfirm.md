# HoldToConfirm acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** an enabled button with `duration` 1000, **when** a mouse, pen or touch press is held for 1000ms, **then** `onConfirm` runs exactly once, the label becomes `confirmedLabel`, a check is drawn, and the button sets `aria-disabled`. Holding Space or Enter does the same.
2. **Current behavior:** **Given** a hold in progress, **when** the pointer is released, the key is released, focus leaves the button, the pointer cancels, or the pointer moves more than 24px outside the button, **then** the hold is cancelled, the fill rewinds, `onConfirm` does not run and `onHoldChange(false)` is reported.
3. **Current behavior:** **Given** the button, **when** it receives a plain `click`, or a Space or Enter key press that is released early, **then** nothing is confirmed. Key repeat does not restart or extend a hold.
4. **Current behavior:** **Given** a disabled or already confirmed button, **when** a hold is attempted, **then** it does not start.
5. **Current behavior:** **Given** a controlled `confirmed`, **when** it goes from `true` to `false`, **then** the button returns to its instruction and can be held again. **When** it stays `false` through a completed hold, **then** `onConfirm` still runs and the fill rewinds, so the parent decides when to show the done state.
6. **Current behavior:** **Given** a screen reader, **when** the button is focused, **then** its name is the visible label (not the hold hint), its description explains the hold time and the keyboard use, and completion is announced politely.
7. **Current behavior:** **Given** reduced motion, **when** the button is held, **then** it does not scale down, the fill still tracks the hold, and it resets without a spring.
8. **Integration target:** **Given** the real destructive action, **when** `onConfirm` runs, **then** the consumer performs it and, if it can fail or be undone, resets the button through `confirmed`. Verify the server also protects the action.
