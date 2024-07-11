"use client";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, SortAscIcon, Trash2Icon } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { Dropdown } from "../floating/dropdown";
import { OptionProps, Select } from "../form/select";
import { uuid } from "../../lib/fns";
import { Label } from "../../types";
import { Col, TableConfiguration, TableOperationProps } from "./table-lib";

type Keyof<T extends {}> = keyof T extends infer R extends string ? R : never;

enum Order {
    Asc = "asc",
    Desc = "desc",
    Undefined = "undefined",
}

export type Sorter<T extends {}> = { value: Keyof<T>; type: Order; label: Label; id: string };

const createSorterFn =
    <T extends {}>(fields: Sorter<T>[]) =>
    (a: any, b: any) =>
        fields.reduce<number>((acc, x) => {
            const reverse = x.type === "desc" ? -1 : 1;
            const property = x.value;
            const p = a[property] > b[property] ? reverse : a[property] < b[property] ? -reverse : 0;
            return acc !== 0 ? acc : p;
        }, 0);

export const multiSort = <T extends {}>(array: T[], fields: Sorter<T>[]) => array.sort(createSorterFn(fields));

const orders = {
    asc: { label: "Ascending", value: Order.Asc },
    desc: { label: "Descending", value: Order.Desc },
} satisfies Omit<Record<Order, OptionProps>, Order.Undefined>;

const orderOptions: OptionProps[] = [orders.asc, orders.desc];

type Props<T extends {}> = TableConfiguration<
    T,
    {
        cols: Col<T>[];
        sorters: Sorter<T>[];
        set: React.Dispatch<React.SetStateAction<Sorter<T>[]>>;
    }
>;

const createSorter = <T extends {}>(col: Col<T>, order: Order = Order.Asc): Sorter<T> => ({
    id: uuid(),
    type: order,
    value: col.id as any,
    label: orders[Order.Asc].label,
});

export const Sort = <T extends {}>(props: Props<T>) => {
    const onAddSorter = () => {
        const col = props.cols[0];
        if (col) props.set((prev) => [...prev, createSorter(col)]);
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
                arrow={false}
                title="Order By"
                trigger={
                    <span className="flex items-center gap-1 proportional-nums text-foreground-description">
                        <SortAscIcon size={14} />
                        Order by {props.sorters.length === 0 ? "" : ` (${props.sorters.length})`}
                    </span>
                }
            >
                <ul className="mt-4 space-y-2">
                    {props.sorters.map((sorter) => {
                        return (
                            <li key={`sorter-select-${sorter.id}`} className="flex flex-nowrap gap-3">
                                <Select
                                    onChange={onSetSorter(sorter.id)}
                                    options={props.options}
                                    placeholder="Selecione um campo..."
                                    value={sorter.value as string}
                                />
                                <Select onChange={onSortOrderType(sorter.id)} value={sorter.type} options={orderOptions} placeholder="Operação..." />
                                <button className="mt-4" data-id={sorter.id} onClick={onDelete}>
                                    <Trash2Icon className="text-danger" size={14} />
                                </button>
                            </li>
                        );
                    })}
                    <li>
                        <button onClick={onAddSorter} className="text-primary flex items-center gap-1">
                            <PlusIcon size={14} /> Adicionar ordenação
                        </button>
                    </li>
                </ul>
            </Dropdown>
        </Fragment>
    );
};

type SorterHeadProps<T extends {}> = Pick<TableOperationProps<T>, "sorters" | "setSorters"> & { col: Col<T> };

export const SorterHead = <T extends {}>(props: SorterHeadProps<T>) => {
    const sorter = props.sorters.find((sort) => sort.id === props.col.id);
    const [status, setStatus] = useState(sorter ? sorter.type : Order.Undefined);

    const onClick = () => setStatus((prev) => (prev === Order.Undefined ? Order.Asc : prev === Order.Asc ? Order.Desc : Order.Undefined));

    useEffect(() => {
        props.setSorters((prev) => {
            if (status === Order.Undefined) return prev.filter((x) => (x.value as string) !== props.col.id);
            const findIndex = prev.findIndex((p) => (p.value as string) === props.col.id);
            if (findIndex === -1) return [...prev, createSorter(props.col, status)];
            prev[findIndex] = createSorter(props.col, status);
            return [...prev];
        });
    }, [status, props.col]);

    return (
        <button className="isolate flex items-center" onClick={onClick}>
            {status === Order.Asc ? <ChevronDownIcon size={14} /> : null}
            {status === Order.Desc ? <ChevronUpIcon size={14} /> : null}
            {status === Order.Undefined ? <SortAscIcon size={14} /> : null}
        </button>
    );
};
