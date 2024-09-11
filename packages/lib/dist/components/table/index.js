import { __rest } from "tslib";
import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import Linq from "linq-arrays";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { Is } from "sidekicker";
import { useReducer } from "use-typed-reducer";
import { useCallbackRef } from "../../hooks/use-callback-ref";
import { path } from "../../lib/fns";
import { Metadata } from "./metadata";
import { Pagination } from "./pagination";
import { multiSort } from "./sort";
import { createOptionCols } from "./table-lib";
import { TableHeader } from "./thead";
const calculateSkeletonWidth = (index) => Math.min(Math.max(index + index * (index % 2 === 0 ? 2 : 4) + 10, 50), 90);
const TableBody = React.forwardRef((props, ref) => {
    var _a;
    return (_jsx("tbody", Object.assign({}, props, { role: "rowgroup", className: `divide-y divide-table-border ${(_a = props.className) !== null && _a !== void 0 ? _a : ""}`, ref: ref, children: _jsx(AnimatePresence, { children: props.children }) })));
});
const VirtualTable = React.forwardRef((props, ref) => {
    var _a;
    return (_jsx("table", Object.assign({}, props, { ref: ref, role: "table", className: `table min-w-full divide-y divide-table-border table-auto text-left ${(_a = props.className) !== null && _a !== void 0 ? _a : ""}` })));
});
const Thead = React.forwardRef((_a, ref) => {
    var { context } = _a, props = __rest(_a, ["context"]);
    return (_jsx("thead", Object.assign({}, props, { role: "rowgroup", className: "bg-card-background shadow-xs group:sticky top-0", ref: ref })));
});
const TRow = React.forwardRef((_a, ref) => {
    var _b;
    var { context, item } = _a, props = __rest(_a, ["context", "item"]);
    return (_jsx("tr", Object.assign({}, props, { role: "row", ref: ref, className: `table-row ${(_b = props.className) !== null && _b !== void 0 ? _b : ""}` })));
});
const TFoot = React.forwardRef((props, ref) => {
    if (props.context.loadingMore) {
        return (_jsx("tfoot", Object.assign({}, props, { ref: ref, className: "bg-card-background", children: _jsx("tr", { role: "row", className: "bg-card-background", children: _jsx("td", { colSpan: 999, className: "px-2 h-14 bg-card-background", children: _jsx("span", { className: "block w-full h-2 bg-foreground rounded opacity-60 animate-pulse" }) }) }) })));
    }
    return null;
});
const components = {
    TableHead: Thead,
    Table: VirtualTable,
    TableBody: TableBody,
    TableRow: TRow,
    TableFoot: TFoot,
};
const loadingArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const ItemContent = (index, row, context) => {
    const cols = context.cols;
    const loading = context.loading;
    return (_jsx(Fragment, { children: cols.map((col, colIndex) => {
            const matrix = `${colIndex},${index}`;
            const value = path(row, col.id);
            const Component = col.Element;
            return (_createElement("td", Object.assign({}, col.cellProps, { "data-matrix": matrix, role: "cell", key: `accessor-${index}-${colIndex}`, className: "px-2 h-14 border-none first:table-cell hidden md:table-cell" }), loading ? (_jsx("div", { className: "animate-pulse h-2 bg-table-border rounded", style: { width: `${calculateSkeletonWidth(index)}%` } })) : Component ? (_jsx(Component, { row: row, matrix: matrix, col: col, rowIndex: index, value: value })) : (_jsx(Fragment, { children: Is.nil(value) ? "" : value }))));
        }) }));
};
const Frag = () => _jsx(Fragment, {});
const InnerTable = (_a) => {
    var { filters, pagination = null, onScrollEnd, useControl = false, setCols, setFilters, sorters, cols, border = false, setSorters } = _a, props = __rest(_a, ["filters", "pagination", "onScrollEnd", "useControl", "setCols", "setFilters", "sorters", "cols", "border", "setSorters"]);
    const ref = useRef(null);
    const [showLoadingFooter, setShowLoadingFooter] = useState(false);
    const onScrollEndRef = useCallbackRef(onScrollEnd);
    const loadingMoreRef = useCallbackRef(props.loadingMore);
    const rows = useMemo(() => {
        if (props.loading)
            return loadingArray;
        if (useControl)
            return props.rows;
        const linq = new Linq(props.rows);
        if (filters.length > 0) {
            filters.forEach((x) => x.value === "" || Number.isNaN(x.value) ? undefined : linq.Where(x.name, x.operation.symbol, x.value));
        }
        if (sorters.length === 0)
            return linq.Select();
        return multiSort(linq.Select(), sorters);
    }, [props.rows, filters, sorters, props.loading]);
    useEffect(() => {
        if (ref.current === null) {
            return () => { };
        }
        const div = ref.current;
        const observer = new IntersectionObserver((entries) => {
            var _a;
            const endOfPage = entries[entries.length - 1];
            const condition = endOfPage.isIntersecting && loadingMoreRef.current;
            if (condition) {
                (_a = onScrollEndRef.current) === null || _a === void 0 ? void 0 : _a.call(onScrollEndRef);
                return void setShowLoadingFooter(true);
            }
            return setShowLoadingFooter(false);
        });
        observer.observe(div);
        return () => observer.disconnect();
    }, []);
    return (_jsxs("div", { className: "min-w-full", children: [_jsxs("div", { className: `group rounded-lg px-1 ${border ? "border border-table-border" : ""}`, children: [_jsx(TableVirtuoso, { data: rows, useWindowScroll: true, components: components, totalCount: rows.length, itemContent: ItemContent, context: { loading: props.loading, loadingMore: props.loadingMore, cols: cols }, fixedFooterContent: showLoadingFooter ? Frag : null, fixedHeaderContent: () => (_jsx(TableHeader, { headers: cols, sorters: sorters, filters: filters, setCols: setCols, setSorters: setSorters, setFilters: setFilters, loading: !!props.loading })) }), _jsx("div", { "aria-hidden": "true", ref: ref, className: "h-0.5 w-full" })] }), pagination !== null ? _jsx(Pagination, Object.assign({}, pagination)) : null] }));
};
const dispatcherFun = (prev, setter) => typeof setter === "function" ? setter(prev) : setter;
export const Table = (props) => {
    var _a, _b, _c, _d, _e, _f;
    const operations = (_a = props.operations) !== null && _a !== void 0 ? _a : true;
    const optionCols = useMemo(() => createOptionCols(props.cols), [props.cols]);
    const [state, dispatch] = useReducer({
        cols: props.cols,
        filters: ((_b = props.filters) !== null && _b !== void 0 ? _b : []),
        groups: ((_c = props.groups) !== null && _c !== void 0 ? _c : []),
        sorters: ((_d = props.sorters) !== null && _d !== void 0 ? _d : []),
    }, (get) => {
        const create = (key) => (arg) => {
            const state = get.state();
            return Object.assign(Object.assign({}, state), { [key]: dispatcherFun(state[key], arg) });
        };
        return {
            cols: create("cols"),
            filters: create("filters"),
            groups: create("groups"),
            sorters: create("sorters"),
        };
    }, {
        postMiddleware: [
            (state) => {
                var _a;
                (_a = props.set) === null || _a === void 0 ? void 0 : _a.call(props, state);
                return state;
            },
        ],
    });
    return (_jsxs("div", { className: "relative min-w-full", children: [operations ? (_jsx(Metadata, { setCols: dispatch.cols, rows: props.rows, cols: state.cols, filters: state.filters, groups: state.groups, options: optionCols, setFilters: dispatch.filters, setGroups: dispatch.groups, setSorters: dispatch.sorters, sorters: state.sorters, pagination: (_e = props.pagination) !== null && _e !== void 0 ? _e : null })) : null, state.groups.length === 0 ? (_jsx(InnerTable, Object.assign({}, props, { onScrollEnd: props.onScrollEnd, cols: state.cols, filters: state.filters, groups: state.groups, index: 0, optionCols: optionCols, options: optionCols, setCols: dispatch.cols, setFilters: dispatch.filters, setGroups: dispatch.groups, setSorters: dispatch.sorters, sorters: state.sorters, pagination: (_f = props.pagination) !== null && _f !== void 0 ? _f : null }))) : (_jsx("div", { className: "flex flex-wrap gap-4", children: state.groups.map((group, index) => (_jsx(motion.div, { className: "min-w-full", children: _jsx(InnerTable, Object.assign({}, props, { pagination: null, onScrollEnd: props.onScrollEnd, cols: state.cols, filters: state.filters, group: group, groups: state.groups, index: index, optionCols: optionCols, options: optionCols, rows: group.rows, setCols: dispatch.cols, setFilters: dispatch.filters, setGroups: dispatch.groups, setSorters: dispatch.sorters, sorters: state.sorters })) }, `group-${group.groupId}`))) }))] }));
};
