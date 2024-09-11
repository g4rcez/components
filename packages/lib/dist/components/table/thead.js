import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, Reorder } from "framer-motion";
import { PlusIcon, SearchIcon, ZoomInIcon } from "lucide-react";
import { Dropdown } from "../floating/dropdown";
import { ColumnHeaderFilter, createFilterFromCol, useOperators } from "./filter";
import { SorterHead } from "./sort";
import { getLabel } from "./table-lib";
import { useTranslations } from "../../hooks/use-translate-context";
import { Order } from "linq-arrays";
const targetTransitionAnimate = { opacity: 1 };
const whileDrag = { opacity: 0.75, backgroundColor: "var(--table-border)" };
const exit = { opacity: 0, transition: { duration: 0.4, type: "spring" } };
const HeaderChild = (props) => {
    var _a, _b;
    const translation = useTranslations();
    const ownFilters = props.filters.filter((x) => x.name === props.header.id);
    const hasFilters = ownFilters.length > 0;
    const FilterIcon = hasFilters ? ZoomInIcon : SearchIcon;
    const { operationOptions, operations } = useOperators();
    const onDelete = (e) => {
        const id = e.currentTarget.dataset.id || "";
        return props.setFilters((prev) => prev.filter((x) => x.id !== id));
    };
    const ownSorter = props.sorters.find(x => props.header.id === x.value);
    const ariaSort = !(ownSorter === null || ownSorter === void 0 ? void 0 : ownSorter.type) ? "none" : ownSorter.type === Order.Asc ? "ascending" : "descending";
    const label = getLabel(props.header);
    return (_jsx(Reorder.Item, Object.assign({}, props.header.thProps, { as: "th", exit: exit, initial: false, dragSnapToOrigin: true, dragDirectionLock: true, role: "columnheader", value: props.header, whileDrag: whileDrag, "aria-sort": ariaSort, "aria-busy": props.loading, animate: targetTransitionAnimate, className: `hidden font-medium px-2 py-4 first:table-cell md:table-cell ${(_b = (_a = props.header.thProps) === null || _a === void 0 ? void 0 : _a.className) !== null && _b !== void 0 ? _b : ""}`, children: _jsx("span", { className: "flex items-center justify-between", children: _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Dropdown, { arrow: true, trigger: _jsxs("span", { children: [_jsxs("span", { id: `${props.header.id}-filter-dropdown-button`, className: "sr-only", children: [translation.tableFilterDropdownTitleUnique, " ", label] }), _jsx(FilterIcon, { "aria-labelledby": `${props.header.id}-filter-dropdown-button`, size: 14 })] }), title: _jsxs("span", { children: [translation.tableFilterDropdownTitleUnique, " ", _jsx("span", { className: "text-primary", children: label })] }), children: (ownFilters.length === 0) === null ? null : (_jsxs("ul", { className: "font-medium", children: [ownFilters.map((filter) => (_jsx("li", { className: "my-1", children: _jsx(ColumnHeaderFilter, { onDelete: onDelete, filter: filter, set: props.setFilters }) }, `thead-filter-${filter.id}`))), _jsx("li", { children: _jsxs("button", { onClick: () => props.setFilters((prev) => prev.concat(createFilterFromCol(props.header, operationOptions, operations))), type: "button", className: "text-primary flex items-center gap-1", children: [_jsx(PlusIcon, { size: 14 }), " ", translation.tableFilterNewFilter] }) })] })) }), _jsx("span", { className: "pointer-events-auto text-balance text-base", children: props.header.thead }), _jsx(SorterHead, { col: props.header, setSorters: props.setSorters, sorters: props.sorters })] }) }) })));
};
export const TableHeader = (props) => (_jsx(Reorder.Group, { as: "tr", role: "row", axis: "x", drag: true, layout: true, layoutRoot: true, layoutScroll: true, initial: false, values: props.headers, onReorder: props.setCols, className: "bg-table-background border-none text-lg", children: _jsx(AnimatePresence, { children: props.headers.map((header) => (_jsx(HeaderChild, { loading: props.loading, setFilters: props.setFilters, filters: props.filters, setSorters: props.setSorters, sorters: props.sorters, header: header }, `header-child-item-${header.id}`))) }) }));
