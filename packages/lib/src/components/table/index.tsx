import { AnimatePresence } from "framer-motion";
import Linq from "linq-arrays";
import React, { createContext, Fragment, HTMLAttributes, useContext, useEffect, useMemo, useRef, useState } from "react";
import { TableBodyProps, TableVirtuoso } from "react-virtuoso";
import { Is } from "sidekicker";
import { useReducer } from "use-typed-reducer";
import { useCallbackRef } from "../../hooks/use-callback-ref";
import { path } from "../../lib/fns";
import { OptionProps } from "../form/select";
import { FilterConfig } from "./filter";
import { GroupItem } from "./group";
import { Metadata } from "./metadata";
import { Pagination } from "./pagination";
import { multiSort, Sorter } from "./sort";
import { CellPropsElement, Col, ColMatrix, createOptionCols, TableOperationProps } from "./table-lib";
import { TableHeader } from "./thead";

type ContextProps = Partial<{ sticky: number }>;

const TableContext = createContext<ContextProps>({});

const useTable = () => useContext(TableContext);

type InnerTableProps<T extends {}> = HTMLAttributes<HTMLTableElement> &
    TableOperationProps<T> & {
        border?: boolean;
        useControl?: boolean;
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
        onScrollEnd?: () => void;
        loadingMore?: boolean;
    };

const TableBody = React.forwardRef(
    (
        {
            context,
            className = "",
            ...props
        }: TableBodyProps & {
            context: any;
        },
        ref: any
    ) => {
        return (
            <tbody {...props} role="rowgroup" className={`divide-y divide-table-border ${className}`} ref={ref}>
                <AnimatePresence>{props.children}</AnimatePresence>
            </tbody>
        );
    }
);

const VirtualTable = React.forwardRef(({ context, className = "", ...props }: any, ref) => (
    <table
        {...props}
        ref={ref as any}
        role="table"
        className={`table min-w-full table-auto divide-y divide-table-border text-left ${className ?? ""}`}
    />
));

const Thead = React.forwardRef(({ context, ...props }: any, ref: any) => {
    const ctx = useTable();
    const style = {
        ...(props as any)?.style,
        top: Is.number(ctx.sticky) ? `${ctx.sticky}px` : undefined,
    };
    return <thead {...props} style={style} role="rowgroup" className="shadow-xs group:sticky top-0 bg-card-background" ref={ref} />;
});

const TRow = React.forwardRef(({ context, item, ...props }: any, ref: any) => (
    <tr {...props} role="row" ref={ref} className={`table-row ${(props as any)?.className ?? ""}`} />
));

const TFoot = React.forwardRef((props: any, ref: any) => {
    if (props.context.loadingMore) {
        return (
            <tfoot {...props} ref={ref} className="bg-card-background">
                <tr role="row" className="bg-card-background">
                    <td colSpan={999} className="h-14 bg-card-background px-2">
                        <span className="block h-2 w-full animate-pulse rounded bg-foreground opacity-60" />
                    </td>
                </tr>
            </tfoot>
        );
    }
    return null;
});

const components = {
    TableHead: Thead as any,
    Table: VirtualTable as any,
    TableBody: TableBody as any,
    TableRow: TRow as any,
    TableFoot: TFoot as any,
};

const loadingArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

type ItemContentContext = {
    loading?: boolean;
    loadingMore?: boolean;
    cols: Col<any>[];
};

const ItemContent = (index: number, row: any, context: ItemContentContext) => {
    const cols = context.cols;
    const loading = context.loading;
    return (
        <Fragment>
            {cols.map((col, colIndex) => {
                const matrix: ColMatrix = `${colIndex},${index}`;
                const value: any = path(row, col.id as any);
                const Component: React.FC<CellPropsElement<any, any>> = col.Element as any;
                const className = col.cellProps?.className || "";
                return (
                    <td
                        {...col.cellProps}
                        role="cell"
                        data-matrix={matrix}
                        key={`accessor-${index}-${colIndex}`}
                        className={`hidden h-14 border-l border-table-border px-2 first:table-cell first:border-transparent md:table-cell ${className}`}
                    >
                        {loading ? (
                            <div className="h-2 w-10/12 animate-pulse rounded bg-table-border" />
                        ) : Component ? (
                            <Component row={row} matrix={matrix} col={col} rowIndex={index} value={value} />
                        ) : (
                            <Fragment>{Is.nil(value) ? "" : value}</Fragment>
                        )}
                    </td>
                );
            })}
        </Fragment>
    );
};

const Frag = () => <Fragment />;

