# MorphSelect acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Current behavior:** **Given** the trigger, **when** it renders, **then** it is a combobox named by the label and the current value (or the placeholder), with `aria-haspopup="listbox"`, `aria-expanded="false"` and no `aria-controls`.
2. **Current behavior:** **Given** the closed trigger, **when** Enter, Space, ArrowDown or ArrowUp is pressed, **then** the list opens on the selected option (or the first enabled one); Home and End open it on the first or last enabled option; a printable character opens it on the first match, or starts a search when search is on.
3. **Current behavior:** **Given** the open list without search, **when** arrows, PageUp/PageDown (eight at a time), Home and End are pressed, **then** the active option, exposed through `aria-activedescendant`, moves, skipping disabled options and stopping at the ends. Typing jumps to a matching label and repeating a letter cycles.
4. **Current behavior:** **Given** the open list, **when** Enter, Space or Alt+ArrowUp is pressed, **then** the active option is picked, `onValueChange(value, option)` runs, the list closes and focus returns to the trigger. A disabled option cannot be picked.
5. **Current behavior:** **Given** the open list, **when** Escape is pressed, **then** it closes without picking and focus returns to the trigger. **When** Tab is pressed, **then** it closes without picking and focus moves on. A press outside also closes it.
6. **Current behavior:** **Given** more than eight options (or `searchable`), **when** it opens, **then** the search input becomes the combobox and has focus, the trigger is hidden from assistive technology, typing filters by label, meta and keywords ignoring case and accents, groups left empty disappear, Space types a space, and Enter picks the first match.
7. **Current behavior:** **Given** a search, **when** the results change, **then** a polite status announces the result count or "No matches", and no listbox is exposed when there are no matches.
8. **Current behavior:** **Given** groups, **when** the list is open, **then** each group is labelled by its heading and navigation treats the options as one flat list.
9. **Current behavior:** **Given** `name`, **when** a native form is submitted, **then** the selected value (or an empty string) is included.
10. **Current behavior:** **Given** a controlled `value`, **when** an option is picked, **then** the trigger changes only when the parent passes the new value. `null` shows the placeholder.
11. **Current behavior:** **Given** a trigger near the bottom of the viewport, **when** it opens, **then** the surface grows upward; near a side edge, **then** the surface never extends past the viewport on the side it grows toward.
12. **Current behavior:** **Given** reduced motion, **when** it opens and closes, **then** the surface changes size at once.
13. **Integration target:** **Given** the consuming layout, **when** the select is placed in a container with `overflow: hidden`, **then** verify the surface is not clipped, or move the select out of that container.
