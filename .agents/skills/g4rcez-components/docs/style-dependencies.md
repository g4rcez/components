# @g4rcez/components style dependencies

Generated from the component style manifest. Do not edit by hand.

Import order: `@g4rcez/components/foundation.css`, then each file in Needs, then the component CSS. Prefix every file with `@g4rcez/components/`.

Selectors: base `__<component>`, variant `__<component>--<variant>-<value>`, slot `__<component>__<slot>`. A `-` cell means none.

| Component | CSS | Needs | Variants (name=values) | Slots |
|---|---|---|---|---|
| alert | alert.css | polymorph.css | theme=primary/danger/info/success/secondary/warn/muted/neutral | container, collapse, content, close-button, close-icon, header, icon, title, body |
| autocomplete | autocomplete.css | free-text.css, input-field.css, polymorph.css, select.css, tooltip.css | size=big/default/min/normal/small/tiny | list, item, option, field-state, disabled-border, actions, action, input-icon, sr-label, input, control-state, panel, empty, empty-text, scroll |
| button | button.css | - | size=icon/big/default/min/tiny/small; rounded=rough/squared/default/circle; theme=raw/disabled/loading/main/info/warn/muted/danger/neutral/outlined/primary/success/secondary/ghost-info/ghost-warn/ghost-danger/ghost-primary/ghost-success/ghost-secondary/ghost-muted/ghost-neutral | icon |
| calendar | calendar.css | input.css, input-field.css, polymorph.css, tooltip.css | - | day-cell, day-button, range-label, range-label-text, viewport, month-page, month-header, previous-button, next-button, nav-icon, current-month, month-controls, month-select, year-input, table, weekday, datetime, time-input, footer, today-button, numeric |
| card | card.css | polymorph.css | - | body, title, content, skeleton, skeleton-line, header, heading, actions, stats-container, stats-body, stats-panel, stats-icon, stats-content, stats-title, stats-loading, stats-value, border |
| checkbox | checkbox.css | - | size=big/default/min/normal/small/tiny/medium/large; task=true/false | label, control, control-state, error |
| command-palette | command-palette.css | button.css, modal.css | - | body, group-label, group-row, item, item-content, loading-row, header, search-icon-frame, search-icon, input, controls, filters, loading-list, content, list, preview, preview-empty, empty, footer |
| date-picker | date-picker.css | calendar.css, dropdown.css, input.css, input-field.css, polymorph.css, tooltip.css | - | calendar-icon, sr-label, range-calendar, range-header, range-nights, range-fields, range-field, range-header-field, range-header-field-label, range-header-field-value, range-header-field-divider, range-control, range-input, range-separator, panel, presets, preset-list, preset-button, actions, actions-confirm, today-action, cancel-action, apply-action |
| drawing-editor | drawing-editor.css | alert.css, button.css, checkbox.css, free-text.css, input.css, input-field.css, polymorph.css, resizable.css, select.css, textarea.css, tooltip.css | - | toolbar, workspace, viewport, stage, canvas-frame, overlay, selection, layers, layer-list, properties |
| dropdown | dropdown.css | - | - | arrow, header, title |
| empty | empty.css | - | - | icon, message |
| expand | expand.css | button.css | - | content |
| file-upload | file-upload.css | button.css, modal.css | - | accent, actions, aside, column, dropzone, file-details, file-icon, file-row, idle, idle-copy, idle-icon, idle-icon-wrap, item, list, preview-button, preview-image, remove-button, remove-icon, row, size, stack, thumb-icon, viewer-image, viewer-name, viewer-size, viewer-video |
| form | form.css | - | - | - |
| free-text | input.css | input-field.css, polymorph.css, tooltip.css | size=big/default/min/normal/small/tiny | disabled-border, field-state, input, input-state, invalid, placeholder, resizable, surface, transition |
| heading | heading.css | polymorph.css | - | - |
| input | input.css | input-field.css, polymorph.css, tooltip.css | - | - |
| input-field | input.css | polymorph.css, tooltip.css | size=big/default/min/normal/small/tiny | border, control, control-disabled, control-state, control-surface, error, error-state, error-text, feedback, feedback-body, feedback-hidden, feedback-icon, feedback-state, feedback-text, fieldset, label, label-active, label-disabled, label-layout, label-meta, label-row, label-state, optional, optional-state, optional-text, slot, slot-end, slot-start, sr-only, status, status-error, status-icon, status-indicator, status-success, tooltip-body, tooltip-content, tooltip-icon, tooltip-trigger |
| list | list.css | button.css, modal.css | - | overlay, floating-layer, detail-card, close-nav, close-button, header, title, description, item, item-shell, item-row, avatar-frame, avatar-button, item-body, item-content, item-action |
| masonry | masonry.css | polymorph.css | - | item |
| menu | menu.css | - | - | item, floating, nested-indicator, nested-icon, item-icon, sr-label |
| modal | modal.css | button.css | type=dialog/drawer/sheet; position=none/right/left | resizer, sheet-pill, overlay, content, sr-description, header, title, body, footer, close-control, close-button, close-icon, confirm-dialog, confirm-actions, confirm-description |
| multi-select | multi-select.css | free-text.css, input-field.css, polymorph.css, select.css, tag.css, tooltip.css | size=big/default/min/normal/small/tiny | action, actions, caret-icon, checkbox, control-state, empty, empty-text, field, footer, input, invalid, item, list, option, overlay, overflow, panel, placeholder, placeholder-text, results, scroll, search, sr-label, surface, tag-remove, tag-remove-icon, tags, transition, value |
| notifications | notifications.css | - | theme=default/info/warn/muted/danger/success/secondary | item, content, icon, text, title, description, action, close, close-icon, viewport, badge |
| page-calendar | page-calendar.css | button.css, calendar.css, date-picker.css, dropdown.css, input.css, input-field.css, page-calendar-day-view.css, page-calendar-event-pill.css, page-calendar-header.css, page-calendar-month-view.css, page-calendar-week-view.css, polymorph.css, spinner.css, tag.css, tooltip.css | - | - |
| page-calendar-day-view | page-calendar.css | button.css, page-calendar-event-pill.css, polymorph.css, tag.css | - | event-dot, root, main, header, day-badge, weekday, date-label, scroll-body, gutter, hour-row, hour-label, grid, time-slot, event, side-panel, detail, event-title, detail-meta, event-tag |
| page-calendar-event-pill | page-calendar.css | button.css | - | button, title, time |
| page-calendar-header | page-calendar.css | button.css, calendar.css, date-picker.css, dropdown.css, input.css, input-field.css, polymorph.css, tag.css, tooltip.css | - | root, toolbar, date-summary, date-badge, month-label, day-number, title, week-label, nav, nav-buttons, nav-icon, today-button, date-picker, view-switch, view-button, add-icon, filters, filter-icon-wrapper, filter-icon, filter-label |
| page-calendar-month-view | page-calendar.css | button.css, page-calendar-event-pill.css | - | root, grid, weekday-row, weekday, week-row, day-cell, day-button, day-badge, add-indicator, events, event-list |
| page-calendar-week-view | page-calendar.css | button.css, page-calendar-event-pill.css | - | root, header, gutter, weekday, weekday-name, day-badge, scroll-body, hour-row, hour-label, day-column, time-slot, event |
| pdf-viewer | pdf-viewer.css | alert.css, button.css, free-text.css, input-field.css, polymorph.css, select.css, tooltip.css | - | toolbar, page |
| polymorph | polymorph.css | - | - | - |
| progress | progress.css | - | - | indicator, label |
| radiobox | radiobox.css | - | size=medium/large | label, control, control-state |
| render-on-view | render-on-view.css | polymorph.css | - | - |
| resizable | resizable.css | - | - | content |
| rich-text-editor | rich-text-editor.css | alert.css, button.css, free-text.css, input.css, input-field.css, polymorph.css, resizable.css, select.css, textarea.css, tooltip.css | - | label, modes, toolbar, content, source, fields, help, image, image-content |
| select | select.css | free-text.css, input-field.css, polymorph.css, tooltip.css | size=big/default/min/normal/small/tiny | field, trigger, trigger-icon, trigger-label, control |
| shortcut | shortcut.css | - | - | icon |
| skeleton | skeleton.css | polymorph.css | - | cell, block, list |
| slider | slider.css | polymorph.css, tooltip.css | - | control, track, indicator, thumb |
| spinner | spinner.css | - | - | container |
| stats | stats.css | - | - | header, icon, icon-svg, content, title, value, footer |
| step | step.css | - | - | connector, item, halo, marker, marker-content, status-icon, label, title |
| swipeable-list | swipeable-list.css | - | tone=neutral/primary/success/warning/danger | list, item, rail, action-group, action, action-icon, screen-reader-label, surface, item-content, leading, content, title, description, meta |
| switch | switch.css | - | size=big/default/min/normal/small/tiny | row, track, thumb, label, label-text, error |
| table | table.css | button.css, checkbox.css, dropdown.css, empty.css, free-text.css, input.css, input-field.css, polymorph.css, select.css, table-filter.css, table-group.css, table-head.css, table-inner-table.css, table-metadata.css, table-pagination.css, table-root.css, table-row.css, table-sort.css, tooltip.css | - | - |
| table-filter | table.css | dropdown.css, free-text.css, input.css, input-field.css, polymorph.css, select.css, tooltip.css | - | trigger-icon, add-icon, delete-icon, trigger-label, count-label, list, row, delete-control, danger-icon, add-button, inline-row, inline-delete-button |
| table-group | table.css | button.css, dropdown.css, free-text.css, input-field.css, polymorph.css, select.css, tooltip.css | - | drag-icon, trigger-icon, delete-icon, draggable-item, drag-handle, trigger-label, controls, clear-button, danger-icon, order-section, order-title, order-list |
| table-head | table.css | checkbox.css, dropdown.css, free-text.css, input.css, input-field.css, polymorph.css, select.css, table-filter.css, table-sort.css, tooltip.css | - | filter-icon, add-icon, properties-trigger, properties-trigger-content, properties-trigger-icon, properties-list, properties-item, properties-drag-handle, properties-drag-icon, properties-label, cell, cell-content, actions, sr-label, dropdown-title, title-strong, filter-list, filter-item, add-filter-button, label, resizer, filter-trigger, selection-cell, selection-control |
| table-inner-table | table.css | checkbox.css, dropdown.css, empty.css, free-text.css, input.css, input-field.css, polymorph.css, select.css, table-filter.css, table-head.css, table-pagination.css, table-row.css, table-sort.css, tooltip.css | - | body, table, head, row, footer, footer-row, loading-cell, loading-bar, empty, viewport, sentinel |
| table-metadata | table.css | button.css, dropdown.css, free-text.css, input.css, input-field.css, polymorph.css, select.css, table-filter.css, table-group.css, table-sort.css, tooltip.css | - | root, container, operations, active-filters, pill, dot, value-frame, ghost-value, input, trigger, trigger-label, trigger-value, trigger-icon |
| table-pagination | table.css | polymorph.css | - | root, size-select, items, page-link |
| table-root | table.css | button.css, checkbox.css, dropdown.css, empty.css, free-text.css, input.css, input-field.css, polymorph.css, select.css, table-filter.css, table-group.css, table-head.css, table-inner-table.css, table-metadata.css, table-pagination.css, table-row.css, table-sort.css, tooltip.css | - | groups, group, group-title |
| table-row | table.css | checkbox.css | - | aside, aside-overlay, aside-content, cell, cell-label, cell-frame, cell-content, selection-cell, selection-control |
| table-sort | table.css | dropdown.css, free-text.css, input-field.css, polymorph.css, select.css, tooltip.css | - | trigger-icon, delete-icon, add-icon, head-icon, trigger-label, list, row, delete-button, danger-icon, add-button, head-button, sr-label |
| tabs | tabs.css | card.css, polymorph.css | - | container, header, divider, nav, list, item, tab, indicator |
| tag | tag.css | polymorph.css | size=icon/big/default/tiny/small; appearance=solid/soft; theme=custom/info/warn/muted/danger/disabled/primary/success/neutral/secondary/loading | indicator |
| task-list | task-list.css | - | - | - |
| textarea | input.css | free-text.css, input-field.css, polymorph.css, tooltip.css | - | - |
| timeline | timeline.css | polymorph.css | - | item, connector, content, icon, body, actions |
| toolbar | toolbar.css | - | - | - |
| tooltip | tooltip.css | polymorph.css | - | arrow |
| typography | typography.css | - | - | paragraph, description, info, info-label, info-value, page-title, page-description, page-header, page-header-actions |
| video-player | video-player.css | - | - | - |
| wizard | wizard.css | button.css | - | overlay, spotlight, floating, surface, arrow, footer, skip-button, actions, counter |
