# Tabs acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Given** an enabled tab, **when** the user clicks or taps it, **then** its `aria-selected` becomes `true`, its panel is available, and the content of the previous panel is unmounted.
2. **Given** focus on the selected tab, **when** the user presses Left/Right or Home/End, **then** focus and selection move together to the correct enabled tab. Left/Right wrap at the ends.
3. **Given** the tablist between other controls, **when** Tab enters and leaves it, **then** entry reaches the selected tab, and the next Tab reaches the active focusable panel. Focus stays visible without visiting every inactive tab.
4. **Given** a named tablist with unique tab IDs, **when** its accessibility properties are inspected, **then** each rendered tab has a meaningful name, a selection state, and an associated active panel. `label` alone does not name a non-string title.
5. **Given** a bar that changes page destinations, **when** a link is activated with Enter or opened in another browser tab, **then** native link behavior, `aria-current`, title, history, and logical route focus work as consumer-owned navigation. `Tabs` alone does not satisfy this criterion.
