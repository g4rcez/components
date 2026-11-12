# RollingText acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** a value, **when** it renders, **then** the full text is exposed to assistive technology exactly once and the animated glyphs are `aria-hidden`.
2. **Current behavior:** **Given** a changed value, **when** it re-renders, **then** only the characters whose position and value changed re-key and animate; the rest keep their nodes.
3. **Current behavior:** **Given** `RollingDigits`, **when** a digit appears on the left, **then** the units keep their node. Zero and negative numbers render.
4. **Current behavior:** **Given** reduced motion, **then** characters fade without travel or blur.
