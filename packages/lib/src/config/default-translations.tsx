import React, { Fragment } from "react";

export const defaultTranslations = {
    emptyDataMessage: "No data",
    inputCaretDown: "Click to see all options",
    inputCloseValue: "Click to clear the value",
    datePickerCalendarButtonLabel: "Click to open a date picker",
    inputOptionalLabel: "Optional",
    autocompleteEmpty: "Nothing here...",

    tableGroupLabel: "Group",
    tableGroupLabelWithCount: "Group",
    tableSortAsc: "Ascending",
    tableSortOrderByLabel: "Order by",
    tableSortOrderInputPlaceholder: "Order by",
    tableSortOrderInputTitle: "Order by",
    tableSortTypeInputPlaceholder: "Ascending",
    tableSortTypeInputTitle: "Sort type",
    tableSortAddButton: "Add sort",
    tableSortDropdownTitle: "Order by",
    tableSortDesc: "Descending",
    tableColumnResizer: "Resize column",

    tableFilterTypeContains: "Contains",
    tableFilterTypeIs: "Is",
    tableFilterTypeIsNot: "Is not",
    tableFilterTypeNotContains: "Not contains",
    tableFilterTypeLessThan: "Less than",
    tableFilterTypeGreaterThan: "Greater than",
    tableFilterTypeStartsWith: "Starts with",
    tableFilterTypeEndsWith: "Ends with",

    tableFilterNewFilter: "New filter",

    tableFilterColumnTitle: "Filter by",
    tableFilterColumnPlaceholder: "Filter by",

    tableFilterOperatorTitle: "Operation",
    tableFilterOperatorPlaceholder: "Equals to...",

    tableFilterValueTitle: "Value",
    tableFilterValuePlaceholder: "Something...",

    tableFilterLabel: "Filters",
    tableFilterDropdownTitle: "Filters",
    tableFilterDropdownTitleUnique: "Filter by",

    tablePaginationPrevious: "Previous",
    tablePaginationNext: "Next",
    tablePaginationSelectLabel: "Select the size of page",
    tablePaginationFooter: (pagination: {
        pages: number;
        totalItems: number;
        sizes?: number[];
        current: number;
        select: React.ReactNode
    }) => (
        <Fragment>
            {pagination.current} to {pagination.pages} of {pagination.totalItems} items.
            {Array.isArray(pagination.sizes) ? pagination.select : null} per page.
        </Fragment>
    ),
    calendarFromDate: "From",
    calendarToDate: "To",
    calendarToday: "Today",
    calendarBackMonth: "Back month",
    calendarNextMonth: "Next month",
    calendarMonthLabel: "Month",

    multiSelectSelectedLabel: "Selected",
    multiSelectInnerPlaceholder: "Search...",

    commandPaletteEmpty: "Nothing here...",
};

export type Translations = typeof defaultTranslations;
