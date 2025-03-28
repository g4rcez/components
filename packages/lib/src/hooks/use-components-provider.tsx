"use client";
import React, { createContext, Fragment, PropsWithChildren, useContext, useMemo } from "react";
import { parsers } from "../../preset.tailwind";
import { Locales } from "the-mask-input";

const defaultTranslations = {
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
  tablePaginationFooter: (pagination: { pages: number; totalItems: number; sizes?: number[]; current: number; select: React.ReactNode }) => (
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

  multiComboboxSelectedLabel: "Selected",
  multiComboboxInnerPlaceholder: "Search...",
};

export type Translations = typeof defaultTranslations;

export type Tweaks = {
  input: {
    iconFeedback: boolean;
  };
};

const defaultTweaks: Tweaks = {
  input: {
    iconFeedback: true,
  },
};

type ContextType = Partial<{
  tweaks: Tweaks;
  map: Translations;
  locale: Locales | undefined;
  parser: typeof parsers.hsla;
}>;

type ContextProps = Partial<{
  tweaks: Partial<Tweaks>;
  map: Partial<Translations>;
  locale: Locales | undefined;
  parser: typeof parsers.hsla;
}>;

const Context = createContext<ContextType>({
  tweaks: defaultTweaks,
  parser: parsers.hsla,
  map: defaultTranslations,
  locale: undefined as Locales | undefined,
});

export const ComponentsProvider = (props: PropsWithChildren<ContextProps>) => {
  const memoMap = useMemo<ContextType>(
    () => ({
      locale: props.locale,
      tweaks: { ...defaultTweaks, ...props.tweaks },
      parser: props.parser || parsers.hsla,
      map: { ...defaultTranslations, ...props.map },
    }),
    [props]
  );
  return <Context.Provider value={memoMap}>{props.children}</Context.Provider>;
};

export const useLocale = (locale?: Locales): Locales | undefined => {
  if (!!locale) return locale;
  const ctx = useContext(Context);
  if (!ctx) return undefined;
  return ctx.locale || locale;
};

export const useTranslations = () => {
  const ctx = useContext(Context);
  if (!ctx) return defaultTranslations;
  return ctx.map!;
};

export const useColorParser = () => {
  const ctx = useContext(Context);
  if (!ctx) return parsers.hsla;
  return ctx.parser!;
};

export const useTweaks = (): Tweaks => {
  const ctx = useContext(Context);
  if (!ctx) return defaultTweaks;
  return ctx.tweaks!;
};
