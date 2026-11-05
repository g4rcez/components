# AnimatedList acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

These are integration targets. They are not verification already performed for assistive technologies.

1. **Given** a collection with clear titles and descriptions, **when** users read or Tab through rows, **then** visual order and DOM order agree, and opening controls have item-specific accessible names and descriptions.
2. **Given** a visible title, avatar, or trailing action, **when** pointer, touch, or Enter/Space activates it, **then** the matching titled detail view opens without nested-control conflicts.
3. **Given** an open panel, **when** users traverse it and dismiss it, **then** focus stays inside while open and returns predictably, including when the original item was changed or removed.
4. **Given** reduced motion, 200% text size, or a 320 CSS-pixel viewport, **when** details are opened and read, **then** the selected item stays clear and all text and actions, including close, stay reachable.
