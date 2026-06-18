"use client";
import { SortAscendingIcon, SortDescendingIcon, CaretUpDownIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import type React from "react";
import { Fragment, useState } from "react";
import { useTranslations } from "../../hooks/use-translations";
import { uuid } from "../../lib/fns";
import type { Any, Label } from "../../types";
import { Dropdown } from "../floating/dropdown";
import { type OptionProps, Select } from "../form/select";
import { type Col, getLabel, type TableConfiguration, type TableOperationProps } from "./table-lib";

type Keyof<T extends Any> = keyof T extends infer R extends string ? R : never;

enum Order {
    Asc = "asc",
    Desc = "desc",
    Undefined = "undefined",
}

export type Sorter<T extends Any> = { value: Keyof<T>; type: Order; label: Label; id: string };

const createSorterFn =
    <T extends Any>(fields: Sorter<T>[]) =>
    (a: T, b: T) =>
        fields.reduce<number>((acc, x) => {
            const reverse = x.type === "desc" ? -1 : 1;
            const property = x.value;
            const p = a[property] > b[property] ? reverse : a[property] < b[property] ? -reverse : 0;
            return acc !== 0 ? acc : p;
        }, 0);

export const multiSort = <T extends Any>(array: T[], fields: Sorter<T>[]) => {
    array.sort(createSorterFn(fields));
    return array;
};

type Props<T extends Any> = TableConfiguration<
    T,
    {
        cols: Col<T>[];
        sorters: Sorter<T>[];
        set: React.Dispatch<React.SetStateAction<Sorter<T>[]>>;
    }
>;

const createSorter = <T extends Any>(col: Col<T>, label: string, order: Order): Sorter<T> => ({
    label,
    id: uuid(),
    type: order,
    value: col.id as Keyof<T>,
});

export const Sort = <T extends Any>(props: Props<T>) => {
    const translation = useTranslations();

    const orders = {
        asc: { label: translation.tableSortAsc, value: Order.Asc },
        desc: { label: translation.tableSortDesc, value: Order.Desc },
    } satisfies Omit<Record<Order, OptionProps>, Order.Undefined>;

    const orderOptions: OptionProps[] = [orders.asc, orders.desc];

    const onAddSorter = () => {
        const col = props.cols[0];
        if (col) props.set((prev) => [...prev, createSorter(col, orders.asc.label, orders.asc.value)]);
    };

    const onSetSorter = (id: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        props.set((prev) => prev.map((x) => (x.id === id ? { ...x, value: value as Keyof<T> } : x)));
    };

    const onSortOrderType = (id: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value;
        props.set((prev) => prev.map((x) => (x.id === id ? { ...x, type: type as Order } : x)));
    };

    const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.dataset.id || "";
        props.set((prev) => prev.filter((x) => x.id !== id));
    };

    return (
        <Fragment>
            <Dropdown
                title={translation.tableSortDropdownTitle}
                trigger={
                    <span className="__table-sort__tw-1 __table-sort__tw-final-1">
                        <CaretUpDownIcon className="__table-sort__trigger-icon" />
                        {translation.tableSortOrderByLabel} {props.sorters.length === 0 ? "" : ` (${props.sorters.length})`}
                    </span>
                }
            >
                <ul className="__table-sort__tw-2">
                    {props.sorters.map((sorter) => {
                        return (
                            <li key={`sorter-select-${sorter.id}`} className="__table-sort__tw-3 __table-sort__tw-extra-1">
                                <Select
                                    options={props.options}
                                    value={sorter.value as string}
                                    onChange={onSetSorter(sorter.id)}
                                    title={translation.tableSortOrderInputTitle}
                                    placeholder={translation.tableSortOrderInputPlaceholder}
                                />
                                <Select
                                    onChange={onSortOrderType(sorter.id)}
                                    value={sorter.type}
                                    options={orderOptions}
                                    title={translation.tableSortTypeInputTitle}
                                    placeholder={translation.tableSortTypeInputPlaceholder}
                                />
                                <button className="__table-sort__tw-4" data-id={sorter.id} onClick={onDelete}>
                                    <span className="__table-sort__tw-5">
                                        <TrashIcon aria-hidden="true" className="__table-sort__delete-icon" />
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                    <li>
                        <button type="button" onClick={onAddSorter} className="__table-sort__tw-6">
                            <PlusIcon className="__table-sort__add-icon" /> {translation.tableSortAddButton}
                        </button>
                    </li>
                </ul>
            </Dropdown>
        </Fragment>
    );
};

type SorterHeadProps<T extends Any> = Pick<TableOperationProps<T>, "sorters" | "setSorters"> & { col: Col<T> };

export const SorterHead = <T extends Any>(props: SorterHeadProps<T>) => {
    const translations = useTranslations();
    const [status, setStatus] = useState(() => {
        const sorter = props.sorters.find((sort) => sort.value === props.col.id);
        return sorter ? sorter.type : Order.Undefined;
    });

    const onClick = () => {
        const next = status === Order.Undefined ? Order.Asc : status === Order.Asc ? Order.Desc : Order.Undefined;
        setStatus(next);
        props.setSorters((prev) => {
            if (next === Order.Undefined) return prev.filter((x) => x.value !== props.col.id);
            const findIndex = prev.findIndex((p) => (p.value as string) === props.col.id);
            const sorter = createSorter(props.col, next, next);
            if (findIndex === -1) return [...prev, sorter];
            prev[findIndex] = sorter;
            return [...prev];
        });
    };

    const labelId = `${props.col.id}-sorter-id`;

    const label = getLabel(props.col);

    return (
        <button aria-labelledby={labelId} className="__table-sort__tw-7" onClick={onClick} type="button">
            <span id={labelId} className="__table-sort__tw-8">
                {translations.tableSortDropdownTitle} {label}
            </span>
            {status === Order.Asc ? <SortAscendingIcon className="__table-sort__head-icon" /> : null}
            {status === Order.Desc ? <SortDescendingIcon className="__table-sort__head-icon" /> : null}
            {status === Order.Undefined ? <CaretUpDownIcon className="__table-sort__head-icon" /> : null}
        </button>
    );
};
