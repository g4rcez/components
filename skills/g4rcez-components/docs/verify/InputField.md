# InputField acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

They are integration targets, not recorded test results or accessibility certification.

1. **Given** a visible title and a matching wrapper and child ID, **when** the label is clicked or tapped and the child is reached with `Tab`, **then** the intended control has visible focus, keeps native editing, and lets `Tab`/`Shift+Tab` leave it.
2. **Given** instructions and a detected error, **when** assistive technology reaches and inspects the native child, **then** it exposes the label, required and invalid state, and both hint and error description references. Correction text is visible and does not depend only on a border or status icon.
3. **Given** existing values and several errors, **when** one correction is confirmed, **then** only its message and invalid state are removed or updated. Values and other errors stay. Focus does not move during ordinary editing.
4. **Given** an optional, required, or disabled wrapper, **when** it renders, **then** optional text appears only when explicitly supplied and the field is not required. The child enforces its own required constraint. Disabled descendants cannot be edited or activated.
5. **Given** supplemental tooltip or slot actions, **when** pointer, touch, or keyboard operates them, **then** their names and focus are available, the form is not submitted, and input is not redirected unexpectedly. Check desktop and mobile alert behavior for duplicate application announcements.
