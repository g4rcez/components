# Form acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

These are integration targets, not recorded test results or accessibility certification.

1. **Given** invalid values and a submit `Button`, **when** a user requests submission by click, tap, `Enter`, or `Space`, **then** saving is refused, specific field errors stay visible, entered values stay, and focus reaches the documented summary or first invalid field.
2. **Given** a hint and a detected field error, **when** a user navigates that field with assistive technology, **then** its label, required/invalid state, hint, and correction text are available. If a summary exists, keyboard/touch activation of each link focuses the correct same-page field without duplicate announcements.
3. **Given** several errors, **when** a user corrects and revalidates one field, **then** only that field's error/state and summary entry update, other errors and values stay, and editing focus is not interrupted.
4. **Given** `useForm` submission integration, **when** the schema rejects data and its callback receives `success: false`, **then** no save happens and the consumer exposes the supplied issues. Native `reportValidity` is not an error summary and does not guarantee schema-error focus.
5. **Given** an asynchronous check or save, **when** it is pending, fails, or completes, **then** pending/service-failure feedback is distinguishable from field validation, stale checks do not overwrite newer values, and success shows only after completion without sensitive values.
