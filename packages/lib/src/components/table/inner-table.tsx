import type { Symbols } from "linq-arrays";
import Linq from "linq-arrays";
import { AnimatePresence } from "motion/react";
import React, { type ComponentProps, type CSSProperties, Fragment, type HTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { type ContextProp, type ItemProps, type TableBodyProps, type TableComponents, TableVirtuoso } from "react-virtuoso";
import { Is } from "sidekicker";
import { useStableRef } from "../../hooks/use-stable-ref";
import { useTableTweaks, useTweaks } from "../../hooks/use-tweaks";
import { css } from "../../lib/dom";
import type { Any } from "../../types";
import { Empty } from "../display/empty/empty";
import { SkeletonCell } from "../display/skeleton/skeleton";
import type { OptionProps } from "../form/select/select";
import type { FilterConfig } from "./filter";
import type { GroupItem } from "./group";
import { tableInnerTableStyles } from "./inner-table.styles";
import { Pagination } from "./pagination";
import { Row } from "./row";
import { multiSort, type Sorter } from "./sort";
import type { CellAsideElement, Col, TableOperationProps } from "./table-lib";
import { TableHeader } from "./thead";

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
        <tbody {...props} role="rowgroup" className={css(tableInnerTableStyles.slots.body, className)} ref={ref}>
            <AnimatePresence>{props.children}</AnimatePresence>
        </tbody>
    )
);

type VirtualTableProps = Pick<React.ComponentProps<"table">, "children" | "style" | "className"> & ContextProp<unknown>;

const VirtualTable = React.forwardRef<HTMLTableElement, VirtualTableProps>(({ context: _context, className = "", ...props }, ref) => (
    <table {...props} role="table" ref={ref} style={props.style as CSSProperties} className={css(tableInnerTableStyles.slots.table, className)} />
));

type TheadProps = Pick<React.ComponentProps<"thead">, "children" | "style"> & ContextProp<{ sticky?: number }>;

const Thead = React.forwardRef<HTMLTableSectionElement, TheadProps>(({ context, ...props }, ref) => {
    const stickyOffset = Is.number(context.sticky) ? `${context.sticky}px` : undefined;
    console.log(context);
    const style: CSSProperties = {
        ...props.style,
        top: stickyOffset,
        insetBlockStart: stickyOffset,
    };
    return <thead {...props} ref={ref} style={style} role="rowgroup" className={tableInnerTableStyles.slots.head} />;
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
            className={css(tableInnerTableStyles.slots.row, className, contextProps?.className)}
        />
    );
});

type TFootProps = Pick<React.ComponentProps<"tfoot">, "children" | "style"> & ContextProp<VirtuosoCtx>;

const TFoot = React.forwardRef<HTMLTableSectionElement, TFootProps>(({ context, ...props }, ref) => {
    if (context?.loadingMore) {
        return (
            <tfoot {...props} ref={ref} className={tableInnerTableStyles.slots.footer}>
                <tr role="row" className={tableInnerTableStyles.slots["footer-row"]}>
                    <td colSpan={999} className={tableInnerTableStyles.slots["loading-cell"]}>
                        <span className={tableInnerTableStyles.slots["loading-bar"]} />
                    </td>
                </tr>
            </tfoot>
        );
    }
    return null;
});

const components: TableComponents<VirtuosoData, VirtuosoCtx> = {
    TableRow: TRow,
    Table: VirtualTable,
    TableFoot: TFoot as unknown as TableComponents<VirtuosoData, VirtuosoCtx>["TableFoot"],
    TableHead: Thead as unknown as TableComponents<VirtuosoData, VirtuosoCtx>["TableHead"],
    TableBody: TableBody as unknown as TableComponents<VirtuosoData, VirtuosoCtx>["TableBody"],
};

const loadingArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const EmptyContent = (props: { loading?: boolean }) => (
    <div className={tableInnerTableStyles.slots.empty}>{props.loading ? SkeletonCell : <Empty />}</div>
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
    const t = useTweaks();
    const tweaks = useTableTweaks();
    console.log({ t, tweaks });
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
        sticky: tweaks.sticky,
        loading: props.loading,
        getRowProps: props.getRowProps,
        loadingMore: props.loadingMore,
    };

    return (
        <div className={tableInnerTableStyles.slots.viewport}>
            <TableVirtuoso
                components={components}
                totalCount={rows.length}
                data={empty ? emptyRows : rows}
                context={context as VirtuosoCtx}
                itemContent={empty ? EmptyCell : Row}
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
            <div aria-hidden="true" ref={ref} className={tableInnerTableStyles.slots.sentinel} />
            {pagination !== null ? <Pagination {...pagination} /> : null}
        </div>
    );
};
