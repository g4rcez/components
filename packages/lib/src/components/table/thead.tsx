import { AnimatePresence, Reorder, TargetAndTransition } from "framer-motion";
import { Order } from "linq-arrays";
import { PlusIcon, SearchCheckIcon, SearchIcon, SearchXIcon, ZoomInIcon } from "lucide-react";
import React from "react";
import { useTranslations } from "../../hooks/use-translate-context";
import { Dropdown } from "../floating/dropdown";
import { ColumnHeaderFilter, createFilterFromCol, useOperators } from "./filter";
import { SorterHead } from "./sort";
import { Col, getLabel, TableOperationProps } from "./table-lib";

type TableHeaderProps<T extends {}> = {
    loading: boolean;
    headers: Col<T>[];
} & Pick<TableOperationProps<T>, "filters" | "setFilters" | "setCols" | "setSorters" | "sorters" | "inlineSorter" | "inlineFilter">;

const targetTransitionAnimate: TargetAndTransition = { opacity: 1 };

const whileDrag: TargetAndTransition = { opacity: 0.75, backgroundColor: "var(--table-border)" };

const exit: TargetAndTransition = { opacity: 0, transition: { duration: 0.4, type: "spring" } };

type HeaderChildProps<T extends {}> = {
    header: Col<T>;
    loading: boolean;
} & Pick<TableOperationProps<T>, "filters" | "setFilters" | "sorters" | "setSorters" | "inlineFilter" | "inlineSorter">;

const HeaderChild = <T extends {}>(props: HeaderChildProps<T>) => {
    const translation = useTranslations();
    const ownFilters = props.filters.filter((x) => x.name === props.header.id);
    const hasFilters = ownFilters.length > 0;
    const FilterIcon = hasFilters ? SearchCheckIcon : SearchXIcon;
    const { operationOptions, operations } = useOperators();
    const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.dataset.id || "";
        return props.setFilters((prev) => prev.filter((x) => x.id !== id));
    };

    const ownSorter = props.sorters.find((x) => props.header.id === x.value);

    const ariaSort = !ownSorter?.type ? "none" : ownSorter.type === Order.Asc ? "ascending" : "descending";

    const label = getLabel(props.header);

    return (
        <Reorder.Item
            {...(props.header.thProps as {})}
            as="th"
            layout
            exit={exit}
            initial={false}
            dragSnapToOrigin
            dragDirectionLock
            role="columnheader"
            value={props.header}
            whileDrag={whileDrag}
            aria-sort={ariaSort}
            aria-busy={props.loading}
            animate={targetTransitionAnimate}
            className={`hidden px-2 py-4 font-medium first:table-cell md:table-cell ${props.header.thProps?.className ?? ""}`}
        >
            <span className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                    <Dropdown
                        arrow
                        trigger={
                            <span>
                                <span id={`${props.header.id}-filter-dropdown-button`} className="sr-only">
                                    {translation.tableFilterDropdownTitleUnique} {label}
                                </span>
                                {props.inlineFilter ? <FilterIcon aria-labelledby={`${props.header.id}-filter-dropdown-button`} size={14} /> : null}
                            </span>
                        }
                        title={
                            <span className="font-medium text-lg">
                                {translation.tableFilterDropdownTitleUnique} <span className="text-primary">{label}</span>
                            </span>
                        }
                    >
                        {(ownFilters.length === 0) === null ? null : (
                            <ul className="font-medium">
                                {ownFilters.map((filter) => (
                                    <li key={`thead-filter-${filter.id}`} className="my-1">
                                        <ColumnHeaderFilter onDelete={onDelete} filter={filter} set={props.setFilters} />
                                    </li>
                                ))}
                                <li>
                                    <button
                                        onClick={() =>
                                            props.setFilters((prev) => prev.concat(createFilterFromCol(props.header, operationOptions, operations)))
                                        }
                                        type="button"
                                        className="flex items-center gap-1 text-primary"
                                    >
                                        <PlusIcon size={14} /> {translation.tableFilterNewFilter}
                                    </button>
                                </li>
                            </ul>
                        )}
                    </Dropdown>
                    <span className="pointer-events-auto text-balance text-base">{props.header.thead}</span>
                    {props.inlineSorter ? <SorterHead col={props.header} setSorters={props.setSorters} sorters={props.sorters} /> : null}
                </span>
            </span>
        </Reorder.Item>
    );
};

export const TableHeader = <T extends {}>(props: TableHeaderProps<T>) => (
    <Reorder.Group
        as="tr"
        role="row"
        axis="x"
        drag
        layout
        layoutRoot
        layoutScroll
        initial={false}
        values={props.headers}
        onReorder={props.setCols}
        className="border-none bg-table-background text-lg"
    >
        <AnimatePresence>
            {props.headers.map((header) => (
                <HeaderChild<T>
                    inlineFilter={props.inlineFilter}
                    inlineSorter={props.inlineSorter}
                    key={`header-child-item-${header.id as string}`}
                    loading={props.loading}
                    setFilters={props.setFilters}
                    filters={props.filters}
                    setSorters={props.setSorters}
                    sorters={props.sorters}
                    header={header}
                />
            ))}
        </AnimatePresence>
    </Reorder.Group>
);
