"use client";
import { AnimatePresence, motion, type PanInfo, Reorder } from "motion/react";
import { Order } from "linq-arrays";
import { PlusIcon, MagnifyingGlassIcon, MagnifyingGlassMinusIcon } from "@phosphor-icons/react";
import type React from "react";
import { Fragment, useCallback, useRef } from "react";
import { useTranslations } from "../../hooks/use-translations";
import { useTweaks } from "../../hooks/use-tweaks";
import { css } from "../../lib/dom";
import { Dropdown } from "../floating/dropdown/dropdown";
import { ColumnHeaderFilter, createFilterFromCol, useOperators } from "./filter";
import { SorterHead } from "./sort";
import { tableHeadStyles } from "./thead.styles";
import { type Col, getLabel, type TableOperationProps, useWidthControl } from "./table-lib";

const dragConstraints = { top: 0, left: 0, right: 0, bottom: -1 };

type TableHeaderProps<T extends object> = {
    loading: boolean;
    headers: Col<T>[];
} & Pick<TableOperationProps<T>, "filters" | "setFilters" | "setCols" | "setSorters" | "sorters" | "inlineSorter" | "inlineFilter">;

type HeaderChildProps<T extends object> = {
    index: number;
    isLast: boolean;
    header: Col<T>;
    loading: boolean;
} & Pick<TableOperationProps<T>, "filters" | "setFilters" | "sorters" | "setSorters" | "inlineFilter" | "inlineSorter">;

const HeaderChild = <T extends object>(props: HeaderChildProps<T>) => {
    const tweaks = useTweaks();
    const translation = useTranslations();
    const ownFilters = props.filters.filter((x) => x.name === props.header.id);
    const hasFilters = ownFilters.length > 0;
    const defaultAllowSort = props.header.allowSort ?? tweaks.table.sorters ?? true;
    const defaultAllowFilter = props.header.allowFilter ?? tweaks.table.filters ?? true;
    const operators = useOperators();
    const FilterIcon = hasFilters ? MagnifyingGlassIcon : MagnifyingGlassMinusIcon;
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
            data-tableheader={props.header.id}
            whileDrag={{ cursor: "grabbing" }}
            className={css("typography", tableHeadStyles.slots.cell, props.header.thProps?.className)}
        >
            <span
                className={css(
                    tableHeadStyles.slots["cell-content"],
                    props.isLast ? `${tableHeadStyles.slots["cell-content"]}--last` : undefined,
                    props.index === 0 ? `${tableHeadStyles.slots["cell-content"]}--first` : undefined
                )}
            >
                <span className={tableHeadStyles.slots.actions}>
                    {props.inlineFilter && defaultAllowFilter ? (
                        <Dropdown
                            arrow
                            trigger={
                                <span>
                                    <span id={`${props.header.id}-filter-dropdown-button`} className={tableHeadStyles.slots["sr-label"]}>
                                        {translation.tableFilterDropdownTitleUnique} {label}
                                    </span>
                                    <FilterIcon
                                        aria-labelledby={`${props.header.id}-filter-dropdown-button`}
                                        className={tableHeadStyles.slots["filter-icon"]}
                                    />
                                </span>
                            }
                            title={
                                <span className={tableHeadStyles.slots["dropdown-title"]}>
                                    {translation.tableFilterDropdownTitleUnique}{" "}
                                    <span className={tableHeadStyles.slots["title-strong"]}>{label}</span>
                                </span>
                            }
                        >
                            <ul className={tableHeadStyles.slots["filter-list"]}>
                                {ownFilters.length === 0 ? null : (
                                    <Fragment>
                                        {ownFilters.map((filter) => (
                                            <li key={`thead-filter-${filter.id}`} className={tableHeadStyles.slots["filter-item"]}>
                                                <ColumnHeaderFilter onDelete={onDelete} filter={filter} set={props.setFilters} />
                                            </li>
                                        ))}
                                    </Fragment>
                                )}
                                <li>
                                    <button
                                        type="button"
                                        className={tableHeadStyles.slots["add-filter-button"]}
                                        onClick={() =>
                                            props.setFilters((prev) =>
                                                prev.concat(createFilterFromCol(props.header, operators.options, operators.operations))
                                            )
                                        }
                                    >
                                        <PlusIcon className={tableHeadStyles.slots["add-icon"]} /> {translation.tableFilterNewFilter}
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    ) : null}
                    <span className={tableHeadStyles.slots.label}>{props.header.thead}</span>
                    {props.inlineSorter && defaultAllowSort ? (
                        <SorterHead col={props.header} setSorters={props.setSorters} sorters={props.sorters} />
                    ) : null}
                </span>
            </span>
            {props.isLast ? null : (
                <motion.button
                    drag="x"
                    draggable
                    dragListener
                    dragMomentum
                    type="button"
                    animate={false}
                    dragElastic={0}
                    dragPropagation
                    initial={false}
                    dragSnapToOrigin
                    dragDirectionLock
                    data-type="resizer"
                    title={props.header.id}
                    dragConstraints={dragConstraints}
                    className={tableHeadStyles.slots.resizer}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => void e.currentTarget.focus()}
                    onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                            if (th.current === null) return;
                            th.current.setAttribute("data-resized", "true");
                            const v = th.current.getBoundingClientRect().width;
                            const move = e.shiftKey ? 50 : 10;
                            const delta = move * (e.key === "ArrowLeft" ? -1 : 1);
                            th.current.style.width = `${Math.abs(v + delta)}px`;
                        }
                    }}
                    onDoubleClick={() => {
                        if (th.current === null) return;
                        th.current.style.width = "auto";
                    }}
                    onDrag={(_: never, info: PanInfo) => {
                        if (th.current === null) return;
                        th.current.setAttribute("data-resized", "true");
                        const v = th.current.getBoundingClientRect().width;
                        const delta = info.delta.x;
                        th.current.style.width = `${Math.abs(v + delta)}px`;
                    }}
                />
            )}
        </Reorder.Item>
    );
};

export const TableHeader = <T extends object>(props: TableHeaderProps<T>) => {
    const [ref, onChange] = useWidthControl(props.setCols);
    return (
        <Reorder.Group layout as="tr" axis="x" drag="x" ref={ref} layoutRoot role="row" layoutScroll onReorder={onChange} values={props.headers}>
            <AnimatePresence>
                {props.headers.map((header, index) => (
                    <HeaderChild<T>
                        index={index}
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
};
