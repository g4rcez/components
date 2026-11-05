# Select acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

This documentation review did not exercise these checks or consumer targets.

1. **Current behavior:** **Given** labeled options and a controlled value, **when** a pointer, touch, or native keyboard interaction chooses an enabled option, **then** `onChange` contains that option value and the display shows the accepted parent value.
2. **Browser check:** **Given** focus on the select, **when** the platform keys for opening, navigation, and confirmation and Tab/Shift+Tab are used, **then** options are usable, focus continues through the form, and the field focus treatment stays visible.
3. **Current behavior:** **Given** an enabled select, **when** the caret button is activated, **then** focus moves to the select. Opening the native picker is not an implemented caret action.
4. **Current behavior:** **Given** `disabled` or a disabled option, **when** selection is attempted, **then** native interaction cannot change that unavailable choice. `loading` alone is not an interaction lock.
5. **Consumer target:** **Given** an optional or invalid selection, **when** supported assistive technology inspects and uses the field, **then** the persistent name, current value, required, disabled, and invalid state, and applicable description are available. Clearing works only when the consumer supplies a selectable empty option.
