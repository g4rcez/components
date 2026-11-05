# FileUpload acceptance criteria

Verify these in the consuming application. They are test targets, not proof of WCAG conformance.

1. **Given** an enabled upload area, **when** the user opens the picker with keyboard or touch instead of dragging, **then** the same accepted-file selection path is available.
2. **Given** existing files, **when** selection is canceled or a new file is rejected, **then** existing selections remain. A rejection explains the reason and how to correct it.
3. **Given** controlled files, **when** a file is added or removed, **then** the application updates the visible list and keeps a predictable focus destination.
4. **Given** several files, **when** controls are inspected with assistive technology, **then** each preview and removal action identifies its file and the result is perceivable.
5. **Given** `disabled`, **when** the user attempts to select or drop new files, **then** no files are added. Decide separately whether actions on already selected files stay available.
