# Input acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

They are integration targets, not recorded test results or accessibility certification.

1. **Given** a visible title and unique control ID, **when** the label is activated or the field gets keyboard focus, **then** the correct field has visible focus, and native editing, paste, and Tab navigation work with no focus trap.
2. **Given** an email field with stated requirements, **when** invalid input is validated, **then** a specific correction message appears and the address stays. Correcting and revalidating removes the message without claiming the address exists.
3. **Given** a search field, **when** a query is submitted or filtering settles, **then** result, empty, and pending feedback are available and focus does not move unexpectedly.
4. **Given** a masked password and a consumer-provided visibility button, **when** a pointer or the keyboard activates the button, **then** its name and the input type change, value and button focus stay, no form submission occurs, and the password is not announced.
5. **Given** a persistent hint and a detected error, **when** assistive technology inspects the field, **then** it exposes name, type, required and invalid state, hint, and correction text. Verify announcement timing in the consuming application.
