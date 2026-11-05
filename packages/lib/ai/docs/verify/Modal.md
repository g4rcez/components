# Modal acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Given** a closed controlled dialog with a named `Button` trigger and `asChild`, **when** click, tap, Enter, or Space activates the trigger, **then** `onChange(true)` is requested, and the updated `open` exposes the named dialog and the expanded trigger state.
2. **Given** an open modal, **when** Tab and Shift+Tab move through its controls, **then** focus stays visibly inside, the initial target suits the task, and background interaction is unavailable. Verify keyboard and assistive-technology navigation separately.
3. **Given** a dialog with unsaved data, **when** Escape, Close, an enabled outside press, or a sheet drag requests dismissal, **then** the consumer applies the same data-loss policy before changing `open`. `closable={false}` alone does not prevent dismissal.
4. **Given** a dialog that has closed, **when** the user continues navigating, **then** focus returns to the opener or to an explicitly chosen logical successor, also when the original opener was removed.
5. **Given** a mounted confirmation provider and one pending request, **when** Confirm, Cancel, or Escape is activated, **then** the promise resolves to the configured action value (default `true` or `false`) and the dialog closes. Before any provider registers, `Modal.confirm` instead returns `false` and opens no dialog.
