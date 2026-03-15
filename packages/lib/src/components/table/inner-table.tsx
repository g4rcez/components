import Linq from "linq-arrays";
import { AnimatePresence } from "motion/react";
import React, { ComponentProps, CSSProperties, Fragment, HTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { TableBodyProps, TableVirtuoso } from "react-virtuoso";
import { Is } from "sidekicker";
import { useStableRef } from "../../hooks/use-stable-ref";
import { Any } from "../../types";
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
            <tbody {...(props as any)} role="rowgroup" className={`divide-y divide-table-border ${className}`} ref={ref}>
                <AnimatePresence>{props.children}</AnimatePresence>
            </tbody>
        );
    }
);

const VirtualTable = React.forwardRef(({ context, className = "", ...props }: any, ref) => (
    <table
        {...props}
        role="table"
        ref={ref as any}
        style={{ ...props.style, "--table-cell-padding": "0.75rem" } as CSSProperties}
        className={`table w-full table-fixed border-separate border-spacing-0 text-left ${className ?? ""}`}
    />
));

const Thead = React.forwardRef(({ context, ...props }: any, ref: any) => {
    const ctx = useTable();
    const style = {
        ...(props as any)?.style,
        top: Is.number(ctx.sticky) ? `${ctx.sticky}px` : undefined,
    };
    return <thead {...props} ref={ref} style={style} role="rowgroup" className="group:sticky top-0 hidden bg-transparent md:table-header-group" />;
});

const TRow = React.forwardRef(({ context, item, ...props }: any, ref: any) => {
    const contextProps = context?.getRowProps?.(item);
    const innerProps = { ...props, ...contextProps };
    return (
        <tr
            {...innerProps}
            role="row"
            ref={ref}
            className={`group-table-row flex h-fit flex-col flex-wrap justify-center gap-1 pb-4 md:table-row ${[props?.className, contextProps?.className].filter(Boolean).join(" ")}`}
        />
    );
});

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
    TableRow: TRow as any,
    TableFoot: TFoot as any,
    TableHead: Thead as any,
    Table: VirtualTable as any,
    TableBody: TableBody as any,
};

const loadingArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const EmptyContent = (props: { loading?: boolean }) => (
    <div className="flex h-48 w-full items-center justify-center px-2">{props.loading ? SkeletonCell : <Empty />}</div>
);

const EmptyCell = () => <Fragment />;

const emptyRows: any[] = [];

export const InnerTable = <T extends Any>({
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
        <div className="group bg-table-background relative flex w-full flex-col whitespace-nowrap rounded-lg">
            <TableVirtuoso
                components={components}
                context={context as any}
                totalCount={rows.length}
                itemContent={empty ? EmptyCell : Row}
                data={empty ? (emptyRows as T[]) : rows}
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