const InnerTable = <T extends {}>({
    filters,
    pagination = null,
    onScrollEnd,
    useControl = false,
    setCols,
    setFilters,
    sorters,
    cols,
    border = false,
    setSorters,
    ...props
}: InnerTableProps<T>) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [showLoadingFooter, setShowLoadingFooter] = useState(false);
    const onScrollEndRef = useCallbackRef(onScrollEnd);
    const loadingMoreRef = useCallbackRef(props.loadingMore);

    const rows = useMemo(() => {
        if (props.loading) return loadingArray as any as T[];
        if (useControl) return props.rows;
        const linq = new Linq(props.rows);
        if (filters.length > 0) {
            filters.forEach((x) =>
                x.value === "" || Number.isNaN(x.value) ? undefined : linq.Where(x.name as any, x.operation.symbol as any, x.value)
            );
        }
        if (sorters.length === 0) return linq.Select();
        return multiSort(linq.Select(), sorters);
    }, [props.rows, filters, sorters, props.loading]);

    useEffect(() => {
        if (ref.current === null) {
            return () => {};
        }
        const div = ref.current;
        const observer = new IntersectionObserver((entries) => {
            const endOfPage = entries[entries.length - 1];
            const condition = endOfPage.isIntersecting && loadingMoreRef.current;
            if (condition) {
                onScrollEndRef.current?.();
                return void setShowLoadingFooter(true);
            }
            return setShowLoadingFooter(false);
        });
        observer.observe(div);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-w-full">
            <div className={`group rounded-lg ${border ? "border border-table-border" : ""}`}>
                <TableVirtuoso
                    data={rows}
                    useWindowScroll
                    followOutput="smooth"
                    components={components}
                    totalCount={rows.length}
                    itemContent={ItemContent}
                    context={{ loading: props.loading, loadingMore: props.loadingMore, cols: cols }}
                    fixedFooterContent={showLoadingFooter ? Frag : null}
                    fixedHeaderContent={() => (
                        <TableHeader<T>
                            filters={filters}
                            headers={cols}
                            inlineFilter={props.inlineFilter}
                            inlineSorter={props.inlineSorter}
                            loading={!!props.loading}
                            setCols={setCols}
                            setFilters={setFilters}
                            setSorters={setSorters}
                            sorters={sorters}
                        />
                    )}
                />
                <div aria-hidden="true" ref={ref} className="h-0.5 w-full" />
            </div>
            {pagination !== null ? <Pagination {...pagination} /> : null}
        </div>
    );
};

export type TableProps<T extends {}> = Pick<InnerTableProps<T>, "cols" | "rows" | "loadingMore" | "border"> & {
    name: string;
} & Partial<
        TableOperationProps<T> & {
            inlineFilter: boolean;
            inlineSorter: boolean;
            loading: boolean;
            onScrollEnd: () => void;
            operations: boolean;
            reference: keyof T;
            sticky: number;
            useControl: boolean;
        }
    >;

const dispatcherFun = <Prev extends any, T extends Prev | ((prev: Prev) => Prev)>(prev: Prev, setter: T) =>
    typeof setter === "function" ? setter(prev) : setter;

type DispatcherFun<T extends any> = T | ((prev: T) => T);

const compareAndExec = <T extends any[]>(prev: T, state: T, exec?: (t: T) => void) => (prev === state ? undefined : exec?.(state));

export const Table = <T extends {}>(props: TableProps<T>) => {
    const contextState = useMemo((): ContextProps => ({ sticky: props.sticky }), [props.sticky]);
    const operations = props.operations ?? true;
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
                (state, prev) => {
                    props.set?.(state as any);
                    compareAndExec(prev?.filters ?? [], state.filters ?? [], props.setFilters);
                    compareAndExec(prev?.sorters ?? [], state.sorters ?? [], props.setSorters);
                    compareAndExec(prev?.groups ?? [], state.groups ?? [], props.setGroups);
                    compareAndExec(prev?.cols ?? [], state.cols ?? [], props.setCols);
                    return state;
                },
            ],
        }
    );

    return (
        <TableContext.Provider value={contextState}>
            <div className="relative min-w-full" data-component="table">
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
                {state.groups.length === 0 ? (
                    <InnerTable
                        {...props}
                        index={0}
                        cols={state.cols}
                        options={optionCols}
                        groups={state.groups}
                        filters={state.filters}
                        optionCols={optionCols}
                        setCols={dispatch.cols}
                        sorters={state.sorters}
                        setGroups={dispatch.groups}
                        setFilters={dispatch.filters}
                        setSorters={dispatch.sorters}
                        onScrollEnd={props.onScrollEnd}
                        pagination={props.pagination ?? null}
                        inlineFilter={props.inlineFilter ?? true}
                        inlineSorter={props.inlineSorter ?? true}
                    />
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {state.groups.map((group, index) => (
                            <div className="min-w-full" key={`group-${group.groupId}`}>
                                <InnerTable
                                    {...props}
                                    group={group}
                                    index={index}
                                    cols={state.cols}
                                    pagination={null}
                                    rows={group.rows}
                                    options={optionCols}
                                    groups={state.groups}
                                    filters={state.filters}
                                    optionCols={optionCols}
                                    setCols={dispatch.cols}
                                    sorters={state.sorters}
                                    setGroups={dispatch.groups}
                                    setFilters={dispatch.filters}
                                    setSorters={dispatch.sorters}
                                    onScrollEnd={props.onScrollEnd}
                                    inlineFilter={props.inlineFilter ?? true}
                                    inlineSorter={props.inlineSorter ?? true}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </TableContext.Provider>
    );
};
