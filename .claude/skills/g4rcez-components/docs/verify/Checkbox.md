# Checkbox acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** an enabled checkbox with a text label, **when** the control or label is clicked or tapped, **then** the checked state changes and `onChange` receives the new state. A controlled consumer must update `checked`.
2. **Current behavior:** **Given** focus on an enabled checkbox, **when** Space is pressed, **then** it toggles once. **When** Tab or Shift+Tab is used, **then** focus continues through the form with no checkbox-specific trap.
3. **Current behavior:** **Given** `disabled` or `loading`, **when** activation is attempted, **then** the native input stays disabled and the checked state does not change.
4. **Consumer target:** **Given** several independent choices pending submission, **when** one is toggled, **then** the others keep their state and nothing is persisted until the consumer's submit action.
5. **Consumer target:** **Given** help, an error, or a mixed-state parent checkbox, **when** its accessibility properties and screen-reader interaction are inspected, **then** the label, description and actual state are available, and the consumer's mixed-state activation rule is consistent.
