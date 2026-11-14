import type { Symbols } from "linq-arrays";
import type { TranslationOverrides } from "../../hooks/use-translations";
import Linq from "linq-arrays";
import { AnimatePresence } from "motion/react";
import React, {
    type ComponentProps,
    type CSSProperties,
    Fragment,
    type HTMLAttributes,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { type ContextProp, GroupedTableVirtuoso, type ItemProps, type TableBodyProps, type TableComponents, TableVirtuoso } from "react-virtuoso";
import { Is } from "sidekicker";
import { useStableRef } from "../../hooks/use-stable-ref";
import { useTranslations } from "../../hooks/use-translations";
import { css } from "../../lib/dom";
import { path } from "../../lib/fns";
import type { AllPaths } from "../../lib/path-types";
import type { Any } from "../../types";
import { Empty } from "../display/empty/empty";
import { Skeleton } from "../display/skeleton/skeleton";
import type { OptionProps } from "../form/select/select";
import type { FilterConfig } from "./filter";
import type { GroupItem } from "./group";
import { tableRootStyles } from "./index.styles";
import { tableInnerTableStyles } from "./inner-table.styles";
import { Pagination } from "./pagination";
import { Row, type RowSelection } from "./row";
import { multiSort, type Sorter } from "./sort";
import type { CellAsideElement, Col, TableOperationProps } from "./table-lib";
import { useTable } from "./table.context";
import { TableHeader } from "./thead";

type VirtuosoCtx = {
    cols: Col<Record<string, unknown>>[];
    loading?: boolean;
    loadingMore?: boolean;
    selection?: RowSelection<Record<string, unknown>>;
    Aside?: React.FC<CellAsideElement<Record<string, unknown>>>;
    getRowProps?: (_: Record<string, unknown>) => ComponentProps<"tr">;
};

type VirtuosoData = Record<string, unknown>;

export type InnerTableProps<T extends Any> = HTMLAttributes<HTMLTableElement> &
    TableOperationProps<T> & {
        rows: T[];
        index: number;
        cols: Col<T>[];
        allCols?: Col<T>[];
        sticky?: number;
        border?: boolean;
        loading?: boolean;
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
        translations?: TranslationOverrides;
        selection?: TableSelection<T>;
    };

export type TableSelection<T extends Any> = {
    reference: keyof T;
    selected: Array<T[keyof T]>;
    onChange: (ids: Array<T[keyof T]>) => void;
};

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps & ContextProp<unknown>>(
    ({ context: _context, className = "", ...props }, ref) => (
        <tbody {...props} role="rowgroup" className={css(tableInnerTableStyles.slots.body, className)} ref={ref}>
            <AnimatePresence>{React.Children.toArray(props.children)}</AnimatePresence>
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
    const style: CSSProperties = {
        ...props.style,
        top: stickyOffset,
        insetBlockStart: stickyOffset,
    };
    return <thead {...props} ref={ref} style={style} role="rowgroup" className={tableInnerTableStyles.slots.head} />;
});

type GroupRowProps = HTMLAttributes<HTMLTableRowElement> & ContextProp<{ sticky?: number }>;

// Virtuoso sticks the group row under the header (`top` = header height) and ignores the header's own `sticky` offset.
const GroupRow = React.forwardRef<HTMLTableRowElement, GroupRowProps>(({ context, style, ...props }, ref) => {
    const top = Is.number(context.sticky) && Is.number(style?.top) ? style.top + context.sticky : style?.top;
    // Explicit roles: below 768px the group `th` is `display:block`, and WebKit can drop implicit table semantics (components#106).
    return <tr {...props} role="row" ref={ref} style={{ ...style, top }} />;
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
    Group: GroupRow as unknown as TableComponents<VirtuosoData, VirtuosoCtx>["Group"],
    Table: VirtualTable,
    TableFoot: TFoot as unknown as TableComponents<VirtuosoData, VirtuosoCtx>["TableFoot"],
    TableHead: Thead as unknown as TableComponents<VirtuosoData, VirtuosoCtx>["TableHead"],
    TableBody: TableBody as unknown as TableComponents<VirtuosoData, VirtuosoCtx>["TableBody"],
};

const loadingArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const LoadingStatus = (props: { translations?: TranslationOverrides }) => {
    const translations = useTranslations(props.translations);
    return <div role="status" aria-busy="true" aria-label={translations.skeletonLoading} />;
};

const EmptyContent = (props: { loading?: boolean; translations?: TranslationOverrides }) => (
    <div className={tableInnerTableStyles.slots.empty}>
        {props.loading ? <Skeleton translations={props.translations} /> : <Empty translations={props.translations} />}
    </div>
);

const EmptyCell = () => <Fragment />;

const emptyRows: never[] = [];

// `data` is indexed by Virtuoso's flat position, so each group header takes a slot (`undefined`) before its rows.
type RowGroups<T> = { rows: T[]; data: Array<T | undefined>; counts: number[]; labels: React.ReactNode[] };

/**
 * Buckets the current (filtered and sorted) rows by group, so a group whose rows were all filtered out disappears.
 * A row joins the group that lists it in `rows` (groups set in code) or whose `groupName` is its value (toolbar groups).
 * Any other value gets its own group at the end.
 */
const groupRows = <T extends Record<string, unknown>>(rows: T[], groups: GroupItem<T>[], emptyLabel: string): RowGroups<T> => {
    const key = String(groups[0].groupKey) as AllPaths<T>;
    const members = groups.map((group) => new Set<T>(group.rows));
    const buckets = groups.map((): T[] => []);
    const extras = new Map<string, T[]>();
    rows.forEach((row) => {
        const raw = String(path(row, key));
        const index = members.findIndex((set) => set.has(row));
        const target = index >= 0 ? index : groups.findIndex((group) => group.groupName === raw);
        if (target >= 0) return void buckets[target].push(row);
        extras.set(raw, [...(extras.get(raw) ?? []), row]);
    });
    const label = (name: string, row: T, title?: React.ReactNode) => {
        const raw = path(row, key) as unknown;
        const empty = Is.nil(raw) || raw === "";
        return title ?? (empty && name === String(raw) ? emptyLabel : name);
    };
    const parts = [
        ...groups.map((group, index) => ({
            rows: buckets[index],
            label: buckets[index][0] && label(group.groupName, buckets[index][0], group.groupTitle),
        })),
        ...[...extras].map(([name, bucket]) => ({ rows: bucket, label: label(name, bucket[0]) })),
    ].filter((part) => part.rows.length > 0);
    return {
        rows: parts.flatMap((part) => part.rows),
        data: parts.flatMap((part) => [undefined, ...part.rows]),
        counts: parts.map((part) => part.rows.length),
        labels: parts.map((part) => part.label),
    };
};

const scrollableOverflow = new Set(["auto", "overlay", "scroll"]);

const resolveScrollParent = (viewport: HTMLElement, preferred?: HTMLElement) => {
    let element = viewport.parentElement;
    while (element && element !== preferred) {
        const { overflowY } = window.getComputedStyle(element);
        if (scrollableOverflow.has(overflowY)) return element;
        element = element.parentElement;
    }
    return preferred;
};

export const InnerTable = <T extends Record<string, unknown>>({
    cols,
    allCols = cols,
    filters,
    setCols,
    sorters,
    setFilters,
    setSorters,
    onScrollEnd,
    getScrollRef,
    pagination = null,
    useControl = false,
    sticky,
    translations,
    selection,
    border = false,
    groups = [],
    ...props
}: InnerTableProps<T>) => {
    const translation = useTranslations(translations);
    const ref = useRef<HTMLDivElement | null>(null);
    const tweaks = useTable();
    const [scrollParent, setScrollParent] = useState<HTMLElement>();
    const setViewportRef = useCallback(
        (viewport: HTMLDivElement | null) => {
            if (!viewport || !getScrollRef) return;
            setScrollParent(resolveScrollParent(viewport, getScrollRef()));
        },
        [getScrollRef]
    );
    const onScrollEndRef = useStableRef(onScrollEnd);
    const loadingMoreRef = useStableRef(props.loadingMore);

    const filteredRows = useMemo(() => {
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

    const grouped = useMemo(
        () => (props.loading || groups.length === 0 ? undefined : groupRows(filteredRows, groups, translation.tableGroupEmptyValue)),
        [props.loading, filteredRows, groups, translation.tableGroupEmptyValue]
    );
    const rows = grouped?.rows ?? filteredRows;

    useEffect(() => {
        if (ref.current === null) return () => {};
        const div = ref.current;
        const observer = new IntersectionObserver((entries) => {
            const endOfPage = entries[entries.length - 1];
            const condition = endOfPage.isIntersecting && loadingMoreRef.current;
            if (condition) {
                onScrollEndRef.current?.();
            }
        });
        observer.observe(div);
        return () => observer.disconnect();
    }, [loadingMoreRef, onScrollEndRef]);

    const empty = rows.length === 0;

    const selectionState = useMemo(() => {
        if (!selection) return undefined;
        const { reference, selected, onChange } = selection;
        const selectedSet = new Set(selected);
        const ids = props.loading ? [] : rows.map((row) => row[reference]);
        const idSet = new Set(ids);
        const count = ids.filter((id) => selectedSet.has(id)).length;
        const all = ids.length > 0 && count === ids.length;
        const row: RowSelection<T> = {
            isSelected: (item) => selectedSet.has(item[reference]),
            label: (item, rowIndex) => translation.tableSelectRowLabel(Is.nil(item?.[reference]) ? String(rowIndex + 1) : String(item[reference])),
            toggle: (item) => {
                const id = item[reference];
                onChange(selectedSet.has(id) ? selected.filter((x) => x !== id) : [...selected, id]);
            },
        };
        const header = {
            checked: all,
            indeterminate: count > 0 && !all,
            disabled: ids.length === 0,
            onToggle: () => onChange(all ? selected.filter((id) => !idSet.has(id)) : [...selected, ...ids.filter((id) => !selectedSet.has(id))]),
        };
        return { row, header };
    }, [selection, props.loading, rows, translation]);

    const context = {
        cols: cols,
        Aside: props.Aside,
        loading: props.loading,
        getRowProps: props.getRowProps,
        loadingMore: props.loadingMore,
        selection: selectionState?.row,
        sticky: sticky || tweaks.sticky,
    };

    const virtuosoProps = {
        components,
        context: context as VirtuosoCtx,
        useWindowScroll: !getScrollRef,
        customScrollParent: scrollParent,
        fixedHeaderContent: () => (
            <TableHeader<T>
                headers={cols}
                columns={allCols}
                filters={filters}
                setCols={setCols}
                sorters={sorters}
                setFilters={setFilters}
                setSorters={setSorters}
                loading={!!props.loading}
                selection={selectionState?.header}
                inlineFilter={props.inlineFilter}
                inlineSorter={props.inlineSorter}
                translations={translations}
            />
        ),
    };

    return (
        <div ref={setViewportRef} data-border={border} className={tableInnerTableStyles.slots.viewport}>
            {props.loading && !empty ? <LoadingStatus translations={translations} /> : null}
            {grouped && !empty ? (
                <GroupedTableVirtuoso
                    {...virtuosoProps}
                    data={grouped.data as VirtuosoData[]}
                    groupCounts={grouped.counts}
                    groupContent={(groupIndex) => (
                        <th
                            role="rowheader"
                            scope="rowgroup"
                            colSpan={cols.length + (selection ? 1 : 0)}
                            className={tableRootStyles.slots["group-title"]}
                        >
                            {grouped.labels[groupIndex]}
                        </th>
                    )}
                    itemContent={(index, _groupIndex, row, itemContext) => Row(index, row, itemContext)}
                />
            ) : (
                <TableVirtuoso {...virtuosoProps} totalCount={rows.length} data={empty ? emptyRows : rows} itemContent={empty ? EmptyCell : Row} />
            )}
            {empty ? <EmptyContent loading={props.loading} translations={translations} /> : null}
            <div aria-hidden="true" ref={ref} className={tableInnerTableStyles.slots.sentinel} />
            {pagination !== null ? <Pagination {...pagination} translations={translations} /> : null}
        </div>
    );
};
