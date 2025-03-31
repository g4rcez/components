import { AnimatePresence } from "motion/react";
import Linq from "linq-arrays";
import React, { createContext, Fragment, HTMLAttributes, useContext, useEffect, useMemo, useRef, useState } from "react";
import { TableBodyProps, TableVirtuoso } from "react-virtuoso";
import { Is } from "sidekicker";
import { useReducer } from "use-typed-reducer";
import { useStableRef } from "../../hooks/use-stable-ref";
import { path } from "../../lib/fns";
import { Any } from "../../types";
import { Empty } from "../display/empty";
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

type InnerTableProps<T extends Any> = HTMLAttributes<HTMLTableElement> &
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
    cols: Col<Any>[];
    loading?: boolean;
    loadingMore?: boolean;
};

const SkeletonLoading = <div className="h-2 w-10/12 animate-pulse rounded bg-table-border" />;

const EmptyContent = (_: number, __: any, context: ItemContentContext) => (
    <td
        role="cell"
        colSpan={context.cols.length}
        className="hidden h-14 border-l border-table-border px-2 first:table-cell first:border-transparent md:table-cell"
    >
        {context.loading ? SkeletonLoading : <Empty />}
    </td>
);

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
                            SkeletonLoading
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

const emptyRows = [{}];

const InnerTable = <T extends Any>({
    cols,
    filters,
    setCols,
    sorters,
    setFilters,
    setSorters,
    onScrollEnd,
    border = false,
    pagination = null,
    useControl = false,
    ...props
}: InnerTableProps<T>) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [showLoadingFooter, setShowLoadingFooter] = useState(false);
    const onScrollEndRef = useStableRef(onScrollEnd);
    const loadingMoreRef = useStableRef(props.loadingMore);

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
        if (ref.current === null) return () => {};
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
                    useWindowScroll
                    followOutput="smooth"
                    components={components}
                    totalCount={rows.length}
                    data={rows.length === 0 ? emptyRows : rows}
                    fixedFooterContent={showLoadingFooter ? Frag : null}
                    itemContent={rows.length === 0 ? EmptyContent : ItemContent}
                    context={{ loading: props.loading, loadingMore: props.loadingMore, cols: cols as any }}
                    fixedHeaderContent={() => (
                        <TableHeader<T>
                            headers={cols}
                            filters={filters}
                            setCols={setCols}
                            sorters={sorters}
                            setFilters={setFilters}
                            setSorters={setSorters}
                            loading={!!props.loading}
                            inlineFilter={props.inlineFilter}
                            inlineSorter={props.inlineSorter}
                        />
                    )}
                />
                <div aria-hidden="true" ref={ref} className="h-0.5 w-full" />
            </div>
            {pagination !== null ? <Pagination {...pagination} /> : null}
        </div>
    );
};

export type TableProps<T extends Any> = Pick<InnerTableProps<T>, "cols" | "rows" | "loadingMore" | "border"> & {
    name: string;
} & Partial<
        TableOperationProps<T> & {
            sticky: number;
            loading: boolean;
            reference: keyof T;
            operations: boolean;
            useControl: boolean;
            inlineFilter: boolean;
            inlineSorter: boolean;
            onScrollEnd: () => void;
        }
    >;

const dispatcherFun = <Prev extends Any, T extends Prev | ((prev: Prev) => Prev)>(prev: Prev, setter: T) =>
    typeof setter === "function" ? setter(prev) : setter;

type DispatcherFun<T extends Any> = T | ((prev: T) => T);

const compareAndExec = <T extends any[]>(prev: T, state: T, exec?: (t: T) => void) => (prev === state ? undefined : exec?.(state));

export const Table = <T extends Any>(props: TableProps<T>) => {
    const contextState = useMemo((): ContextProps => ({ sticky: props.sticky }), [props.sticky]);
    const operations = props.operations ?? true;
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
                <T extends Any>(key: string) =>
                (arg: T) => {
                    const state = get.state();
                    return { ...state, [key]: dispatcherFun(state[key as keyof typeof state], arg as any) };
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
