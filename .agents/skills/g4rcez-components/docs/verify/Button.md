# Button acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Given** an enabled native button, **when** Tab reaches it and Enter or Space activates it, **then** focus is visible and the action runs once.
2. **Given** a disabled or loading native button, **when** the user navigates or attempts activation, **then** Tab skips it and the action does not run. The reason or pending state stays understandable.
3. **Given** a navigation control rendered with `as="a"`, **when** it is inspected and activated, **then** it has link semantics, an unambiguous destination, and navigates with Enter. Disabling it removes the destination.
4. **Given** an icon-only action or a disclosure trigger, **when** it is inspected with desktop or mobile assistive technology, **then** its purpose and expanded state (if any) are available without the icon or color alone.
5. **Given** an asynchronous action, **when** it completes or fails, **then** visible and announced feedback explains the outcome. Focus does not move unexpectedly.
