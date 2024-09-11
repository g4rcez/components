"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LayoutGroup, Reorder, useDragControls, useMotionValue } from "framer-motion";
import Linq from "linq-arrays";
import { GripVerticalIcon, Trash2Icon, UngroupIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { keys } from "sidekicker";
import { uuid } from "../../lib/fns";
import { Button } from "../core/button";
import { Dropdown } from "../floating/dropdown";
import { Select } from "../form/select";
import { createOptionCols } from "./table-lib";
const Item = ({ item, onPointerDown }) => {
    const y = useMotionValue(0);
    return (_jsxs(Reorder.Item, { onPointerDown: onPointerDown, id: item.groupId, className: "flex flex-row items-center gap-2", value: item, style: { y }, children: [_jsx("button", { type: "button", className: "cursor-grab", children: _jsx(GripVerticalIcon, { size: 14 }) }), _jsx("span", { children: item.groupName })] }, item.groupId));
};
export const Group = (props) => {
    var _a;
    const options = createOptionCols(props.cols);
    const controls = useDragControls();
    const [group, setGroup] = useState(((_a = props.groups[0]) === null || _a === void 0 ? void 0 : _a.thead) || "");
    const onChange = (e) => {
        var _a;
        const select = e.target;
        const key = select.value;
        const index = select.options.selectedIndex;
        const label = ((_a = select.options.item(index)) === null || _a === void 0 ? void 0 : _a.label) || "";
        setGroup(label);
        const groupBy = new Linq(props.rows).GroupBy(key);
        const col = props.cols.find((x) => x.id === key);
        props.setGroups(keys(groupBy).map((groupName, index) => {
            const rows = groupBy[groupName];
            return Object.assign(Object.assign({}, col), { groupId: uuid(), groupKey: key, index, rows, groupName: groupName });
        }));
    };
    const onDelete = () => props.setGroups([]);
    return (_jsx(Fragment, { children: _jsxs(Dropdown, { arrow: false, title: "Groups", trigger: _jsxs("span", { className: "flex items-center gap-1 proportional-nums", children: [_jsx(UngroupIcon, { size: 14 }), "Groups", props.groups.length > 0 ? ` - ${group}(${props.groups.length})` : ""] }), children: [_jsxs("div", { className: "flex flex-nowrap items-center", children: [_jsx(Select, { value: group, title: "Tipo de agrupamento", onChange: onChange, options: options, placeholder: "Agrupar por..." }), _jsx(Button, { className: "mt-4", onClick: onDelete, theme: "raw", "data-id": group, children: _jsx(Trash2Icon, { size: 16, className: "text-danger" }) })] }), props.groups.length > 0 ? (_jsxs("section", { className: "my-4", children: [_jsx("header", { children: _jsx("h2", { className: "text-xl font-medium", children: "Order groups" }) }), _jsx(LayoutGroup, { children: _jsx(Reorder.Group, { axis: "y", className: "relative space-y-2", drag: true, dragControls: controls, dragListener: false, layoutScroll: true, onReorder: props.setGroups, values: props.groups, children: props.groups.map((item) => (_jsx(Item, { item: item, onPointerDown: (e) => {
                                        controls.start(e);
                                        props.setGroups([...props.groups]);
                                    } }, item.groupId))) }) })] })) : null] }) }));
};
