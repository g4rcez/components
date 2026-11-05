# Notifications acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

These are integration targets, not exercised accessibility tests. Naming and full-stack access expose current gaps.

1. **Given** an action completes while its control has focus, **when** a toast appears, **then** the outcome is available in text without moving task focus. Check the polite-region update with the intended assistive technologies.
2. **Given** a displayed toast has an action or close control, **when** a user reaches it by keyboard or touch, **then** it has a clear name, visible focus, and usable activation/dismissal. Verify focus returns to a surviving toast or task control. The built-in close name is currently missing.
3. **Given** a timed message or loading update, **when** a user reads, focuses, hovers, updates, or dismisses it, **then** the chosen duration and pause policy allow use without losing an action. `timeout: 0` does not auto-expire. Loading alone is not a persistence mechanism.
4. **Given** more than three updates or a critical failure, **when** the stack hides or removes a message, **then** essential information and recovery stay available through persistent, keyboard/touch-reachable task content.
5. **Given** long text, zoom, or a virtual keyboard, **when** feedback appears and a user reads it, **then** truncation does not hide essential wording and the stack does not cover controls needed to continue the task.
