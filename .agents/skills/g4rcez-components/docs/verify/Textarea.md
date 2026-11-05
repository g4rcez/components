# Textarea acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance. They are not recorded test results.

1. **Given** a visible title and associated textarea, **when** its label is clicked or tapped, or `Tab` reaches it, **then** the control receives visible focus. Native typing, selection, paste, and `Tab`/`Shift+Tab` exit remain available.
2. **Given** the default multiline flow, **when** `Enter` is pressed, **then** a line break is inserted without submitting. **Given** the explicitly explained `next` override and a focusable target, **when** `Enter` is pressed, **then** focus moves to that target without inserting a line break.
3. **Given** initial rows and changing user-entered content, **when** native input events add or remove lines, **then** height fits the content and stays at or above the initial minimum. Check manual resizing, zoom, width reflow, and programmatic updates separately.
4. **Given** required/length guidance and a rejected value, **when** validation reports an error, **then** the text remains for correction, and the hint and specific correction message are associated with the textarea. Confirmed revalidation clears only its error and does not move editing focus.
5. **Given** an invalid or disabled/read-only textarea, **when** its DOM semantics and desktop/mobile assistive-technology behavior are checked, **then** the label, multiline nature, constraints, applicable state, and descriptions are available. No redundant application alerts or color-only explanation appear.
