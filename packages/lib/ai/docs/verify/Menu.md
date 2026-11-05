# Menu acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Given** a named root trigger, **when** pointer, touch, Enter, or Space activates it, **then** its menu opens and exposes the matching expanded state. Verify the same access paths for each nested submenu.
2. **Given** an open action menu, **when** arrow navigation or a matching typeahead sequence is used, **then** focus reaches the appropriate enabled item, wraps where configured, and never activates a disabled action.
3. **Given** an enabled `MenuItem`, **when** a click or Enter/Space activates it, **then** its handler runs and the menu tree closes. The item name and typeahead title describe the same action.
4. **Given** an open root with `restoreFocus={true}`, **when** Escape dismisses it, **then** the menu closes and focus returns to the root trigger. Verify outside-press focus behavior separately, so the clicked destination stays usable.
5. **Given** ordinary page-navigation links, **when** Tab and Enter are used, **then** they follow native link order and destination behavior inside a named navigation region, not the roving action-menu model of this component.
