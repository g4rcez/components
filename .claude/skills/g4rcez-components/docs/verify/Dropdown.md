# Dropdown acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Given** a closed named panel with noninteractive trigger content, **when** the button is clicked, tapped, or activated with Enter/Space, **then** the panel opens and the trigger exposes expanded state, with no nested interactive controls.
2. **Given** an open nonmodal panel with focusable children, **when** Tab or Shift+Tab is used, **then** focus follows a predictable order through the controls and can leave the panel. Do not expect arrow-key menu navigation or a modal trap.
3. **Given** a controlled open panel, **when** Escape or outside press requests dismissal, **then** `onChange(false)` is reported and visibility stays unchanged until the parent updates `open`. Verify focus return for keyboard dismissal.
4. **Given** a consumer-provided Close `Button`, **when** it is activated, **then** the parent closes the panel and focus returns to a usable trigger. Selecting another child action closes the panel only if the consumer requests it.
5. **Given** an icon-only trigger and a titleless panel, **when** their accessibility properties are inspected, **then** `buttonProps` names the button and panel ARIA props name the dialog separately. Verify announcements and unobscured touch/focus access in the target viewport.
