# Autocomplete acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** the custom searchable mode, **when** the field has focus and Arrow Up/Down is used, **then** focus stays on the input, expanded/listbox relations exist, and the active descendant follows enabled visible options.
2. **Current behavior:** **Given** an enabled result, **when** a user clicks it, taps it, or presses Enter, **then** the stored value is committed through `onChange`, the label shows, the popup closes, and focus returns to the input. A controlled consumer must accept the value.
3. **Current behavior:** **Given** a pending query, **when** the user presses Escape, **then** the query is discarded and the popup closes. The committed value does not change.
4. **Current behavior:** **Given** typed text and focus moving outside the control, **when** `dynamicOption` is enabled, **then** eligible text commits without focus returning to the control, and an exact label/value match uses the existing value. With dynamic mode off, typing alone does not commit a new choice.
5. **Integration target:** **Given** the supported pointer modes, theme, help/error text, and assistive technologies, **when** selection, dismissal, disabled state, and an empty search are exercised, **then** names, committed/active state, descriptions, visible focus, and a usable exit are understandable. Inspect the native Select branch separately from the custom branch. Result announcements are not built in.
