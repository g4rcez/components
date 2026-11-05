# Radiobox acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** two enabled radios sharing a `name` and form owner, **when** the second control or label is clicked or tapped, **then** only the second is checked. Activating it again leaves it checked.
2. **Browser check:** **Given** a named group with a selected option, **when** Tab enters it and arrow keys are used, **then** focus and selection follow the browser radio-group behavior and exactly one option stays checked. Space selects the focused option.
3. **Current behavior:** **Given** a disabled radio, **when** its control or label is activated, **then** it stays unavailable and is not selected.
4. **Consumer target:** **Given** a group question and help/error text, **when** an option is inspected or reached with supported assistive technology, **then** the group and option names, selected state, and associated description are available.
5. **Consumer target:** **Given** controlled radios, **when** a new choice is accepted, **then** the parent supplies a single selected value and keeps a visible focus indicator without moving focus elsewhere.
