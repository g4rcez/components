# List acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

These are design targets to verify in the application. They are not screen-reader test results.

1. **Given** several items, **when** the list is read or traversed with Tab, **then** item order is preserved, and each opening control has a meaningful item-specific name and description.
2. **Given** a title or avatar button, **when** pointer, touch, Enter, or Space activates it, **then** the matching named detail dialog opens. Static row whitespace does not act as a hidden control.
3. **Given** an open detail panel, **when** the user presses Tab or Shift+Tab, and dismisses the panel with Escape or its close button, **then** focus stays inside while the panel is open and returns to the opening control when that control still exists.
4. **Given** an item is removed or reordered during an open detail view, **when** the view closes, **then** the application keeps the intended item context and gives a predictable focus destination.
5. **Given** long text, a trailing action, zoom, or reduced motion, **when** users open and read details, **then** labels, content, and the close control stay reachable without overlap, and motion is not necessary to understand the change.
