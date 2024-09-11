import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ListFilterIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Fragment, useMemo } from "react";
import { uuid } from "../../lib/fns";
import { Dropdown } from "../floating/dropdown";
import { Input } from "../form/input";
import { Select } from "../form/select";
import { ColType, getLabel, valueFromType } from "./table-lib";
import { useTranslations } from "../../hooks/use-translate-context";
export const createFilterFromCol = (f, options, operations, rest = {}) => {
    var _a, _b;
    const name = f.id;
    const type = (_a = f.type) !== null && _a !== void 0 ? _a : ColType.Text;
    const operatorId = (_b = options[type]) === null || _b === void 0 ? void 0 : _b[0].value;
    const operation = operations[operatorId];
    return Object.assign({ id: uuid(), operation, label: getLabel(f), name, type, value: "" }, rest);
};
export const useOperators = () => {
    const translation = useTranslations();
    const operations = useMemo(() => {
        return {
            contains: { value: "contains", label: translation.tableFilterTypeContains, symbol: "includes" },
            is: { value: "is", label: translation.tableFilterTypeIs, symbol: "is" },
            isNot: { value: "isNot", label: translation.tableFilterTypeIsNot, symbol: "!==" },
            notContains: { value: "notContains", label: translation.tableFilterTypeNotContains, symbol: "notIncludes" },
            lessThan: { value: "lessThan", label: translation.tableFilterTypeLessThan, symbol: "<=" },
            greaterThan: { value: "greaterThan", label: translation.tableFilterTypeGreaterThan, symbol: ">=" },
            startsWith: { value: "startsWith", label: translation.tableFilterTypeStartsWith, symbol: "startsWith" },
            endsWith: { value: "endsWith", label: translation.tableFilterTypeEndsWith, symbol: "endsWith" },
        };
    }, [translation]);
    const operationOptions = useMemo(() => {
        return {
            [ColType.Text]: [operations.is, operations.isNot, operations.contains, operations.notContains, operations.startsWith, operations.endsWith],
            [ColType.Boolean]: [operations.is, operations.isNot],
            [ColType.Number]: [operations.is, operations.isNot, operations.greaterThan, operations.lessThan],
        };
    }, [translation]);
    return { operationOptions, operations };
};
export const Filter = (props) => {
    const translation = useTranslations();
    const { operationOptions, operations } = useOperators();
    const onAddFilter = () => {
        const col = props.cols.at(0);
        props.set((prev) => [...prev, createFilterFromCol(col, operationOptions, operations)]);
    };
    const onSelectProperty = (e) => {
        const changedId = e.target.dataset.id || "";
        const newId = e.target.value;
        props.set((prev) => prev.map((x) => {
            if (changedId !== x.id)
                return x;
            const col = props.cols.find((x) => newId === x.id);
            return createFilterFromCol(col, operationOptions, operations, { value: "" });
        }));
    };
    const onSelectOperation = (e) => {
        const id = e.target.dataset.id || "";
        const operator = e.target.value;
        props.set((prev) => prev.map((x) => (x.id === id ? Object.assign(Object.assign({}, x), { operation: operations[operator] }) : x)));
    };
    const onDelete = (e) => {
        const id = e.currentTarget.dataset.id || "";
        props.set((prev) => prev.filter((x) => x.id !== id));
    };
    const onChangeValue = (e) => {
        const id = e.target.dataset.id || "";
        const value = valueFromType(e.target);
        props.set((prev) => prev.map((x) => (x.id === id ? Object.assign(Object.assign({}, x), { value }) : x)));
    };
    return (_jsx(Fragment, { children: _jsx(Dropdown, { arrow: true, title: translation.tableFilterDropdownTitle, trigger: _jsxs("span", { className: "flex items-center gap-1 proportional-nums", children: [_jsx(ListFilterIcon, { size: 14 }), translation.tableFilterLabel, " ", props.filters.length === 0 ? "" : ` (${props.filters.length})`] }), children: _jsxs("ul", { className: "mt-4 space-y-2", children: [props.filters.map((filter) => {
                        const operators = operationOptions[filter.type];
                        return (_jsxs("li", { className: "flex flex-nowrap gap-3", children: [_jsx(Select, { options: props.options, title: translation.tableFilterColumnTitle, placeholder: translation.tableFilterColumnPlaceholder, value: filter.name, "data-id": filter.id, onChange: onSelectProperty }), _jsx(Select, { "data-id": filter.id, onChange: onSelectOperation, value: filter.operation.value, options: operators, title: translation.tableFilterOperatorTitle, placeholder: translation.tableFilterOperatorPlaceholder }), _jsx(Input, { "data-id": filter.id, onChange: onChangeValue, title: translation.tableFilterValueTitle, placeholder: translation.tableFilterValuePlaceholder, type: filter.type, value: filter.value, optionalText: "" }), _jsx("div", { className: "flex items-center justify-center mt-5", children: _jsx("button", { "data-id": filter.id, type: "button", onClick: onDelete, children: _jsx(Trash2Icon, { className: "text-danger", size: 16 }) }) })] }, `filter-select-${filter.id}`));
                    }), _jsx("li", { children: _jsxs("button", { type: "button", onClick: onAddFilter, className: "text-primary flex items-center gap-1", children: [_jsx(PlusIcon, { size: 14 }), " ", translation.tableFilterNewFilter] }) })] }) }) }));
};
export const ColumnHeaderFilter = ({ filter, onDelete, set }) => {
    const translation = useTranslations();
    const { operationOptions, operations } = useOperators();
    const onSelectOperation = (e) => {
        const operator = e.target.value;
        const id = e.target.dataset.id || "";
        set((prev) => prev.map((x) => (x.id === id ? Object.assign(Object.assign({}, x), { operation: operations[operator] }) : x)));
    };
    const onChangeValue = (e) => {
        const id = e.target.dataset.id || "";
        const value = valueFromType(e.target);
        set((prev) => prev.map((x) => (x.id === id ? Object.assign(Object.assign({}, x), { value }) : x)));
    };
    return (_jsxs("div", { className: "flex flex-nowrap items-center gap-4 py-2", children: [_jsx(Select, { "data-id": filter.id, onChange: onSelectOperation, options: operationOptions[filter.type], title: translation.tableFilterColumnTitle, placeholder: translation.tableFilterColumnPlaceholder, value: filter.operation.value }), _jsx(Input, { "data-id": filter.id, onChange: onChangeValue, type: filter.type, value: filter.value, title: translation.tableFilterValueTitle, placeholder: translation.tableFilterValueTitle }), _jsx("button", { onClick: onDelete, "data-id": filter.id, type: "button", className: "mt-4", children: _jsx(Trash2Icon, { className: "text-danger", size: 14 }) })] }));
};
