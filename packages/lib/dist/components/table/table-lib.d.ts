import React from "react";
import { AllPaths } from "sidekicker";
import { OptionProps } from "../form/select";
import { POJO, SetState } from "../../types";
import { FilterConfig } from "./filter";
import { GroupItem } from "./group";
import { Sorter } from "./sort";
export declare const getLabel: <T extends POJO>(col: Col<T>) => string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode>;
export type TableConfiguration<T extends POJO, M extends POJO = {}> = M & {
    cols: Col<T>[];
    options: OptionProps[];
};
export declare const createOptionCols: <T extends POJO>(cols: Col<T>[]) => OptionProps[];
export declare enum ColType {
    Boolean = "boolean",
    Number = "number",
    Select = "select",
    Text = "text"
}
export declare const valueFromType: (input: HTMLInputElement) => string | number;
type THead = React.ReactElement | React.ReactNode;
export type ColMatrix = `${number},${number}`;
type ParsePath<path, output extends string[] = [], currentChunk extends string = ""> = path extends number ? [`${path}`] : path extends `${infer first}${infer rest}` ? first extends "." | "[" | "]" ? ParsePath<rest, [...output, ...(currentChunk extends "" ? [] : [currentChunk])], ""> : ParsePath<rest, output, `${currentChunk}${first}`> : [...output, ...(currentChunk extends "" ? [] : [currentChunk])];
type RecursiveGet<Obj, pathList> = Obj extends any ? pathList extends [infer first, ...infer rest] ? first extends keyof Obj ? RecursiveGet<Obj[first], rest> : [first, Obj] extends [`${number}` | "number", readonly any[]] ? RecursiveGet<Extract<Obj, any[]>[number], rest> : undefined : Obj : never;
type GetFromPath<Obj, path> = RecursiveGet<Obj, ParsePath<path>>;
export type CellPropsElement<T extends POJO, K extends AllPaths<T>> = {
    row: T;
    value: GetFromPath<T, K>;
    rowIndex: number;
    matrix: ColMatrix;
    col: ColOptions<T, K> & {
        id: K;
        thead: THead;
    };
};
type ColOptions<T extends POJO, K extends AllPaths<T>> = Partial<{
    type: ColType;
    headerLabel: string;
    allowFilter: boolean;
    thProps: React.HTMLAttributes<HTMLTableCellElement>;
    cellProps: React.HTMLAttributes<HTMLTableCellElement>;
    Element: (props: CellPropsElement<T, K>) => React.ReactNode;
}>;
export type ColConstructor<T extends POJO> = {
    remove: <K extends AllPaths<T>>(id: K) => void;
    add: <K extends AllPaths<T>>(id: K, thead: THead, props?: ColOptions<T, K>) => void;
};
declare const cols: <T extends POJO>() => <K extends AllPaths<T>>(id: K, thead: THead, options: ColOptions<T, K>) => {
    id: K;
    thead: THead;
    type?: ColType | undefined;
    headerLabel?: string | undefined;
    allowFilter?: boolean | undefined;
    thProps?: React.HTMLAttributes<HTMLTableCellElement> | undefined;
    cellProps?: React.HTMLAttributes<HTMLTableCellElement> | undefined;
    Element?: ((props: CellPropsElement<T, K>) => React.ReactNode) | undefined;
};
export type Col<T extends POJO> = ReturnType<ReturnType<typeof cols<T>>>;
export type TablePagination = {
    sizes?: number[];
    onChangeSize?: (size: number) => void;
    size: number;
    pages: number;
    current: number;
    hasNext: boolean;
    totalItems: number;
    hasPrevious: boolean;
    asLink?: React.FC<React.PropsWithChildren<{
        href: number | "previous" | "next";
        className: string;
    }>>;
};
type TableGetters<T extends POJO> = {
    rows: T[];
    cols: Col<T>[];
    sorters: Sorter<T>[];
    groups: GroupItem<T>[];
    filters: FilterConfig<T>[];
    pagination: TablePagination | null;
};
type TableSetters<T extends POJO> = {
    setCols: SetState<Col<T>[]>;
    setSorters: SetState<Sorter<T>[]>;
    setGroups: SetState<GroupItem<T>[]>;
    setFilters: SetState<FilterConfig<T>[]>;
};
export type TableOperationProps<T extends POJO> = TableConfiguration<T, TableSetters<T> & TableGetters<T> & {
    set?: (v: TableGetters<T>) => void;
}>;
export declare const createColumns: <T extends POJO>(callback: (o: ColConstructor<T>) => void) => {
    id: AllPaths<T, never>;
    thead: THead;
    type?: ColType | undefined;
    headerLabel?: string | undefined;
    allowFilter?: boolean | undefined;
    thProps?: React.HTMLAttributes<HTMLTableCellElement> | undefined;
    cellProps?: React.HTMLAttributes<HTMLTableCellElement> | undefined;
    Element?: ((props: CellPropsElement<T, AllPaths<T, never>>) => React.ReactNode) | undefined;
}[];
export declare const useTablePreferences: <T extends POJO>(name: string, options?: Partial<TableGetters<T>>) => {
    name: string;
    set: (getters: TableGetters<T>) => void;
    cols: {
        id: AllPaths<T, never>;
        thead: THead;
        type?: ColType | undefined;
        headerLabel?: string | undefined;
        allowFilter?: boolean | undefined;
        thProps?: React.HTMLAttributes<HTMLTableCellElement> | undefined;
        cellProps?: React.HTMLAttributes<HTMLTableCellElement> | undefined;
        Element?: ((props: CellPropsElement<T, AllPaths<T, never>>) => React.ReactNode) | undefined;
    }[];
    groups: GroupItem<T>[];
    sorters: Sorter<T>[];
    filters: FilterConfig<T>[];
    pagination: TablePagination | null;
};
export {};
//# sourceMappingURL=table-lib.d.ts.map