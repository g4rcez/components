---
title: "Accessible composite range input"
type: approach
scope: project
created: 2026-07-14
source: "DatePicker editable range inputs"
---

## Accessible composite range input

### Trigger

When one design-system control must expose multiple editable values while
submitting one canonical form value.

### Approach

1. Keep each editable value as a real, independently named textbox inside one
   labelled `fieldset`; do not place multiple controls inside one `label`.
2. Reuse the existing mask and input style contracts, then keep the canonical
   combined value in one hidden named input.
3. Separate direct text editing from staged calendar editing: valid text edits
   commit immediately while an open calendar commits through Apply/Cancel.
4. Keep synchronous refs for the latest committed and draft ranges. Masked inputs
   can emit several events before React state rerenders; building the next range
   from state closures can erase the sibling date.
5. Validate semantics with role-based tests and axe, behavior with focused unit
   tests, and the complete interaction in the docs browser.

### Why it worked

The visible inputs remain keyboard- and screen-reader-friendly without changing
form payload compatibility. Reusing stable selectors preserves the library's
visual language instead of copying the reference component.

### Reuse checklist

- [ ] Each sub-input has a localized accessible name.
- [ ] The composite has one visible and semantic group label.
- [ ] Only the canonical hidden input owns the public form name.
- [ ] Partial masked input remains editable and resets safely on blur.
- [ ] Direct and staged changes have explicit commit behavior.
- [ ] Unit, axe, and browser checks cover the interaction.

### Links

- Related: DatePicker range mode
