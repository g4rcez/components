# ActionSwap acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** two or more states, **when** the button is pressed, or Enter or Space is pressed on it, **then** it moves to the next state and wraps from the last to the first. Its accessible name, tone and icon follow the state.
2. **Current behavior:** **Given** `defaultValue` or `value`, **when** the state changes, **then** `onValueChange(id, state)` runs. With a controlled `value`, the state changes only when the parent passes the new value.
3. **Current behavior:** **Given** `onAction` returns a promise, **when** the button is pressed, **then** it sets `aria-busy` and `aria-disabled`, ignores further presses, shows `pendingLabel` (or folds into a round spinner that keeps the state's name), stays in that phase for at least 450ms even when the promise resolves at once, and moves to the next state when it resolves.
4. **Current behavior:** **Given** `onAction` rejects or throws, **when** the working phase ends, **then** the state does not change, `failureLabel` shows in the danger tone for 1.8 seconds, a polite status announces it, pressing during that time retries, and afterwards the button returns to its state.
5. **Current behavior:** **Given** a state with `holdFor`, **when** it is entered, **then** the component advances to the next state after that time without calling `onAction`.
6. **Current behavior:** **Given** a screen reader, **when** the label changes, **then** a polite status announces the new label. It announces nothing on mount.
7. **Current behavior:** **Given** a disabled button, or a component that unmounts while working, **then** it does not act, and no timer updates state afterwards.
8. **Current behavior:** **Given** reduced motion, **when** the state changes, **then** the width changes at once and the label and icon change with a short fade.
9. **Integration target:** **Given** the real action, **when** the network call fails, **then** the failure label is understandable, the previous state is still correct on the server, and retrying is safe.
