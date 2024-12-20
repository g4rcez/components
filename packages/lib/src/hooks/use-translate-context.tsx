import React, { createContext, Fragment, PropsWithChildren, useContext, useMemo } from "react";
import { parsers } from "../../preset.tailwind";

const defaultTranslations = {
    inputCaretDown: "Click to see all options",
    datePickerCalendarButtonLabel: "Click to open a date picker",
    inputOptionalLabel: "Optional",

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
    tablePaginationFooter: (pagination: { pages: number; totalItems: number; sizes?: number[]; current: number; select: React.ReactNode }) => (
        <Fragment>
            {pagination.current} to {pagination.pages} of {pagination.totalItems} items.
            {Array.isArray(pagination.sizes) ? pagination.select : null} per page.
        </Fragment>
    ),

    calendarFromDate: "From",
    calendarToDate: "To",
};

type Translations = typeof defaultTranslations;

const Context = createContext({ translations: defaultTranslations, colorTokenParser: parsers.hsla });

type ContextProps = {
    parser?: typeof parsers.hsla,
    map?: Partial<Translations>
}

export const ComponentsProvider = (props: PropsWithChildren<ContextProps>) => {
    const memoMap = useMemo(
        () => ({
            translations: { ...defaultTranslations, ...props.map },
            colorTokenParser: props.parser || parsers.hsla,
        }),
        [props.map]
    );
    return <Context.Provider value={memoMap}>{props.children}</Context.Provider>;
};

export const useTranslations = () => {
    const ctx = useContext(Context);
    if (!ctx) return defaultTranslations;
    return ctx.translations;
};

export const useColorParser = () => {
    const ctx = useContext(Context);
    if (!ctx) return parsers.hsla;
    return ctx.colorTokenParser;
};
