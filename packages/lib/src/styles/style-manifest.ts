import { tagStyles } from "../components/core/tag.styles";
import { formStyles } from "../components/form/form.styles";
import { inputStyles } from "../components/form/input.styles";
import { selectStyles } from "../components/form/select.styles";
import { sliderStyles } from "../components/form/slider.styles";
import { switchStyles } from "../components/form/switch.styles";
import { tableStyles } from "../components/table/table.styles";
import { cardStyles } from "../components/display/card.styles";
import { listStyles } from "../components/display/list.styles";
import { stepStyles } from "../components/display/step.styles";
import { tabsStyles } from "../components/display/tabs.styles";
import { alertStyles } from "../components/display/alert.styles";
import { emptyStyles } from "../components/display/empty.styles";
import { statsStyles } from "../components/display/stats.styles";
import { menuStyles } from "../components/floating/menu.styles";
import { checkboxStyles } from "../components/form/checkbox.styles";
import { radioboxStyles } from "../components/form/radiobox.styles";
import { textareaStyles } from "../components/form/textarea.styles";
import { pageCalendarStyles } from "../components/page-calendar/page-calendar.styles";
import { polymorphStyles } from "../components/core/polymorph.styles";
import { modalStyles } from "../components/floating/modal.styles";
import { taskListStyles } from "../components/form/task-list.styles";
import { typographyStyles } from "../components/core/typography.styles";
import { masonryStyles } from "../components/display/masonry.styles";
import { spinnerStyles } from "../components/display/spinner.styles";
import { expandStyles } from "../components/floating/expand.styles";
import { wizardStyles } from "../components/floating/wizard.styles";
import { calendarStyles } from "../components/display/calendar.styles";
import { progressStyles } from "../components/display/progress.styles";
import { timelineStyles } from "../components/display/timeline.styles";
import { toolbarStyles } from "../components/floating/toolbar.styles";
import { tooltipStyles } from "../components/floating/tooltip.styles";
import { datePickerStyles } from "../components/form/date-picker.styles";
import { fileUploadStyles } from "../components/form/file-upload.styles";
import { inputFieldStyles } from "../components/form/input-field.styles";
import { dropdownStyles } from "../components/floating/dropdown.styles";
import { autocompleteStyles } from "../components/form/autocomplete.styles";
import { multiSelectStyles } from "../components/form/multi-select.styles";
import { renderOnViewStyles } from "../components/core/render-on-view.styles";
import { notificationsStyles } from "../components/display/notifications.styles";
import { commandPaletteStyles } from "../components/floating/command-palette.styles";
import { buttonStyles } from "../components/core/button.styles";
import { headingStyles } from "../components/core/heading.styles";
import { resizableStyles } from "../components/core/resizable.styles";
import { shortcutStyles } from "../components/display/shortcut.styles";
import { skeletonStyles } from "../components/display/skeleton.styles";
import { freeTextStyles } from "../components/form/free-text.styles";
import { pageCalendarHeaderStyles } from "../components/page-calendar/calendar-header.styles";
import { pageCalendarDayViewStyles } from "../components/page-calendar/day-view.styles";
import { pageCalendarEventPillStyles } from "../components/page-calendar/event-pill.styles";
import { pageCalendarMonthViewStyles } from "../components/page-calendar/month-view.styles";
import { pageCalendarWeekViewStyles } from "../components/page-calendar/week-view.styles";
import { tableFilterStyles } from "../components/table/filter.styles";
import { tableGroupStyles } from "../components/table/group.styles";
import { tableRootStyles } from "../components/table/index.styles";
import { tableInnerTableStyles } from "../components/table/inner-table.styles";
import { tableMetadataStyles } from "../components/table/metadata.styles";
import { tablePaginationStyles } from "../components/table/pagination.styles";
import { tableRowStyles } from "../components/table/row.styles";
import { tableSortStyles } from "../components/table/sort.styles";
import { tableHeadStyles } from "../components/table/thead.styles";

const componentStyles = [
    tagStyles,
    formStyles,
    inputStyles,
    selectStyles,
    sliderStyles,
    switchStyles,
    tableStyles,
    cardStyles,
    listStyles,
    stepStyles,
    tabsStyles,
    alertStyles,
    emptyStyles,
    statsStyles,
    menuStyles,
    checkboxStyles,
    radioboxStyles,
    textareaStyles,
    pageCalendarStyles,
    polymorphStyles,
    modalStyles,
    taskListStyles,
    typographyStyles,
    masonryStyles,
    spinnerStyles,
    expandStyles,
    wizardStyles,
    calendarStyles,
    progressStyles,
    timelineStyles,
    toolbarStyles,
    tooltipStyles,
    datePickerStyles,
    fileUploadStyles,
    inputFieldStyles,
    dropdownStyles,
    autocompleteStyles,
    multiSelectStyles,
    renderOnViewStyles,
    notificationsStyles,
    commandPaletteStyles,
    buttonStyles,
    headingStyles,
    resizableStyles,
    shortcutStyles,
    skeletonStyles,
    freeTextStyles,
    pageCalendarHeaderStyles,
    pageCalendarDayViewStyles,
    pageCalendarEventPillStyles,
    pageCalendarMonthViewStyles,
    pageCalendarWeekViewStyles,
    tableFilterStyles,
    tableGroupStyles,
    tableRootStyles,
    tableInnerTableStyles,
    tableMetadataStyles,
    tablePaginationStyles,
    tableRowStyles,
    tableSortStyles,
    tableHeadStyles,
] as const;

type ComponentStyle = (typeof componentStyles)[number];
type ManifestClassContract = {
    base: string;
    variants: Record<string, Record<string, string>>;
    slots: Record<string, string>;
    compounds: readonly string[];
};
type ManifestEntry = {
    import: `@g4rcez/components/${string}`;
    css: `@g4rcez/components/${string}.css`;
    dependencies: readonly string[];
    classes: ManifestClassContract;
};

const byName = new Map<string, ComponentStyle>(componentStyles.map((component) => [component.name, component]));

const resolveDependencies = (name: string, seen = new Set<string>()): string[] => {
    const component = byName.get(name);
    if (!component) return [];

    const result: string[] = [];
    for (const dependency of component.dependencies ?? []) {
        if (seen.has(dependency)) continue;
        seen.add(dependency);
        result.push(...resolveDependencies(dependency, seen), dependency);
    }

    return [...new Set(result)].sort((a, b) => a.localeCompare(b));
};

const toManifestEntry = (component: ComponentStyle): ManifestEntry => ({
    import: `@g4rcez/components/${component.name}`,
    css: component.css,
    dependencies: resolveDependencies(component.name),
    classes: {
        base: component.classes.base,
        variants: component.classes.variants,
        slots: component.slots,
        compounds: component.classes.compounds,
    },
});

export const componentStyleManifest = Object.fromEntries(
    componentStyles.map((component) => [component.name, toManifestEntry(component)] as const)
) as Record<(typeof componentStyles)[number]["name"], ManifestEntry>;

export type ComponentStyleManifest = typeof componentStyleManifest;
