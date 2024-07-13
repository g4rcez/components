"use client";
import React from "react";
import { AllPaths } from "sidekicker";
import { LocalStorage } from "storage-manager-js";
import { useReducer } from "use-typed-reducer";
import { OptionProps } from "../form/select";
import { isSsr } from "../../lib/fns";
import { POJO, SetState } from "../../types";
import { FilterConfig } from "./filter";
import { GroupItem } from "./group";
import { Sorter } from "./sort";

export const getLabel = <T extends {}>(col: Col<T>) => col.headerLabel ?? col.thead ?? (col.id as string);

export type TableConfiguration<T extends {}, M extends {} = {}> = M & {
    cols: Col<T>[];
    options: OptionProps[];
};

export const createOptionCols = <T extends {}>(cols: Col<T>[]): OptionProps[] =>
    cols.map((opt) => ({
        value: opt.id as string,
        label: (opt.thead ?? opt.headerLabel ?? (opt.id as string)) as string,
    }));

export enum ColType {
    Boolean = "boolean",
    Number = "number",
    Select = "select",
    Text = "text",
}

export const valueFromType = (input: HTMLInputElement) => (input.type === "number" ? input.valueAsNumber : input.value);

type THead = React.ReactElement | React.ReactNode;

export type ColMatrix = `${number},${number}`;

// ref: https://github.com/gvergnaud/hotscript/blob/main/src/internals/objects/impl/objects.ts
type ParsePath<
    path,
    output extends string[] = [],
    currentChunk extends string = ""
> = path extends number
    ? [`${path}`]
    : path extends `${infer first}${infer rest}`
        ? first extends "." | "[" | "]"
            ? ParsePath<
                rest,
                [...output, ...(currentChunk extends "" ? [] : [currentChunk])],
                ""
            >
            : ParsePath<rest, output, `${currentChunk}${first}`>
        : [...output, ...(currentChunk extends "" ? [] : [currentChunk])];

type RecursiveGet<Obj, pathList> = Obj extends any
    ? pathList extends [infer first, ...infer rest]
        ? first extends keyof Obj
            ? RecursiveGet<Obj[first], rest>
            : [first, Obj] extends [`${number}` | "number", readonly any[]]
                ? RecursiveGet<Extract<Obj, any[]>[number], rest>
                : undefined
        : Obj
    : never;

type GetFromPath<Obj, path> = RecursiveGet<Obj, ParsePath<path>>;

export type CellPropsElement<T extends {}, K extends AllPaths<T>> = {
    row: T;
    value: GetFromPath<T, K>;
    rowIndex: number;
    matrix: ColMatrix;
    col: ColOptions<T, K> & { id: K; thead: THead };
};

type ColOptions<T extends {}, K extends AllPaths<T>> = Partial<{
    cellProps: React.HTMLAttributes<HTMLTableCellElement>;
    thProps: React.HTMLAttributes<HTMLTableCellElement>;
    type: ColType;
    headerLabel: string;
    allowFilter: boolean;
    Element: (props: CellPropsElement<T, K>) => React.ReactNode;
}>;

export type ColConstructor<T extends {}> = {
    remove: <K extends AllPaths<T>>(id: K) => void;
    add: <K extends AllPaths<T>>(id: K, thead: THead, props?: ColOptions<T, K>) => void;
};

const cols =
    <T extends POJO>() =>
    <K extends AllPaths<T>>(id: K, thead: THead, options: ColOptions<T, K>) => ({ ...options, id, thead });

export type Col<T extends {}> = ReturnType<ReturnType<typeof cols<T>>>;

type TableGetters<T extends POJO> = {
    rows: T[];
    cols: Col<T>[];
    groups: GroupItem<T>[];
    sorters: Sorter<T>[];
    filters: FilterConfig<T>[];
};

type TableSetters<T extends POJO> = {
    setCols: SetState<Col<T>[]>;
    setSorters: SetState<Sorter<T>[]>;
    setGroups: SetState<GroupItem<T>[]>;
    setFilters: SetState<FilterConfig<T>[]>;
};

export type TableOperationProps<T extends {}> = TableConfiguration<
    T,
    TableSetters<T> &
        TableGetters<T> & {
            set?: (v: TableGetters<T>) => void;
        }
>;

export const createColumns = <T extends {}>(callback: (o: ColConstructor<T>) => void) => {
    let items: Col<T>[] = [];
    const add: ColConstructor<T>["add"] = (id, thead, options) => items.push({ ...options, id, thead } as any);
    const remove: ColConstructor<T>["remove"] = (id) => (items = items.filter((x) => x.id !== id));
    callback({ add, remove });
    return items;
};

type TablePreferenceState<T extends POJO> = {
    name: string;
    cols: Col<T>[];
    groups: GroupItem<T>[];
    sorters: Sorter<T>[];
    filters: FilterConfig<T>[];
};

const noop = {};

export const useTablePreferences = <T extends POJO>(name: string, options: Partial<TableGetters<T>> = noop) => {
    const init: TableGetters<T> | null = isSsr() ? null : (LocalStorage.get(`@unamed/table-${name}`) as TableGetters<T>) || null;
    const [state, dispatch] = useReducer(
        {
            name,
            groups: options.groups || init?.groups || [],
            sorters: options.sorters || init?.sorters || [],
            filters: options.filters || init?.filters || [],
            cols: options.cols || init?.cols || [],
        } as Omit<TableGetters<T>, "rows"> & { name: string },
        (get) => {
            const intercept = (partial: Partial<TablePreferenceState<T>>) => {
                const prev = get.state();
                const result = { ...prev, ...partial };
                if (!isSsr()) LocalStorage.set(`@unamed/table-${prev.name}`, result);
                return result;
            };
            return {
                set: (getters: TableGetters<T>) => intercept(getters),
            };
        }
    );
    return { ...state, ...dispatch, name };
};
