# Slider acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** a single-value array and valid bounds and step, **when** the thumb is dragged or the track is pressed, **then** Base UI proposes a bounded numeric value through `onValueChange`. A controlled consumer that accepts it updates the thumb and the persistent value display.
2. **Current behavior:** **Given** focus on a single native range input in horizontal LTR mode, **when** arrows, Home/End, and Page Up/Page Down are used, **then** the value changes by `step`, reaches `min` or `max`, or changes by `largeStep` within the bounds.
3. **Current behavior:** **Given** a disabled slider with rendered thumbs, **when** pointer or keyboard adjustment is attempted, **then** the disabled native range inputs do not accept a value change.
4. **Integration target:** **Given** a labeled two-thumb range, **when** each thumb is reached and adjusted, **then** focus stays visible, the permitted ordering and separation hold, and the shared name plus endpoint and value information is understandable. Distinct consumer-authored thumb names are not exposed.
5. **Integration target (current gap):** **Given** exact values or units matter, **when** any input method changes the value, **then** a persistent consumer display or a synchronized `Input` shows the accepted value. If a tooltip is enabled, verify its number separately. The current observer wiring does not meet this target.
