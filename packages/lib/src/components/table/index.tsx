"use client";
import { AnimatePresence } from "motion/react";
import { type ComponentProps, useEffect, useMemo, useState } from "react";
import { useContext } from "react";
import { useReducer } from "use-typed-reducer";
import { useTweaks } from "../../hooks/use-tweaks";
import { Context } from "../../config/context";
import type { TranslationOverrides } from "../../hooks/use-translations";
import { defaultTranslations } from "../../config/default-translations";
import type { FilterConfig } from "./filter";
import type { GroupItem } from "./group";
import { InnerTable, type InnerTableProps, type TableSelection } from "./inner-table";
import { Metadata } from "./metadata";
import type { Sorter } from "./sort";
import { type Col, createOptionCols, type TableGetters, type TableOperationProps } from "./table-lib";
import { type TableContextProps, TableProvider } from "./table.context";

export type TableProps<T extends Record<string, unknown>> = Pick<InnerTableProps<T>, "cols" | "rows" | "loadingMore" | "border" | "Aside"> & {
    name: string;
    translations?: TranslationOverrides;
} & Partial<
        TableOperationProps<T> & {
            loading: boolean;
            reference: keyof T;
            operations: boolean;
            useControl: boolean;
            inlineFilter: boolean;
            inlineSorter: boolean;
            sticky: number | null;
            onScrollEnd: () => void;
            getScrollRef?: () => HTMLElement | undefined;
            getRowProps: (row: T) => ComponentProps<"tr">;
            /** Adds a first column with a checkbox per row and a "select all" checkbox. Needs `reference`. */
            selectable: boolean;
            /** Controlled selection: the `reference` values of the selected rows. Leave undefined for uncontrolled selection. */
            selected: Array<T[keyof T]>;
            /** Called with the full new list of selected ids and the matching rows from `rows`. */
            onSelectionChange: (ids: Array<T[keyof T]>, rows: T[]) => void;
        }
    >;

// The lib has no Node types. Bundlers replace `process.env.NODE_ENV` in app builds.
declare const process: { env: { NODE_ENV?: string } } | undefined;

const isDevelopment = () => typeof process === "undefined" || process.env.NODE_ENV !== "production";

const dispatcherFun = <Prev extends object, S extends Prev | ((prev: Prev) => Prev)>(prev: Prev, setter: S) =>
    typeof setter === "function" ? setter(prev) : setter;

type DispatcherFun<T extends object> = T | ((prev: T) => T);

const compareAndExec = <T extends unknown[]>(prev: T, state: T, exec?: (t: T) => void) => (prev === state ? undefined : exec?.(state));

export const Table = <T extends Record<string, unknown>>(props: TableProps<T>) => {
    const { translations, ...tableProps } = props;
    const context = useContext(Context);
    const translationContext = useMemo(
        () => (translations ? { ...context, map: { ...defaultTranslations, ...context?.map, ...translations } } : context),
        [context, translations]
    );
    const tweaks = useTweaks();
    const contextState = useMemo(
        (): TableContextProps => ({
            sticky: props.sticky === undefined ? (tweaks.table.sticky ?? undefined) : (props.sticky ?? undefined),
        }),
        [props.sticky, tweaks.table.sticky]
    );
    const operations = props.operations ?? tweaks.table.operations ?? true;
    const optionCols = useMemo(() => createOptionCols(props.cols), [props.cols]);
    const [state, dispatch] = useReducer(
        {
            cols: props.cols as Col<T>[],
            sorters: (props.sorters ?? []) as Sorter<T>[],
            groups: (props.groups ?? []) as GroupItem<T>[],
            filters: (props.filters ?? []) as FilterConfig<T>[],
        },
        (get) => {
            const create =
                <V extends object>(key: string) =>
                (arg: V) => {
                    const state = get.state();
                    type StateValue = (typeof state)[keyof typeof state];
                    return {
                        ...state,
                        [key]: dispatcherFun(state[key as keyof typeof state], arg as StateValue),
                    };
                };
            return {
                cols: create<DispatcherFun<Col<T>[]>>("cols"),
                sorters: create<DispatcherFun<Sorter<T>[]>>("sorters"),
                groups: create<DispatcherFun<GroupItem<T>[]>>("groups"),
                filters: create<DispatcherFun<FilterConfig<T>[]>>("filters"),
            };
        },
        {
            postMiddleware: [
                (state, prev) => {
                    props.set?.(state as unknown as TableGetters<T>);
                    compareAndExec(prev?.filters ?? [], state.filters ?? [], props.setFilters);
                    compareAndExec(prev?.sorters ?? [], state.sorters ?? [], props.setSorters);
                    compareAndExec(prev?.groups ?? [], state.groups ?? [], props.setGroups);
                    compareAndExec(prev?.cols ?? [], state.cols ?? [], props.setCols);
                    return state;
                },
            ],
        }
    );

    useEffect(() => {
        dispatch.cols(props.cols);
    }, [props.cols]);

    const visibleCols = useMemo(() => state.cols.filter((col) => col.visible !== false), [state.cols]);

    const { reference, selectable, onSelectionChange } = props;
    useEffect(() => {
        if (selectable && reference === undefined && isDevelopment()) {
            console.error(`Table "${props.name}": \`selectable\` needs \`reference\` to identify rows. The selection column is not rendered.`);
        }
    }, [selectable, reference, props.name]);
    const [innerSelected, setInnerSelected] = useState<Array<T[keyof T]>>([]);
    const controlled = props.selected !== undefined;
    const selected = props.selected ?? innerSelected;
    const selection = useMemo((): TableSelection<T> | undefined => {
        if (!selectable || reference === undefined) return undefined;
        return {
            reference,
            selected,
            onChange: (ids) => {
                if (!controlled) setInnerSelected(ids);
                const idSet = new Set(ids);
                onSelectionChange?.(
                    ids,
                    props.rows.filter((row) => idSet.has(row[reference]))
                );
            },
        };
    }, [selectable, reference, selected, controlled, onSelectionChange, props.rows]);

    return (
        <Context.Provider value={translationContext}>
            <TableProvider value={contextState}>
                <AnimatePresence propagate initial={false}>
                    {operations ? (
                        <Metadata
                            cols={state.cols}
                            rows={props.rows}
                            options={optionCols}
                            groups={state.groups}
                            filters={state.filters}
                            setCols={dispatch.cols}
                            sorters={state.sorters}
                            setGroups={dispatch.groups}
                            setFilters={dispatch.filters}
                            setSorters={dispatch.sorters}
                            pagination={props.pagination ?? null}
                            inlineFilter={props.inlineFilter ?? true}
                            inlineSorter={props.inlineSorter ?? true}
                        />
                    ) : null}
                    <InnerTable
                        {...tableProps}
                        index={0}
                        cols={visibleCols}
                        allCols={state.cols}
                        sticky={props.sticky ?? undefined}
                        options={optionCols}
                        groups={state.groups}
                        filters={state.filters}
                        optionCols={optionCols}
                        setCols={dispatch.cols}
                        sorters={state.sorters}
                        setGroups={dispatch.groups}
                        setFilters={dispatch.filters}
                        setSorters={dispatch.sorters}
                        selection={selection}
                        onScrollEnd={props.onScrollEnd}
                        pagination={props.pagination ?? null}
                        inlineFilter={props.inlineFilter ?? true}
                        inlineSorter={props.inlineSorter ?? true}
                    />
                </AnimatePresence>
            </TableProvider>
        </Context.Provider>
    );
};
