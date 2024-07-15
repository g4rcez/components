import { AnimatePresence, motion } from "framer-motion";
import Linq from "linq-arrays";
import React, { Fragment, HTMLAttributes, useMemo } from "react";
import { TableBodyProps, TableVirtuoso } from "react-virtuoso";
import { Is } from "sidekicker";
import { useReducer } from "use-typed-reducer";
import { path } from "../../lib/fns";
import { OptionProps } from "../form/select";
import { FilterConfig } from "./filter";
import { GroupItem } from "./group";
import { Metadata } from "./metadata";
import { multiSort, Sorter } from "./sort";
import { CellPropsElement, Col, ColMatrix, createOptionCols, TableOperationProps } from "./table-lib";
import { TableHeader } from "./thead";

type InnerTableProps<T extends {}> = HTMLAttributes<HTMLTableElement> &
    TableOperationProps<T> & {
        loading?: boolean;
        group?: GroupItem<T>;
        groups?: GroupItem<T>[];
        optionCols: OptionProps[];
        index: number;
        rows: T[];
        cols: Col<T>[];
        sorters?: Sorter<T>[];
        showMetadata?: boolean;
        filters?: FilterConfig<T>[];
        setGroups: React.Dispatch<React.SetStateAction<GroupItem<T>[]>>;
    };

const TableBody = React.forwardRef((props: TableBodyProps, ref: any) => (
    <tbody {...props} className={`divide-y divide-table-border ${props.className ?? ""}`} ref={ref}>
        <AnimatePresence>{props.children}</AnimatePresence>
    </tbody>
));

const VirtualTable = React.forwardRef((props: any, ref) => (
    <table {...props} ref={ref as any} className={`table min-w-full divide-y divide-table-border table-auto text-left ${props.className ?? ""}`} />
));

const Thead = React.forwardRef((props: any, ref: any) => <thead {...props} className="bg-content-bg shadow-xs group:sticky top-0" ref={ref} />);

const TRow = React.forwardRef((props: any, ref: any) => <tr {...props} ref={ref} className={`table-row ${props.className ?? ""}`} />);

const components = {
    TableHead: Thead as any,
    Table: VirtualTable as any,
    TableBody: TableBody as any,
    TableRow: TRow as any,
};

const loadingArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const InnerTable = <T extends {}>({ filters, setCols, setFilters, sorters, cols, setSorters, ...props }: InnerTableProps<T>) => {
    const rows = useMemo(() => {
        if (props.loading) return loadingArray as any as T[];
        const linq = new Linq(props.rows);
        if (filters.length > 0) {
            filters.forEach((x) => (x.value === "" || Number.isNaN(x.value) ? undefined : linq.Where(x.name as any, x.operation.symbol, x.value)));
        }
        if (sorters.length === 0) return linq.Select();
        return multiSort(linq.Select(), sorters);
    }, [props.rows, filters, sorters, props.loading]);

    return (
        <div className="group border border-table-border rounded-lg px-1 min-w-full">
            <TableVirtuoso
                data={rows}
                totalCount={rows.length}
                useWindowScroll
                components={components}
                fixedHeaderContent={() => (
                    <TableHeader<T>
                        sorters={sorters}
                        setSorters={setSorters}
                        filters={filters}
                        setFilters={setFilters}
                        headers={cols}
                        setCols={setCols}
                    />
                )}
                itemContent={(index, row) =>
                    cols.map((col, colIndex) => {
                        const matrix: ColMatrix = `${colIndex},${index}`;
                        const value: any = path(row, col.id as any);
                        const Component: React.FC<CellPropsElement<T, any>> = col.Element as any;
                        return (
                            <td
                                {...col.cellProps}
                                data-matrix={matrix}
                                key={`accessor-${index}-${colIndex}`}
                                className="px-2 h-14 border-none first:table-cell hidden md:table-cell"
                            >
                                {props.loading ? (
                                    <div className="animate-pulse h-2 bg-table-border rounded" />
                                ) : Component ? (
                                    <Component row={row} matrix={matrix} col={col} rowIndex={index} value={value} />
                                ) : (
                                    <Fragment>{Is.nil(value) ? "" : value}</Fragment>
                                )}
                            </td>
                        );
                    })
                }
            />
        </div>
    );
};

export type TableProps<T extends {}> = Pick<InnerTableProps<T>, "cols" | "rows"> & {
    name: string;
} & Partial<TableOperationProps<T> & { reference: keyof T; loading: boolean }>;

const dispatcherFun = <Prev extends any, T extends Prev | ((prev: Prev) => Prev)>(prev: Prev, setter: T) =>
    typeof setter === "function" ? setter(prev) : setter;

type DispatcherFun<T extends any> = T | ((prev: T) => T);

export const Table = <T extends {}>(props: TableProps<T>) => {
    const optionCols = useMemo(() => createOptionCols(props.cols), [props.cols]);
    const [state, dispatch] = useReducer(
        {
            cols: props.cols as Col<T>[],
            filters: (props.filters ?? []) as FilterConfig<T>[],
            groups: (props.groups ?? []) as GroupItem<T>[],
            sorters: (props.sorters ?? []) as Sorter<T>[],
        },
        (get) => {
            const create =
                <T extends any>(key: string) =>
                (arg: T) => {
                    const state = get.state();
                    return { ...state, [key]: dispatcherFun(state[key as keyof typeof state], arg as any) };
                };
            return {
                cols: create<DispatcherFun<Col<T>[]>>("cols"),
                filters: create<DispatcherFun<FilterConfig<T>[]>>("filters"),
                groups: create<DispatcherFun<GroupItem<T>[]>>("groups"),
                sorters: create<DispatcherFun<Sorter<T>[]>>("sorters"),
            };
        },
        {
            postMiddleware: [
                (state) => {
                    props.set?.(state as any);
                    return state;
                },
            ],
        }
    );

    return (
        <div className="relative min-w-full">
            <Metadata
                setCols={dispatch.cols}
                rows={props.rows}
                cols={state.cols}
                filters={state.filters}
                groups={state.groups}
                options={optionCols}
                setFilters={dispatch.filters}
                setGroups={dispatch.groups}
                setSorters={dispatch.sorters}
                sorters={state.sorters}
            />
            {state.groups.length === 0 ? (
                <InnerTable
                    {...props}
                    cols={state.cols}
                    filters={state.filters}
                    groups={state.groups}
                    index={0}
                    optionCols={optionCols}
                    options={optionCols}
                    setCols={dispatch.cols}
                    setFilters={dispatch.filters}
                    setGroups={dispatch.groups}
                    setSorters={dispatch.sorters}
                    sorters={state.sorters}
                />
            ) : (
                <div className="flex flex-wrap gap-4">
                    {state.groups.map((group, index) => (
                        <motion.div className="min-w-full" key={`group-${group.groupId}`}>
                            <InnerTable
                                {...props}
                                cols={state.cols}
                                filters={state.filters}
                                group={group}
                                groups={state.groups}
                                index={index}
                                optionCols={optionCols}
                                options={optionCols}
                                rows={group.rows}
                                setCols={dispatch.cols}
                                setFilters={dispatch.filters}
                                setGroups={dispatch.groups}
                                setSorters={dispatch.sorters}
                                sorters={state.sorters}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
