"use client";
import { ArrowDown01Icon, ArrowUp01Icon, ArrowUpDownIcon, PlusIcon, Trash2Icon } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslations } from "../../hooks/use-translations";
import { uuid } from "../../lib/fns";
import { Any, Label } from "../../types";
import { Dropdown } from "../floating/dropdown";
import { OptionProps, Select } from "../form/select";
import { Col, getLabel, TableConfiguration, TableOperationProps } from "./table-lib";

type Keyof<T extends Any> = keyof T extends infer R extends string ? R : never;

enum Order {
    Asc = "asc",
    Desc = "desc",
    Undefined = "undefined",
}

export type Sorter<T extends Any> = { value: Keyof<T>; type: Order; label: Label; id: string };

const createSorterFn =
    <T extends Any>(fields: Sorter<T>[]) =>
    (a: any, b: any) =>
        fields.reduce<number>((acc, x) => {
            const reverse = x.type === "desc" ? -1 : 1;
            const property = x.value;
            const p = a[property] > b[property] ? reverse : a[property] < b[property] ? -reverse : 0;
            return acc !== 0 ? acc : p;
        }, 0);

export const multiSort = <T extends Any>(array: T[], fields: Sorter<T>[]) => array.toSorted(createSorterFn(fields));

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
    value: col.id as any,
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
                    <span className="flex items-center gap-1 proportional-nums">
                        <ArrowUpDownIcon size={14} />
                        {translation.tableSortOrderByLabel} {props.sorters.length === 0 ? "" : ` (${props.sorters.length})`}
                    </span>
                }
            >
                <ul className="mt-4 space-y-2">
                    {props.sorters.map((sorter) => {
                        return (
                            <li key={`sorter-select-${sorter.id}`} className="flex flex-nowrap gap-3">
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
                                <button className="mt-4" data-id={sorter.id} onClick={onDelete}>
                                    <Trash2Icon className="text-danger" size={14} />
                                </button>
                            </li>
                        );
                    })}
                    <li>
                        <button type="button" onClick={onAddSorter} className="text-primary flex items-center gap-1">
                            <PlusIcon size={14} /> {translation.tableSortAddButton}
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

    const onClick = () => setStatus((prev) => (prev === Order.Undefined ? Order.Asc : prev === Order.Asc ? Order.Desc : Order.Undefined));

    useEffect(() => {
        props.setSorters((prev) => {
            if (status === Order.Undefined) return prev.filter((x) => x.value !== props.col.id);
            const findIndex = prev.findIndex((p) => (p.value as string) === props.col.id);
            const sorter = createSorter(props.col, status, status);
            if (findIndex === -1) return [...prev, sorter];
            prev[findIndex] = sorter;
            return [...prev];
        });
    }, [status, props.col]);

    const labelId = `${props.col.id}-sorter-id`;

    const label = getLabel(props.col);

    return (
        <button aria-labelledby={labelId} className="isolate flex items-center" onClick={onClick} type="button">
            <span id={labelId} className="sr-only">
                {translations.tableSortDropdownTitle} {label}
            </span>
            {status === Order.Asc ? <ArrowUp01Icon size={14} /> : null}
            {status === Order.Desc ? <ArrowDown01Icon size={14} /> : null}
            {status === Order.Undefined ? <ArrowUpDownIcon size={14} /> : null}
        </button>
    );
};
