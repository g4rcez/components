import { Symbols } from "linq-arrays";
import { ListFilterIcon, PlusIcon, Trash2Icon } from "lucide-react";
import React, { Fragment, useMemo } from "react";
import { AllPaths } from "sidekicker";
import { uuid } from "../../lib/fns";
import { Label } from "../../types";
import { Dropdown } from "../floating/dropdown";
import { Input } from "../form/input";
import { OptionProps, Select } from "../form/select";
import { Col, ColType, getLabel, TableConfiguration, valueFromType } from "./table-lib";
import { useTranslations } from "../../hooks/use-translate-context";

type Operators = { value: string; label: string; symbol: string }

type OperatorTypes = "contains" | "is" | "isNot" | "notContains" | "lessThan" | "greaterThan" | "startsWith" | "endsWith"

type Operations = Record<OperatorTypes, Operators>

type OperationOptions = Partial<Record<ColType, OptionProps[]>>

type FilterValue = string | number | string[] | boolean;

export type FilterConfig<T extends {} = {}> = {
    id: string;
    label: Label;
    name: AllPaths<T>;
    type: ColType;
    operation: Operators;
    value: FilterValue;
};

type Props<T extends {}> = TableConfiguration<
    T,
    {
        cols: Col<T>[];
        filters: FilterConfig<T>[];
        set: React.Dispatch<React.SetStateAction<FilterConfig<T>[]>>;
    }
>;

export const createFilterFromCol = <T extends {}>(f: Col<T>, options: OperationOptions, operations: Operations, rest: Partial<FilterConfig<T>> = {}): FilterConfig<T> => {
    const name = f.id;
    const type = f.type ?? ColType.Text;
    const operatorId = options[type]?.[0]!.value as OperatorTypes;
    const operation = operations[operatorId];
    return { id: uuid(), operation, label: getLabel(f), name, type, value: "", ...rest };
};

export const useOperators = () => {
    const translation = useTranslations()
    const operations = useMemo((): Operations => {
        return {
            contains: { value: "contains", label: translation.tableFilterTypeContains, symbol: "includes" },
            is: { value: "is", label: translation.tableFilterTypeIs, symbol: "is" },
            isNot: { value: "isNot", label: translation.tableFilterTypeIsNot, symbol: "!==" },
            notContains: { value: "notContains", label: translation.tableFilterTypeNotContains, symbol: "notIncludes" },
            lessThan: { value: "lessThan", label: translation.tableFilterTypeLessThan, symbol: "<=" },
            greaterThan: { value: "greaterThan", label: translation.tableFilterTypeGreaterThan, symbol: ">=" },
            startsWith: { value: "startsWith", label: translation.tableFilterTypeStartsWith, symbol: "startsWith" },
            endsWith: { value: "endsWith", label: translation.tableFilterTypeEndsWith, symbol: "endsWith" },
        } satisfies Record<string, OptionProps & { symbol: Symbols }>;
    }, [translation])

    const operationOptions = useMemo((): OperationOptions => {
        return {
            [ColType.Text]: [operations.is, operations.isNot, operations.contains, operations.notContains, operations.startsWith, operations.endsWith],
            [ColType.Boolean]: [operations.is, operations.isNot],
            [ColType.Number]: [operations.is, operations.isNot, operations.greaterThan, operations.lessThan],
        };
    }, [translation])
    return { operationOptions, operations }

}

