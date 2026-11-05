# TaskList acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** independently labeled tasks, **when** one checkbox or its label is clicked or tapped, **then** only that task changes, and its checked state and strikethrough agree. The consumer must update controlled task state.
2. **Current behavior:** **Given** focus on an enabled task, **when** Space is pressed, **then** it toggles. Tab/Shift+Tab continues through the enabled tasks and out of the list, with no wrapper-specific focus trap.
3. **Current behavior:** **Given** at least one incomplete marked task and no reduced-motion preference, **when** a task change makes all marked inputs checked, **then** the scale/rotation celebration is requested and task values do not change.
4. **Current behavior:** **Given** reduced motion is preferred, **when** the last task is checked, **then** completion state changes normally and the celebration is skipped.
5. **Consumer target:** **Given** task state changes programmatically or completion needs a nonvisual summary, **when** the list updates, **then** focus stays usable and the consumer's progress/completion text matches the actual tasks. Do not rely on prop updates to trigger the celebration, or on animation to announce completion.
