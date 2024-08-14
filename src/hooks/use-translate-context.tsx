import { createContext, useContext, PropsWithChildren, useMemo } from "react"

const defaultTranslations = {
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
  tableFilterDropdownTitleUnique: "Filter by"
}

type Translations = typeof defaultTranslations;

const Context = createContext(defaultTranslations)

export const ComponentsProvider = (props: PropsWithChildren<{ map: Partial<Translations> }>) => {
  const memoMap = useMemo(() => ({ ...defaultTranslations, ...props.map }), [props.map])
  return <Context.Provider value={memoMap}>{props.children}</Context.Provider>
}

export const useTranslations = () => {
  const ctx = useContext(Context)
  if (!ctx) return defaultTranslations;
  return ctx
}