export const Filter = <T extends {}>(props: Props<T>) => {
    const translation = useTranslations()
    const { operationOptions, operations } = useOperators()

    const onAddFilter = () => {
        const col = props.cols.at(0)!;
        props.set((prev) => [...prev, createFilterFromCol(col, operationOptions, operations)]);
    };

    const onSelectProperty = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const changedId = e.target.dataset.id || "";
        const newId = e.target.value;
        props.set((prev) =>
            prev.map((x) => {
                if (changedId !== x.id) return x;
                const col = props.cols.find((x) => newId === x.id)!;
                return createFilterFromCol(col, operationOptions, operations, { value: "" });
            })
        );
    };

    const onSelectOperation = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.dataset.id || "";
        const operator = e.target.value;
        props.set((prev) => prev.map((x) => (x.id === id ? { ...x, operation: operations[operator as OperatorTypes] } : x)));
    };

    const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.dataset.id || "";
        props.set((prev) => prev.filter((x) => x.id !== id));
    };

    const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.dataset.id || "";
        const value = valueFromType(e.target);
        props.set((prev) => prev.map((x) => (x.id === id ? { ...x, value } : x)));
    };

    return (
        <Fragment>
            <Dropdown
                arrow
                title={translation.tableFilterDropdownTitle}
                trigger={
                    <span className="flex items-center gap-1 proportional-nums">
                        <ListFilterIcon size={14} />
                        {translation.tableFilterLabel} {props.filters.length === 0 ? "" : ` (${props.filters.length})`}
                    </span>
                }
            >
                <ul className="mt-4 space-y-2">
                    {props.filters.map((filter) => {
                        const operators = operationOptions[filter.type]!;
                        return (
                            <li key={`filter-select-${filter.id}`} className="flex flex-nowrap gap-3">
                                <Select
                                    options={props.options}
                                    title={translation.tableFilterColumnTitle}
                                    placeholder={translation.tableFilterColumnPlaceholder}
                                    value={filter.name as string}
                                    data-id={filter.id}
                                    onChange={onSelectProperty}
                                />
                                <Select
                                    data-id={filter.id}
                                    onChange={onSelectOperation}
                                    value={filter.operation.value}
                                    options={operators}
                                    title={translation.tableFilterOperatorTitle}
                                    placeholder={translation.tableFilterOperatorPlaceholder}
                                />
                                <Input
                                    data-id={filter.id}
                                    onChange={onChangeValue}
                                    title={translation.tableFilterValueTitle}
                                    placeholder={translation.tableFilterValuePlaceholder}
                                    type={filter.type as any}
                                    value={filter.value as string}
                                    optionalText=""
                                />
                                <div className="flex items-center justify-center mt-5">
                                    <button data-id={filter.id} type="button" onClick={onDelete}>
                                        <Trash2Icon className="text-danger" size={16} />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                    <li>
                        <button type="button" onClick={onAddFilter} className="text-primary flex items-center gap-1">
                            <PlusIcon size={14} /> {translation.tableFilterNewFilter}
                        </button>
                    </li>
                </ul>
            </Dropdown>
        </Fragment>
    );
};

type ColumnHeaderFilterProps<T extends {}> = {
    filter: FilterConfig<T>;
    onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
    set: React.Dispatch<React.SetStateAction<FilterConfig<T>[]>>;
};

export const ColumnHeaderFilter = <T extends {}>({ filter, onDelete, set }: ColumnHeaderFilterProps<T>) => {
    const translation = useTranslations();
    const { operationOptions, operations } = useOperators()
    const onSelectOperation = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const operator = e.target.value;
        const id = e.target.dataset.id || "";
        set((prev) => prev.map((x) => (x.id === id ? { ...x, operation: operations[operator as OperatorTypes] } : x)));
    };

    const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.dataset.id || "";
        const value = valueFromType(e.target);
        set((prev) => prev.map((x) => (x.id === id ? { ...x, value } : x)));
    };

    return (
        <div className="flex flex-nowrap items-center gap-4 py-2">
            <Select
                data-id={filter.id}
                onChange={onSelectOperation}
                options={operationOptions[filter.type]!}
                title={translation.tableFilterColumnTitle}
                placeholder={translation.tableFilterColumnPlaceholder}
                value={filter.operation.value}
            />
            <Input
                data-id={filter.id}
                onChange={onChangeValue}
                type={filter.type as any}
                value={filter.value as string}
                title={translation.tableFilterValueTitle}
                placeholder={translation.tableFilterValueTitle}
            />
            <button onClick={onDelete} data-id={filter.id} type="button" className="mt-4">
                <Trash2Icon className="text-danger" size={14} />
            </button>
        </div>
    );
};