import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, Fragment } from "react";
const defaultTranslations = {
    inputCaretDown: "Click to see all options",
    datePickerCalendarButtonLabel: "Click to open a date picker",
    inputOptionalLabel: "Optional",
    tableSortAsc: "Ascending",
    tableSortOrderByLabel: "Order by",
    tableSortOrderInputPlaceholder: "Order by",
    tableSortOrderInputTitle: "Order by",
    tableSortTypeInputPlaceholder: "Ascending",
    tableSortTypeInputTitle: "Sort type",
    tableSortAddButton: "Add sort",
    tableSortDropdownTitle: "Order by",
    tableSortDesc: "Descending",
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
    tablePaginationFooter: (pagination) => _jsxs(Fragment, { children: [pagination.current, " to ", pagination.pages, " of ", pagination.totalItems, " items.", Array.isArray(pagination.sizes) ? (pagination.select) : null, " per page."] })
};
const Context = createContext({ translations: defaultTranslations });
export const ComponentsProvider = (props) => {
    const memoMap = useMemo(() => ({ translations: Object.assign(Object.assign({}, defaultTranslations), props.map) }), [props.map]);
    return _jsx(Context.Provider, { value: memoMap, children: props.children });
};
export const useTranslations = () => {
    const ctx = useContext(Context);
    if (!ctx)
        return defaultTranslations;
    return ctx.translations;
};
