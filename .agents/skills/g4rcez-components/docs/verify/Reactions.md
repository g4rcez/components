# Reactions acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** `options` and a value, **when** the bar renders, **then** it is a group named by `label`, each reaction with a count above zero (and a known option) is a toggle button in the given order, and its name states the label, the count and whether the person reacted.
2. **Current behavior:** **Given** a pill, **when** it is pressed or activated with Enter or Space, **then** the person's reaction toggles, the count changes by one, `aria-pressed` follows, and `onValueChange(next, { id, reacted })` runs. A count that reaches zero removes the pill.
3. **Current behavior:** **Given** the add button, **when** it is pressed, **then** a toolbar of every option opens, options already used are `aria-pressed`, choosing one adds or takes back that reaction (a new reaction goes to the end), the picker closes and focus returns to the add button.
4. **Current behavior:** **Given** the open picker, **when** arrows, Home and End are pressed, **then** focus moves between options, wrapping at both ends, with exactly one option tabbable. Escape closes it and returns focus to the add button.
5. **Current behavior:** **Given** the focused pill leaves the bar, **when** the bar updates, **then** focus moves to the next pill, or the previous one if it was last, or the add button if none remain.
6. **Current behavior:** **Given** a controlled `value`, **when** a pill is pressed, **then** the displayed list does not change until the parent passes the next one.
7. **Current behavior:** **Given** a change, **when** it happens, **then** a polite status announces it, for example "Heart added, 4 total". It announces nothing on mount.
8. **Current behavior:** **Given** a narrow viewport, **when** the picker opens, **then** it stays inside the viewport.
9. **Current behavior:** **Given** reduced motion, **when** reactions change, **then** pills fade without scale, blur, tap kick or count roll.
10. **Integration target:** **Given** server-backed counts, **when** a reaction is saved, **then** the persisted count and the displayed count agree, including after a failed save.
