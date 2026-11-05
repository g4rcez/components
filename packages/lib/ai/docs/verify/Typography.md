# Typography acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Given** a page-title composition, **when** the document outline is inspected, **then** its fixed `h2` fits the surrounding hierarchy or a correctly leveled `Heading` composition replaces it.
2. **Given** title actions, **when** the user navigates by keyboard, **then** static title text is skipped, and actions get visible focus in reading order.
3. **Given** a narrow viewport or enlarged text, **when** the title and actions wrap, **then** their full text stays readable and all actions stay operable.
4. **Given** heading navigation with assistive technology, **when** the title is reached, **then** its topic and level are available. Supporting paragraphs do not masquerade as headings.
