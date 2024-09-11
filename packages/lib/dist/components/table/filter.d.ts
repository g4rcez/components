import React from "react";
import { AllPaths } from "sidekicker";
import { Label } from "../../types";
import { OptionProps } from "../form/select";
import { Col, ColType, TableConfiguration } from "./table-lib";
type Operators = {
    value: string;
    label: string;
    symbol: string;
};
type OperatorTypes = "contains" | "is" | "isNot" | "notContains" | "lessThan" | "greaterThan" | "startsWith" | "endsWith";
type Operations = Record<OperatorTypes, Operators>;
type OperationOptions = Partial<Record<ColType, OptionProps[]>>;
type FilterValue = string | number | string[] | boolean;
export type FilterConfig<T extends {} = {}> = {
    id: string;
    label: Label;
    name: AllPaths<T>;
    type: ColType;
    operation: Operators;
    value: FilterValue;
};
type Props<T extends {}> = TableConfiguration<T, {
    cols: Col<T>[];
    filters: FilterConfig<T>[];
    set: React.Dispatch<React.SetStateAction<FilterConfig<T>[]>>;
}>;
export declare const createFilterFromCol: <T extends {}>(f: Col<T>, options: OperationOptions, operations: Operations, rest?: Partial<FilterConfig<T>>) => FilterConfig<T>;
export declare const useOperators: () => {
    operationOptions: Partial<Record<ColType, OptionProps[]>>;
    operations: Operations;
};
export declare const Filter: <T extends {}>(props: Props<T>) => import("react/jsx-runtime").JSX.Element;
type ColumnHeaderFilterProps<T extends {}> = {
    filter: FilterConfig<T>;
    onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
    set: React.Dispatch<React.SetStateAction<FilterConfig<T>[]>>;
};
export declare const ColumnHeaderFilter: <T extends {}>({ filter, onDelete, set }: ColumnHeaderFilterProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=filter.d.ts.map