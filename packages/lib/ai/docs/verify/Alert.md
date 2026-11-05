# Alert acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

These are application design targets, not tested announcement guarantees.

1. **Given** routine information or an urgent dynamic warning, **when** the matching theme is rendered, **then** the DOM uses `status` or `alert` respectively and the wording shows severity without color.
2. **Given** a message appears during a task, **when** users continue with keyboard or touch, **then** focus stays on the task and every banner action is named, visible, and independently operable.
3. **Given** a dismissible alert with focus on close, **when** Enter/Space or a pointer activates it, **then** the consumer sets `open` to false, focus moves to a predictable surviving control, and hidden descendants are unreachable after exit.
4. **Given** a validation summary, **when** a user follows an error to its field, **then** the field keeps a programmatic error description and the unresolved error stays available after the summary is dismissed.
5. **Given** long text, zoom, or a narrow viewport, **when** the message is read and its controls used, **then** all content and controls stay visible and reachable without close-button overlap.
