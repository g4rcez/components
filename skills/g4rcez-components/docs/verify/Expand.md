# Expand acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Given** a closed, enabled instance, **when** its named trigger is clicked or tapped, **then** the dialog opens and the trigger `aria-expanded` becomes `true`. A disabled trigger does not open it.
2. **Given** keyboard focus on the trigger, **when** Enter or Space activates it, **then** focus is visibly indicated and moves to a usable point inside the opened dialog.
3. **Given** a controlled instance, **when** opening, Escape, or outside press requests a change, **then** `onOpenChange` receives the requested state and visibility changes only when the consumer updates `open`.
4. **Given** an open dialog with a consumer-provided Close `Button`, **when** it is activated, **then** the dialog closes, its content leaves the focus order after exit, and focus returns to a predictable control.
5. **Given** a named trigger and its dialog, **when** their accessibility properties are inspected, **then** the name and expanded state identify the revealed content. Verify announcement and narrow-screen usability separately. Do not treat `Expand` as an inline accordion.
