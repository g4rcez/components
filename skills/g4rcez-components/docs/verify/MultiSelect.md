# MultiSelect acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** an enabled field, **when** its display is clicked, tapped, or focused, **then** the popup search receives focus and references the visible listbox and field label.
2. **Current behavior:** **Given** enabled matching options, **when** an option is clicked, or selected with Arrow Up/Down and Enter/Space, **then** its membership toggles, `onChangeOptions` receives the proposed array, and the popup stays open. Controlled tags change only after the parent accepts the array.
3. **Current behavior:** **Given** selected tags, **when** a provided `Remove …` button or the clear action is activated, **then** the callback receives the remaining values or `[]`. An accepted state update changes the tags and the comma-separated hidden form value.
4. **Integration target:** **Given** an open popup, **when** the user presses Escape, Tab/Shift+Tab, or dismisses from outside, **then** the user can leave with visible focus in a useful place. Verify this explicitly, because modal focus management uses `returnFocus={false}`.
5. **Integration target (current gaps):** **Given** disabled choices or a required selection, **when** keyboard, pointer, and assistive-technology flows are reviewed, **then** unavailable values are not accepted, committed-array validation runs, and multiple selected values are understandable. The current disabled-keyboard path and the missing multiselectable state do not meet this target.
