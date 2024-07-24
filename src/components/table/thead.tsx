import { AnimatePresence, Reorder, TargetAndTransition } from "framer-motion";
import { PlusIcon, SearchIcon } from "lucide-react";
import React from "react";
import { Dropdown } from "../floating/dropdown";
import { ColumnHeaderFilter, createFilterFromCol } from "./filter";
import { SorterHead } from "./sort";
import { Col, getLabel, TableOperationProps } from "./table-lib";

type TableHeaderProps<T extends {}> = {
    headers: Col<T>[];
} & Pick<TableOperationProps<T>, "filters" | "setFilters" | "setCols" | "setSorters" | "sorters">;

const targetTransitionAnimate: TargetAndTransition = { opacity: 1 };

const whileDrag: TargetAndTransition = { opacity: 0.75, backgroundColor: "var(--table-border)" };

const exit: TargetAndTransition = { opacity: 0, transition: { duration: 0.4, type: "spring" } };

type HeaderChildProps<T extends {}> = {
    header: Col<T>;
} & Pick<TableOperationProps<T>, "filters" | "setFilters" | "sorters" | "setSorters">;

const HeaderChild = <T extends {}>(props: HeaderChildProps<T>) => {
    const ownFilters = props.filters.filter((x) => x.name === props.header.id);
    const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.dataset.id || "";
        return props.setFilters((prev) => prev.filter((x) => x.id !== id));
    };
    return (
        <Reorder.Item
            {...(props.header.thProps as {})}
            as="th"
            exit={exit}
            initial={false}
            dragSnapToOrigin
            dragDirectionLock
            value={props.header}
            whileDrag={whileDrag}
            animate={targetTransitionAnimate}
            className={`hidden font-medium text-secondary px-2 py-4 first:table-cell md:table-cell ${props.header.thProps?.className ?? ""}`}
        >
            <span className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                    <Dropdown title={`Filter by ${getLabel(props.header)}`} arrow trigger={<SearchIcon size={14} />}>
                        {(ownFilters.length === 0) === null ? null : (
                            <ul className="font-medium">
                                {ownFilters.map((filter) => (
                                    <li key={`thead-filter-${filter.id}`} className="my-1">
                                        <ColumnHeaderFilter onDelete={onDelete} filter={filter} set={props.setFilters} />
                                    </li>
                                ))}
                                <li>
                                    <button
                                        onClick={() => props.setFilters((prev) => prev.concat(createFilterFromCol(props.header)))}
                                        className="flex items-center"
                                    >
                                        <PlusIcon size={14} /> Add
                                    </button>
                                </li>
                            </ul>
                        )}
                    </Dropdown>
                    <span className="pointer-events-auto text-balance text-base">{props.header.thead}</span>
                    <SorterHead col={props.header} setSorters={props.setSorters} sorters={props.sorters} />
                </span>
            </span>
        </Reorder.Item>
    );
};

export const TableHeader = <T extends {}>(props: TableHeaderProps<T>) => (
    <Reorder.Group
        as="tr"
        axis="x"
        drag
        layout
        layoutRoot
        layoutScroll
        initial={false}
        values={props.headers}
        onReorder={props.setCols}
        className="bg-table-background border-none text-lg"
    >
        <AnimatePresence>
            {props.headers.map((header) => (
                <HeaderChild<T>
                    key={`header-child-item-${header.id as string}`}
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
