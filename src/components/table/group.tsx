"use client";
import { LayoutGroup, Reorder, useDragControls, useMotionValue } from "framer-motion";
import Linq from "linq-arrays";
import { GripVerticalIcon, GroupIcon, Trash2Icon } from "lucide-react";
import React, { Fragment, useState } from "react";
import { keys } from "sidekicker";
import { Button } from "~/components/core/button";
import { Dropdown } from "~/components/floating/dropdown";
import { Select } from "~/components/form/select";
import { uuid } from "~/lib/fns";
import { Col, createOptionCols, TableConfiguration } from "./table-lib";

export type GroupItem<T extends {}> = Col<T> & {
    rows: T[];
    index: number;
    groupId: string;
    groupName: string;
    groupKey: keyof T;
};

type Props<T extends {}> = TableConfiguration<
    T,
    {
        rows: T[];
        groups: GroupItem<T>[];
        setGroups: React.Dispatch<React.SetStateAction<GroupItem<T>[]>>;
    }
>;

const Item = ({ item, onPointerDown }: { item: GroupItem<any>; onPointerDown: any }) => {
    const y = useMotionValue(0);
    return (
        <Reorder.Item
            onPointerDown={onPointerDown}
            id={item.groupId}
            className="flex flex-row items-center gap-2"
            key={item.groupId}
            value={item}
            style={{ y }}
        >
            <button className="cursor-grab">
                <GripVerticalIcon size={14} />
            </button>
            <span>{item.groupName}</span>
        </Reorder.Item>
    );
};

export const Group = <T extends {}>(props: Props<T>) => {
    const options = createOptionCols(props.cols);
    const controls = useDragControls();
    const [group, setGroup] = useState((props.groups[0]?.thead as string) || "");

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const select = e.target;
        const key = select.value as keyof T;
        const index = select.options.selectedIndex;
        const label = select.options.item(index)?.label || "";
        setGroup(label);
        const groupBy = new Linq(props.rows).GroupBy(key);
        const col = props.cols.find((x) => x.id === key)!;
        props.setGroups(
            keys(groupBy).map((groupName, index): GroupItem<T> => {
                const rows = groupBy[groupName];
                return { ...col, groupId: uuid(), groupKey: key, index, rows, groupName: groupName as string };
            })
        );
    };

    const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => props.setGroups([]);

    return (
        <Fragment>
            <Dropdown
                arrow={false}
                title="Groups"
                trigger={
                    <span className="flex items-center gap-1 proportional-nums">
                        <GroupIcon size={14} />
                        Groups{props.groups.length > 0 ? ` - ${group}(${props.groups.length})` : ""}
                    </span>
                }
            >
                <div className="flex flex-nowrap items-center">
                    <Select value={group} title="Tipo de agrupamento" onChange={onChange} options={options} placeholder="Agrupar por..." />
                    <Button className="mt-4" onClick={onDelete} theme="raw" data-id={group}>
                        <Trash2Icon size={16} className="text-danger" />
                    </Button>
                </div>
                {props.groups.length > 0 ? (
                    <section className="my-4">
                        <header>
                            <h2 className="text-xl font-medium">Ordenar grupos</h2>
                        </header>
                        <LayoutGroup>
                            <Reorder.Group
                                axis="y"
                                className="relative space-y-2"
                                dragListener={false}
                                dragControls={controls}
                                drag
                                layoutScroll
                                onReorder={props.setGroups}
                                values={props.groups}
                            >
                                {props.groups.map((item) => (
                                    <Item
                                        key={item.groupId}
                                        item={item as any}
                                        onPointerDown={(e: any) => {
                                            controls.start(e);
                                            props.setGroups([...props.groups]);
                                        }}
                                    />
                                ))}
                            </Reorder.Group>
                        </LayoutGroup>
                    </section>
                ) : null}
            </Dropdown>
        </Fragment>
    );
};
