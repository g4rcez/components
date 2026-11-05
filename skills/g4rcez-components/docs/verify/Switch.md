# Switch acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** an enabled switch button, **when** it is clicked or tapped, **then** `onCheck` receives the opposite boolean and a checkbox change event is dispatched. An uncontrolled switch updates. A controlled switch shows the `checked` value that the parent accepted.
2. **Current behavior:** **Given** keyboard focus on the switch button, **when** Space or Enter is pressed, **then** the switch toggles once and does not submit its form. Tab and Shift+Tab continue through the page.
3. **Current behavior:** **Given** `disabled` or `loading`, **when** button activation is attempted, **then** neither control toggles.
4. **Consumer target:** **Given** a stable setting label and an error or external help, **when** the switch is inspected and used with supported assistive technology, **then** its name, switch role, on/off state, and description stay understandable after a change.
5. **Integration target (current label gap):** **Given** an immediately persisted controlled setting, **when** the button or the associated label is activated, **then** the same intended setting is applied. A failure restores the real state with feedback. Verify label and callback parity explicitly. Current label wiring does not guarantee it.
