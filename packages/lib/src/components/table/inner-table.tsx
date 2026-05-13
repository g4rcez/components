import Linq from "linq-arrays";
import { Symbols } from "linq-arrays";
import { AnimatePresence } from "motion/react";
import React, { ComponentProps, CSSProperties, Fragment, HTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { ContextProp, ItemProps, TableBodyProps, TableComponents, TableVirtuoso } from "react-virtuoso";
import { Is } from "sidekicker";
import { useStableRef } from "../../hooks/use-stable-ref";
import { Empty } from "../display/empty";
import { SkeletonCell } from "../display/skeleton";
import { OptionProps } from "../form/select";
import { FilterConfig } from "./filter";
import { GroupItem } from "./group";
import { Pagination } from "./pagination";
import { Row } from "./row";
import { multiSort, Sorter } from "./sort";
import { CellAsideElement, Col, TableOperationProps } from "./table-lib";
import { useTable } from "./table.context";
import { TableHeader } from "./thead";
import { Any } from "../../types";

type VirtuosoCtx = {
    cols: Col<Record<string, unknown>>[];
    loading?: boolean;
    loadingMore?: boolean;
    Aside?: React.FC<CellAsideElement<Record<string, unknown>>>;
    getRowProps?: (_: Record<string, unknown>) => ComponentProps<"tr">;
};

type VirtuosoData = Record<string, unknown>;

export type InnerTableProps<T extends Any> = HTMLAttributes<HTMLTableElement> &
    TableOperationProps<T> & {
        rows: T[];
        index: number;
        cols: Col<T>[];
        border?: boolean;
        loading?: boolean;
        group?: GroupItem<T>;
        useControl?: boolean;
        loadingMore?: boolean;
        sorters?: Sorter<T>[];
        showMetadata?: boolean;
        groups?: GroupItem<T>[];
        onScrollEnd?: () => void;
        optionCols: OptionProps[];
        filters?: FilterConfig<T>[];
        Aside?: React.FC<CellAsideElement<T>>;
        getScrollRef?: () => HTMLElement | undefined;
        getRowProps?: (_: T) => ComponentProps<"tr">;
        setGroups: React.Dispatch<React.SetStateAction<GroupItem<T>[]>>;
    };

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps & ContextProp<unknown>>(
    ({ context: _context, className = "", ...props }, ref) => (
        <tbody {...props} role="rowgroup" className={`divide-y divide-table-border ${className}`} ref={ref}>
            <AnimatePresence>{props.children}</AnimatePresence>
        </tbody>
    )
);

type VirtualTableProps = Pick<React.ComponentProps<"table">, "children" | "style" | "className"> & ContextProp<unknown>;

const VirtualTable = React.forwardRef<HTMLTableElement, VirtualTableProps>(({ context: _context, className = "", ...props }, ref) => (
    <table
        {...props}
        role="table"
        ref={ref}
        style={{ ...props.style, "--table-cell-padding": "0.75rem" } as CSSProperties}
        className={`table w-full table-fixed border-separate border-spacing-0 text-left ${className ?? ""}`}
    />
));

type TheadProps = Pick<React.ComponentProps<"thead">, "children" | "style"> & ContextProp<unknown>;

const Thead = React.forwardRef<HTMLTableSectionElement, TheadProps>(({ context: _context, ...props }, ref) => {
    const ctx = useTable();
    const style = {
        ...props.style,
        top: Is.number(ctx.sticky) ? `${ctx.sticky}px` : undefined,
    };
    return <thead {...props} ref={ref} style={style} role="rowgroup" className="group:sticky top-0 hidden bg-transparent md:table-header-group" />;
});

type TRowProps = ItemProps<VirtuosoData> & ContextProp<VirtuosoCtx> & { className?: string };

const TRow = React.forwardRef<HTMLTableRowElement, TRowProps>(({ context, item, className, ...props }, ref) => {
    const contextProps = item ? context?.getRowProps?.(item) : undefined;
    const innerProps = { ...props, ...contextProps };
    return (
        <tr
            {...(innerProps as React.HTMLAttributes<HTMLTableRowElement>)}
            role="row"
            ref={ref}
            className={`group-table-row flex h-fit flex-col flex-wrap justify-center gap-table-row-gap pb-table-row-pb md:table-row ${[className, contextProps?.className].filter(Boolean).join(" ")}`}
        />
    );
});

type TFootProps = Pick<React.ComponentProps<"tfoot">, "children" | "style"> & ContextProp<VirtuosoCtx>;

const TFoot = React.forwardRef<HTMLTableSectionElement, TFootProps>(({ context, ...props }, ref) => {
    if (context?.loadingMore) {
        return (
            <tfoot {...props} ref={ref} className="bg-card-background">
                <tr role="row" className="bg-card-background">
                    <td colSpan={999} className="h-table-loading-h bg-card-background px-table-cell-px">
                        <span className="rounded-table-loading-bar-radius block h-table-loading-bar-h w-full animate-pulse bg-foreground opacity-60" />
                    </td>
                </tr>
            </tfoot>
        );
    }
    return null;
});

const components: TableComponents<VirtuosoData, VirtuosoCtx> = {
    TableRow: TRow,
    TableFoot: TFoot,
    TableHead: Thead,
    Table: VirtualTable,
    TableBody: TableBody,
};

const loadingArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const EmptyContent = (props: { loading?: boolean }) => (
    <div className="flex h-table-empty-h w-full items-center justify-center px-table-cell-px">{props.loading ? SkeletonCell : <Empty />}</div>
);

const EmptyCell = () => <Fragment />;

const emptyRows: never[] = [];

export const InnerTable = <T extends Record<string, unknown>>({
    cols,
    filters,
    setCols,
    sorters,
    setFilters,
    setSorters,
    onScrollEnd,
    getScrollRef,
    pagination = null,
    useControl = false,
    ...props
}: InnerTableProps<T>) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [, setShowLoadingFooter] = useState(false);
    const onScrollEndRef = useStableRef(onScrollEnd);
    const loadingMoreRef = useStableRef(props.loadingMore);

    const rows = useMemo(() => {
        if (props.loading) return loadingArray as unknown as T[];
        if (useControl) return props.rows;
        const linq = new Linq(props.rows);
        if (filters.length > 0) {
            filters.forEach((x) =>
                x.value === "" || Number.isNaN(x.value) ? undefined : linq.Where(x.name as keyof T, x.operation.symbol as Symbols, x.value)
            );
        }
        if (sorters.length === 0) return linq.Select();
        return multiSort(linq.Select(), sorters);
    }, [props.loading, props.rows, useControl, filters, sorters]);

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
    }, [loadingMoreRef, onScrollEndRef]);

    const empty = rows.length === 0;

    const context = {
        cols: cols,
        Aside: props.Aside,
        loading: props.loading,
        getRowProps: props.getRowProps,
        loadingMore: props.loadingMore,
    };

    return (
        <div className="group relative flex w-full flex-col whitespace-nowrap rounded-table-radius bg-table-background">
            <TableVirtuoso
                components={components}
                context={context as VirtuosoCtx}
                totalCount={rows.length}
                itemContent={empty ? EmptyCell : Row}
                data={empty ? emptyRows : rows}
                useWindowScroll={getScrollRef ? false : true}
                customScrollParent={getScrollRef ? getScrollRef() : undefined}
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
            {empty ? <EmptyContent loading={props.loading} /> : null}
            <div aria-hidden="true" ref={ref} className="h-0.5 w-full" />
            {pagination !== null ? <Pagination {...pagination} /> : null}
        </div>
    );
};
