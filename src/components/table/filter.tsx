import { Symbols } from "linq-arrays";
import { PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import React, { Fragment } from "react";
import { AllPaths } from "sidekicker";
import { Dropdown } from "../floating/dropdown";
import { Input } from "../form/input";
import { OptionProps, Select } from "../form/select";
import { uuid } from "../../lib/fns";
import { Label } from "../../types";
import { Col, ColType, getLabel, TableConfiguration, valueFromType } from "./table-lib";

const operators = {
    contains: { value: "contains", label: "Contains", symbol: "includes" },
    is: { value: "is", label: "Is", symbol: "is" },
    isNot: { value: "isNot", label: "Is not", symbol: "!==" },
    notContains: { value: "notContains", label: "Does not contains", symbol: "notIncludes" },
    lessThan: { value: "lessThan", label: "Less Than", symbol: "<=" },
    greaterThan: { value: "greaterThan", label: "Greater than", symbol: ">=" },
    startsWith: { value: "startsWith", label: "Starts with", symbol: "startsWith" },
    endsWith: { value: "endsWith", label: "Ends with", symbol: "endsWith" },
} satisfies Record<string, OptionProps & { symbol: Symbols }>;

type Operator = keyof typeof operators;

type Operators = (typeof operators)[Operator];

const operatorOptions: Partial<Record<ColType, OptionProps[]>> = {
    [ColType.Text]: [operators.is, operators.isNot, operators.contains, operators.notContains, operators.startsWith, operators.endsWith],
    [ColType.Boolean]: [operators.is, operators.isNot],
    [ColType.Number]: [operators.is, operators.isNot, operators.greaterThan, operators.lessThan],
};

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

export const createFilterFromCol = <T extends {}>(f: Col<T>, rest: Partial<FilterConfig<T>> = {}): FilterConfig<T> => {
    const name = f.id;
    const type = f.type ?? ColType.Text;
    const operatorId = operatorOptions[type]?.[0]!.value as Operator;
    const operation = operators[operatorId];
    return { id: uuid(), operation, label: getLabel(f), name, type, value: "", ...rest };
};

export const Filter = <T extends {}>(props: Props<T>) => {
    const onAddFilter = () => {
        const col = props.cols.at(0)!;
        props.set((prev) => [...prev, createFilterFromCol(col)]);
    };

    const onSelectProperty = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const changedId = e.target.dataset.id || "";
        const newId = e.target.value;
        props.set((prev) =>
            prev.map((x) => {
                if (changedId !== x.id) return x;
                const col = props.cols.find((x) => newId === x.id)!;
                return createFilterFromCol(col, { value: "" });
            })
        );
    };

    const onSelectOperation = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.dataset.id || "";
        const operator = e.target.value;
        props.set((prev) => prev.map((x) => (x.id === id ? { ...x, operation: operators[operator as Operator] } : x)));
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
                arrow={false}
                title="Filters"
                trigger={
                    <span className="flex items-center gap-1 proportional-nums">
                        <SearchIcon size={14} />
                        Filtros {props.filters.length === 0 ? "" : ` (${props.filters.length})`}
                    </span>
                }
            >
                <ul className="mt-4 space-y-2">
                    {props.filters.map((filter) => {
                        const operators = operatorOptions[filter.type]!;
                        return (
                            <li key={`filter-select-${filter.id}`} className="flex flex-nowrap gap-3">
                                <Select
                                    title="Filtro"
                                    options={props.options}
                                    placeholder="Seleciona um campo..."
                                    value={filter.name as string}
                                    data-id={filter.id}
                                    onChange={onSelectProperty}
                                />
                                <Select
                                    title="Tipo do filtro"
                                    data-id={filter.id}
                                    onChange={onSelectOperation}
                                    value={filter.operation.value}
                                    options={operators}
                                    placeholder="Operação..."
                                />
                                <Input
                                    data-id={filter.id}
                                    onChange={onChangeValue}
                                    placeholder="Buscar por..."
                                    title="Valor do filtro"
                                    type={filter.type as any}
                                    value={filter.value as string}
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
                            <PlusIcon size={14} /> Adicionar novo filtro
                        </button>
                    </li>
                </ul>
            </Dropdown>
        </Fragment>
    );
};

type ColumnHeaderFilterProps<T extends {}> = {
    filter: FilterConfig<T>;
    set: React.Dispatch<React.SetStateAction<FilterConfig<T>[]>>;
};

export const ColumnHeaderFilter = <T extends {}>({ filter, set }: ColumnHeaderFilterProps<T>) => {
    const onSelectOperation = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const operator = e.target.value;
        const id = e.target.dataset.id || "";
        set((prev) => prev.map((x) => (x.id === id ? { ...x, operation: operators[operator as Operator] } : x)));
    };

    const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.dataset.id || "";
        const value = valueFromType(e.target);
        set((prev) => prev.map((x) => (x.id === id ? { ...x, value } : x)));
    };

    return (
        <div className="flex flex-nowrap items-center gap-4 py-2">
            <Select onChange={onSelectOperation} value={filter.operation.value} options={operatorOptions[filter.type]!} placeholder="Operation..." />
            <Input
                type={filter.type as any}
                data-id={filter.id}
                onChange={onChangeValue}
                placeholder="Looking for..."
                value={filter.value as string}
            />
        </div>
    );
};
