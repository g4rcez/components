# Tooltip acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Given** a named `as={Button}` reference in default mode, **when** it receives keyboard focus, **then** the noninteractive tooltip opens, focus stays on the control, and its `aria-describedby` references the tooltip.
2. **Given** a pointer-enabled tooltip, **when** the pointer hovers over its reference, **then** the description appears after the shared delay. Verify readable placement and persistence separately: default mode has no safe-polygon handling.
3. **Given** a controlled open tooltip, **when** Escape or outside press requests dismissal, **then** `onChange(false)` is reported and the popup stays until the parent changes `open`.
4. **Given** a touch-only user or an unfocusable reference, **when** the supplementary information is needed, **then** an equivalent explicit control or visible text provides access. Default hover behavior alone does not meet this target.
5. **Given** information that needs interactive controls, **when** a popup is chosen, **then** it uses a named managed panel with a reachable close action and verified focus return. Setting `popover` on `Tooltip` alone does not meet this target.
