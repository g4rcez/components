"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowDown01Icon, ArrowUp01Icon, ArrowUpDownIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useTranslations } from "../../hooks/use-translate-context";
import { uuid } from "../../lib/fns";
import { Dropdown } from "../floating/dropdown";
import { Select } from "../form/select";
import { getLabel } from "./table-lib";
var Order;
(function (Order) {
    Order["Asc"] = "asc";
    Order["Desc"] = "desc";
    Order["Undefined"] = "undefined";
})(Order || (Order = {}));
const createSorterFn = (fields) => (a, b) => fields.reduce((acc, x) => {
    const reverse = x.type === "desc" ? -1 : 1;
    const property = x.value;
    const p = a[property] > b[property] ? reverse : a[property] < b[property] ? -reverse : 0;
    return acc !== 0 ? acc : p;
}, 0);
export const multiSort = (array, fields) => array.toSorted(createSorterFn(fields));
const createSorter = (col, label, order) => ({
    id: uuid(),
    type: order,
    value: col.id,
    label,
});
export const Sort = (props) => {
    const translation = useTranslations();
    const orders = {
        asc: { label: translation.tableSortAsc, value: Order.Asc },
        desc: { label: translation.tableSortDesc, value: Order.Desc },
    };
    const orderOptions = [orders.asc, orders.desc];
    const onAddSorter = () => {
        const col = props.cols[0];
        if (col)
            props.set((prev) => [...prev, createSorter(col, orders.asc.label, orders.asc.value)]);
    };
    const onSetSorter = (id) => (e) => {
        const value = e.target.value;
        props.set((prev) => prev.map((x) => (x.id === id ? Object.assign(Object.assign({}, x), { value: value }) : x)));
    };
    const onSortOrderType = (id) => (e) => {
        const type = e.target.value;
        props.set((prev) => prev.map((x) => (x.id === id ? Object.assign(Object.assign({}, x), { type: type }) : x)));
    };
    const onDelete = (e) => {
        const id = e.currentTarget.dataset.id || "";
        props.set((prev) => prev.filter((x) => x.id !== id));
    };
    return (_jsx(Fragment, { children: _jsx(Dropdown, { title: translation.tableSortDropdownTitle, trigger: _jsxs("span", { className: "flex items-center gap-1 proportional-nums", children: [_jsx(ArrowUpDownIcon, { size: 14 }), translation.tableSortOrderByLabel, " ", props.sorters.length === 0 ? "" : ` (${props.sorters.length})`] }), children: _jsxs("ul", { className: "mt-4 space-y-2", children: [props.sorters.map((sorter) => {
                        return (_jsxs("li", { className: "flex flex-nowrap gap-3", children: [_jsx(Select, { options: props.options, value: sorter.value, onChange: onSetSorter(sorter.id), title: translation.tableSortOrderInputTitle, placeholder: translation.tableSortOrderInputPlaceholder }), _jsx(Select, { onChange: onSortOrderType(sorter.id), value: sorter.type, options: orderOptions, title: translation.tableSortTypeInputTitle, placeholder: translation.tableSortTypeInputPlaceholder }), _jsx("button", { className: "mt-4", "data-id": sorter.id, onClick: onDelete, children: _jsx(Trash2Icon, { className: "text-danger", size: 14 }) })] }, `sorter-select-${sorter.id}`));
                    }), _jsx("li", { children: _jsxs("button", { type: "button", onClick: onAddSorter, className: "text-primary flex items-center gap-1", children: [_jsx(PlusIcon, { size: 14 }), " ", translation.tableSortAddButton] }) })] }) }) }));
};
export const SorterHead = (props) => {
    const translations = useTranslations();
    const [status, setStatus] = useState(() => {
        const sorter = props.sorters.find((sort) => sort.value === props.col.id);
        return sorter ? sorter.type : Order.Undefined;
    });
    const onClick = () => setStatus((prev) => (prev === Order.Undefined ? Order.Asc : prev === Order.Asc ? Order.Desc : Order.Undefined));
    useEffect(() => {
        props.setSorters((prev) => {
            if (status === Order.Undefined)
                return prev.filter((x) => x.value !== props.col.id);
            const findIndex = prev.findIndex((p) => p.value === props.col.id);
            const sorter = createSorter(props.col, status, status);
            if (findIndex === -1)
                return [...prev, sorter];
            prev[findIndex] = sorter;
            return [...prev];
        });
    }, [status, props.col]);
    const labelId = `${props.col.id}-sorter-id`;
    const label = getLabel(props.col);
    return (_jsxs("button", { "aria-labelledby": labelId, className: "isolate flex items-center", onClick: onClick, type: "button", children: [_jsxs("span", { id: labelId, className: "sr-only", children: [translations.tableSortDropdownTitle, " ", label] }), status === Order.Asc ? _jsx(ArrowUp01Icon, { size: 14 }) : null, status === Order.Desc ? _jsx(ArrowDown01Icon, { size: 14 }) : null, status === Order.Undefined ? _jsx(ArrowUpDownIcon, { size: 14 }) : null] }));
};
