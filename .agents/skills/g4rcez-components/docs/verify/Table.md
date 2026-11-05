# Table acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

These criteria are integration targets, not accessibility certification or observed screen-reader results. Some expose current library limitations.

1. **Given** a dataset with descriptive headers, **when** rows are read in desktop and stacked layouts, **then** each value keeps its column context and the dataset purpose is visible.
2. **Given** sortable columns and row actions, **when** a user navigates with Tab/Shift+Tab and activates controls with Enter/Space, **then** focus is visible, `aria-sort` reflects the chosen order, and the row action runs without hover.
3. **Given** an open Properties or group-order dropdown, **when** a named reorder handle receives Up/Down, **then** the item moves one position, cannot move beyond an end, and focus stays on that item. Verify instructions and change feedback separately. The library does not generate them.
4. **Given** consumer-routed pagination, **when** a page control is activated, **then** the matching rows and current-page indication update, ellipses stay non-interactive, and focus stays predictable. A named landmark and `aria-current="page"` are design targets, not current footer guarantees.
5. **Given** long values, zoom, or a narrow viewport, **when** users read, scroll, filter, or remove a focused row, **then** values and actions stay reachable and any disappearing focus target has a deliberate replacement.
