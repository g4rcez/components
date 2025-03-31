"use client";
import { AnimatePresence, motion, PanInfo, Reorder } from "motion/react";
import { Order } from "linq-arrays";
import { PlusIcon, SearchCheckIcon, SearchXIcon } from "lucide-react";
import React, { useCallback, useRef } from "react";
import { useTranslations } from "../../hooks/use-translations";
import { Dropdown } from "../floating/dropdown";
import { ColumnHeaderFilter, createFilterFromCol, useOperators } from "./filter";
import { SorterHead } from "./sort";
import { Col, getLabel, TableOperationProps } from "./table-lib";

const dragConstraints = { top: 0, left: 0, right: 0, bottom: -1 };

type TableHeaderProps<T extends object> = {
    loading: boolean;
    headers: Col<T>[];
} & Pick<TableOperationProps<T>, "filters" | "setFilters" | "setCols" | "setSorters" | "sorters" | "inlineSorter" | "inlineFilter">;

type HeaderChildProps<T extends object> = {
    isLast: boolean;
    header: Col<T>;
    loading: boolean;
} & Pick<TableOperationProps<T>, "filters" | "setFilters" | "sorters" | "setSorters" | "inlineFilter" | "inlineSorter">;

const HeaderChild = <T extends object>(props: HeaderChildProps<T>) => {
    const translation = useTranslations();
    const ownFilters = props.filters.filter((x) => x.name === props.header.id);
    const hasFilters = ownFilters.length > 0;
    const defaultAllowSort = props.header.allowSort ?? true;
    const defaultAllowFilter = props.header.allowFilter ?? true;
    const operators = useOperators();
    const FilterIcon = hasFilters ? SearchCheckIcon : SearchXIcon;
    const th = useRef<HTMLTableCellElement | null>(null);

    const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.dataset.id || "";
        return props.setFilters((prev) => prev.filter((x) => x.id !== id));
    };

    const dragRef = useCallback((dom: HTMLTableCellElement | null) => {
        if (dom === null) return;
        th.current = dom;
        const controller = new AbortController();
        dom.addEventListener(
            "pointerdown",
            (e) => {
                const target = e.target as HTMLButtonElement;
                if (target.dataset.type === "resizer") {
                    e.stopPropagation();
                    return e.stopImmediatePropagation();
                }
            },
            { signal: controller.signal }
        );
        return () => controller.abort();
    }, []);

    const ownSorter = props.sorters.find((x) => props.header.id === x.value);

    const ariaSort = !ownSorter?.type ? "none" : ownSorter.type === Order.Asc ? "ascending" : "descending";

    const label = getLabel(props.header);

    return (
        <Reorder.Item
            {...(props.header.thProps as object)}
            as="th"
            ref={dragRef}
            initial={false}
            dragSnapToOrigin
            dragDirectionLock
            role="columnheader"
            aria-sort={ariaSort}
            value={props.header}
            aria-busy={props.loading}
            whileDrag={{ cursor: "grabbing" }}
            className={`relative hidden min-w-0 cursor-grab border border-b border-transparent border-b-table-border border-r-table-border font-medium first:table-cell last:border-r-transparent md:table-cell ${props.header.thProps?.className ?? ""}`}
        >
            <span className="flex h-full items-center justify-between px-2 py-4">
                <span className="flex items-center gap-1">
                    {props.inlineFilter && defaultAllowFilter ? (
                        <Dropdown
                            arrow
                            trigger={
                                <span>
                                    <span id={`${props.header.id}-filter-dropdown-button`} className="sr-only">
                                        {translation.tableFilterDropdownTitleUnique} {label}
                                    </span>
                                    <FilterIcon aria-labelledby={`${props.header.id}-filter-dropdown-button`} size={14} />
                                </span>
                            }
                            title={
                                <span className="text-lg font-medium">
                                    {translation.tableFilterDropdownTitleUnique} <span className="text-primary">{label}</span>
                                </span>
                            }
                        >
                            {ownFilters.length === 0 ? null : (
                                <ul className="font-medium">
                                    {ownFilters.map((filter) => (
                                        <li key={`thead-filter-${filter.id}`} className="my-1">
                                            <ColumnHeaderFilter onDelete={onDelete} filter={filter} set={props.setFilters} />
                                        </li>
                                    ))}
                                    <li>
                                        <button
                                            type="button"
                                            className="flex items-center gap-1 text-primary"
                                            onClick={() =>
                                                props.setFilters((prev) =>
                                                    prev.concat(createFilterFromCol(props.header, operators.options, operators.operations))
                                                )
                                            }
                                        >
                                            <PlusIcon size={14} /> {translation.tableFilterNewFilter}
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </Dropdown>
                    ) : null}
                    <span className="pointer-events-auto text-balance text-base">{props.header.thead}</span>
                    {props.inlineSorter && defaultAllowSort ? (
                        <SorterHead col={props.header} setSorters={props.setSorters} sorters={props.sorters} />
                    ) : null}
                </span>
            </span>
            {props.isLast ? null : (
                <motion.button
                    drag="x"
                    draggable
                    type="button"
                    animate={false}
                    initial={false}
                    dragListener
                    dragMomentum
                    dragElastic={0}
                    dragPropagation
                    dragSnapToOrigin
                    dragDirectionLock
                    data-type="resizer"
                    title={props.header.id}
                    dragConstraints={dragConstraints}
                    className="absolute right-0 top-0 block h-full w-1.5 cursor-col-resize hover:bg-primary active:bg-primary"
                    onDrag={(_: never, info: PanInfo) => {
                        if (th.current === null) return;
                        const v = th.current.getBoundingClientRect().width;
                        const delta = info.delta.x;
                        th.current.style.width = `${Math.abs(v + delta)}px`;
                    }}
                />
            )}
        </Reorder.Item>
    );
};

export const TableHeader = <T extends object>(props: TableHeaderProps<T>) => (
    <Reorder.Group
        layout
        as="tr"
        axis="x"
        drag="x"
        layoutRoot
        role="row"
        layoutScroll
        values={props.headers}
        onReorder={props.setCols}
        className="bg-table-header text-lg"
    >
        <AnimatePresence>
            {props.headers.map((header, index) => (
                <HeaderChild<T>
                    header={header}
                    filters={props.filters}
                    loading={props.loading}
                    sorters={props.sorters}
                    setFilters={props.setFilters}
                    setSorters={props.setSorters}
                    inlineFilter={props.inlineFilter}
                    inlineSorter={props.inlineSorter}
                    isLast={index === props.headers.length - 1}
                    key={`header-child-item-${header.id as string}`}
                />
            ))}
        </AnimatePresence>
    </Reorder.Group>
);
