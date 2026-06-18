# @g4rcez/components style dependencies

Generated from the component style manifest. Do not edit by hand.

Import `@g4rcez/components/foundation.css` before component CSS files. Component dependencies are already resolved in the manifest and should be imported before the component that depends on them.

| Component | CSS import | Dependencies | Base class | Variants | Slots |
|---|---|---|---|---|---|
| `alert` | `@g4rcez/components/alert.css` | `polymorph.css` | `__alert` | none | `__alert__icon`, `__alert__close-icon` |
| `autocomplete` | `@g4rcez/components/autocomplete.css` | `input-field.css`, `polymorph.css`, `select.css`, `tooltip.css` | `__autocomplete` | none | `__autocomplete__caret-icon` |
| `button` | `@g4rcez/components/button.css` | none | `__button` | `size`: `icon`, `big`, `default`, `min`, `tiny`, `small`; `rounded`: `rough`, `squared`, `default`, `circle`; `theme`: `raw`, `disabled`, `loading`, `main`, `info`, `warn`, `muted`, `danger`, `neutral`, `outlined`, `primary`, `success`, `secondary`, `ghost-info`, `ghost-warn`, `ghost-danger`, `ghost-primary`, `ghost-success`, `ghost-secondary`, `ghost-muted`, `ghost-neutral` | `__button__icon` |
| `calendar` | `@g4rcez/components/calendar.css` | `input.css` | `__calendar` | none | none |
| `card` | `@g4rcez/components/card.css` | `polymorph.css` | `__card` | none | none |
| `checkbox` | `@g4rcez/components/checkbox.css` | none | `__checkbox` | `task`: `true`, `false` | none |
| `command-palette` | `@g4rcez/components/command-palette.css` | `button.css`, `modal.css` | `__command-palette` | none | `__command-palette__search-icon` |
| `date-picker` | `@g4rcez/components/date-picker.css` | `calendar.css`, `dropdown.css`, `input.css` | `__date-picker` | none | `__date-picker__calendar-icon` |
| `dropdown` | `@g4rcez/components/dropdown.css` | none | `__dropdown` | none | none |
| `empty` | `@g4rcez/components/empty.css` | none | `__empty` | none | `__empty__icon`, `__empty__message` |
| `expand` | `@g4rcez/components/expand.css` | `button.css` | `__expand` | none | none |
| `file-upload` | `@g4rcez/components/file-upload.css` | `button.css`, `modal.css` | `__file-upload` | none | `__file-upload__file-icon`, `__file-upload__remove-icon`, `__file-upload__idle-icon` |
| `form` | `@g4rcez/components/form.css` | none | `__form` | none | none |
| `free-text` | `@g4rcez/components/free-text.css` | `input-field.css`, `polymorph.css`, `tooltip.css` | `__free-text` | none | none |
| `heading` | `@g4rcez/components/heading.css` | `polymorph.css` | `__heading` | none | none |
| `input` | `@g4rcez/components/input.css` | none | `__input` | none | none |
| `input-field` | `@g4rcez/components/input-field.css` | `polymorph.css`, `tooltip.css` | `__input-field` | none | `__input-field__feedback-icon`, `__input-field__status-icon`, `__input-field__tooltip-content`, `__input-field__optional-text`, `__input-field__error` |
| `list` | `@g4rcez/components/list.css` | none | `__list` | none | none |
| `masonry` | `@g4rcez/components/masonry.css` | `polymorph.css` | `__masonry` | none | none |
| `menu` | `@g4rcez/components/menu.css` | none | `__menu` | none | `__menu__nested-indicator`, `__menu__nested-icon`, `__menu__item-icon`, `__menu__sr-label` |
| `modal` | `@g4rcez/components/modal.css` | `button.css` | `__modal` | none | `__modal__close-icon` |
| `multi-select` | `@g4rcez/components/multi-select.css` | `input-field.css`, `polymorph.css`, `select.css`, `tag.css`, `tooltip.css` | `__multi-select` | none | `__multi-select__tag-remove-icon`, `__multi-select__caret-icon`, `__multi-select__sr-label` |
| `notifications` | `@g4rcez/components/notifications.css` | none | `__notifications` | none | `__notifications__close` |
| `page-calendar` | `@g4rcez/components/page-calendar.css` | `button.css`, `page-calendar-day-view.css`, `page-calendar-event-pill.css`, `page-calendar-header.css`, `page-calendar-month-view.css`, `page-calendar-week-view.css`, `polymorph.css`, `tag.css` | `__page-calendar` | none | none |
| `page-calendar-day-view` | `@g4rcez/components/page-calendar-day-view.css` | `button.css`, `page-calendar-event-pill.css`, `polymorph.css`, `tag.css` | `__page-calendar-day-view` | none | none |
| `page-calendar-event-pill` | `@g4rcez/components/page-calendar-event-pill.css` | `button.css` | `__page-calendar-event-pill` | none | none |
| `page-calendar-header` | `@g4rcez/components/page-calendar-header.css` | `button.css`, `polymorph.css`, `tag.css` | `__page-calendar-header` | none | `__page-calendar-header__nav-icon`, `__page-calendar-header__add-icon`, `__page-calendar-header__filter-icon` |
| `page-calendar-month-view` | `@g4rcez/components/page-calendar-month-view.css` | `button.css`, `page-calendar-event-pill.css` | `__page-calendar-month-view` | none | none |
| `page-calendar-week-view` | `@g4rcez/components/page-calendar-week-view.css` | `button.css`, `page-calendar-event-pill.css` | `__page-calendar-week-view` | none | none |
| `polymorph` | `@g4rcez/components/polymorph.css` | none | `__polymorph` | none | none |
| `progress` | `@g4rcez/components/progress.css` | none | `__progress` | none | `__progress__indicator`, `__progress__label` |
| `radiobox` | `@g4rcez/components/radiobox.css` | none | `__radiobox` | none | none |
| `render-on-view` | `@g4rcez/components/render-on-view.css` | `polymorph.css` | `__render-on-view` | none | none |
| `resizable` | `@g4rcez/components/resizable.css` | none | `__resizable` | none | none |
| `select` | `@g4rcez/components/select.css` | `input-field.css`, `polymorph.css`, `tooltip.css` | `__select` | none | `__select__field`, `__select__trigger`, `__select__trigger-icon`, `__select__trigger-label`, `__select__control` |
| `shortcut` | `@g4rcez/components/shortcut.css` | none | `__shortcut` | none | `__shortcut__icon` |
| `skeleton` | `@g4rcez/components/skeleton.css` | `polymorph.css` | `__skeleton` | none | none |
| `slider` | `@g4rcez/components/slider.css` | `polymorph.css`, `tooltip.css` | `__slider` | none | `__slider__thumb` |
| `spinner` | `@g4rcez/components/spinner.css` | none | `__spinner` | none | `__spinner__container` |
| `stats` | `@g4rcez/components/stats.css` | none | `__stats` | none | `__stats__header`, `__stats__icon`, `__stats__icon-svg`, `__stats__content`, `__stats__title`, `__stats__value`, `__stats__footer` |
| `step` | `@g4rcez/components/step.css` | none | `__step` | none | none |
| `switch` | `@g4rcez/components/switch.css` | none | `__switch` | none | none |
| `table` | `@g4rcez/components/table.css` | `button.css`, `dropdown.css`, `empty.css`, `input.css`, `input-field.css`, `polymorph.css`, `select.css`, `table-filter.css`, `table-group.css`, `table-head.css`, `table-inner-table.css`, `table-metadata.css`, `table-pagination.css`, `table-root.css`, `table-row.css`, `table-sort.css`, `tooltip.css` | `__table` | none | none |
| `table-filter` | `@g4rcez/components/table-filter.css` | `dropdown.css`, `input.css`, `input-field.css`, `polymorph.css`, `select.css`, `tooltip.css` | `__table-filter` | none | `__table-filter__trigger-icon`, `__table-filter__add-icon`, `__table-filter__delete-icon` |
| `table-group` | `@g4rcez/components/table-group.css` | `button.css`, `dropdown.css`, `input-field.css`, `polymorph.css`, `select.css`, `tooltip.css` | `__table-group` | none | `__table-group__drag-icon`, `__table-group__trigger-icon`, `__table-group__delete-icon` |
| `table-head` | `@g4rcez/components/table-head.css` | `dropdown.css`, `input.css`, `input-field.css`, `polymorph.css`, `select.css`, `table-filter.css`, `table-sort.css`, `tooltip.css` | `__table-head` | none | `__table-head__filter-icon`, `__table-head__add-icon` |
| `table-inner-table` | `@g4rcez/components/table-inner-table.css` | `dropdown.css`, `empty.css`, `input.css`, `input-field.css`, `polymorph.css`, `select.css`, `table-filter.css`, `table-head.css`, `table-pagination.css`, `table-row.css`, `table-sort.css`, `tooltip.css` | `__table-inner-table` | none | `__table-inner-table__body`, `__table-inner-table__row` |
| `table-metadata` | `@g4rcez/components/table-metadata.css` | `button.css`, `dropdown.css`, `input.css`, `input-field.css`, `polymorph.css`, `select.css`, `table-filter.css`, `table-group.css`, `table-sort.css`, `tooltip.css` | `__table-metadata` | none | none |
| `table-pagination` | `@g4rcez/components/table-pagination.css` | `polymorph.css` | `__table-pagination` | none | none |
| `table-root` | `@g4rcez/components/table-root.css` | `button.css`, `dropdown.css`, `empty.css`, `input.css`, `input-field.css`, `polymorph.css`, `select.css`, `table-filter.css`, `table-group.css`, `table-head.css`, `table-inner-table.css`, `table-metadata.css`, `table-pagination.css`, `table-row.css`, `table-sort.css`, `tooltip.css` | `__table-root` | none | none |
| `table-row` | `@g4rcez/components/table-row.css` | none | `__table-row` | none | `__table-row__aside`, `__table-row__cell`, `__table-row__cell-content` |
| `table-sort` | `@g4rcez/components/table-sort.css` | `dropdown.css`, `input-field.css`, `polymorph.css`, `select.css`, `tooltip.css` | `__table-sort` | none | `__table-sort__trigger-icon`, `__table-sort__delete-icon`, `__table-sort__add-icon`, `__table-sort__head-icon` |
| `tabs` | `@g4rcez/components/tabs.css` | `card.css`, `polymorph.css` | `__tabs` | none | `__tabs__tab` |
| `tag` | `@g4rcez/components/tag.css` | `polymorph.css` | `__tag` | `size`: `icon`, `big`, `default`, `tiny`, `small`; `theme`: `custom`, `info`, `warn`, `muted`, `danger`, `disabled`, `primary`, `success`, `neutral`, `secondary`, `loading` | `__tag__indicator` |
| `task-list` | `@g4rcez/components/task-list.css` | none | `__task-list` | none | none |
| `textarea` | `@g4rcez/components/textarea.css` | none | `__textarea` | none | none |
| `timeline` | `@g4rcez/components/timeline.css` | `polymorph.css` | `__timeline` | none | none |
| `toolbar` | `@g4rcez/components/toolbar.css` | none | `__toolbar` | none | none |
| `tooltip` | `@g4rcez/components/tooltip.css` | `polymorph.css` | `__tooltip` | none | none |
| `typography` | `@g4rcez/components/typography.css` | none | `__typography` | none | none |
| `wizard` | `@g4rcez/components/wizard.css` | `button.css` | `__wizard` | none | none |
