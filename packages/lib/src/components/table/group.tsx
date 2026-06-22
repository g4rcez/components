"use client";
import { LayoutGroup, Reorder, useDragControls, useMotionValue } from "motion/react";
import Linq from "linq-arrays";
import { DotsSixVerticalIcon, TrashIcon, StackMinusIcon } from "@phosphor-icons/react";
import type React from "react";
import { Fragment, useState } from "react";
import { keys } from "sidekicker";
import { useTranslations } from "../../hooks/use-translations";
import { uuid } from "../../lib/fns";
import { Button } from "../core/button/button";
import { Dropdown } from "../floating/dropdown/dropdown";
import { Select } from "../form/select/select";
import { tableGroupStyles } from "./group.styles";
import { type Col, createOptionCols, type TableConfiguration } from "./table-lib";

export type GroupItem<T extends object> = Col<T> & {
    rows: T[];
    index: number;
    groupId: string;
    groupName: string;
    groupKey: keyof T;
};

type Props<T extends object> = TableConfiguration<
    T,
    {
        rows: T[];
        groups: GroupItem<T>[];
        setGroups: React.Dispatch<React.SetStateAction<GroupItem<T>[]>>;
    }
>;

const Item = <T extends object>({ item, onPointerDown }: { item: GroupItem<T>; onPointerDown: (e: React.PointerEvent) => void }) => {
    const y = useMotionValue(0);
    return (
        <Reorder.Item
            onPointerDown={onPointerDown}
            id={item.groupId}
            className={tableGroupStyles.slots["draggable-item"]}
            key={item.groupId}
            value={item}
            style={{ y }}
        >
            <button type="button" className={tableGroupStyles.slots["drag-handle"]}>
                <DotsSixVerticalIcon className={tableGroupStyles.slots["drag-icon"]} />
            </button>
            <span>{item.groupName}</span>
        </Reorder.Item>
    );
};

export const Group = <T extends object>(props: Props<T>) => {
    const translations = useTranslations();
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
                return {
                    ...col,
                    groupId: uuid(),
                    groupKey: key,
                    index,
                    rows,
                    groupName: groupName as string,
                };
            })
        );
    };

    const onDelete = () => props.setGroups([]);
    const orderSectionClassName = tableGroupStyles.slots["order-section"];
    const orderTitleClassName = tableGroupStyles.slots["order-title"];
    const orderListClassName = tableGroupStyles.slots["order-list"];

    return (
        <Fragment>
            <Dropdown
                arrow={false}
                title={translations.tableGroupLabel}
                trigger={
                    <span className={tableGroupStyles.slots["trigger-label"]}>
                        <StackMinusIcon className={tableGroupStyles.slots["trigger-icon"]} />
                        {translations.tableGroupLabelWithCount}
                        {props.groups.length > 0 ? ` - ${group}(${props.groups.length})` : ""}
                    </span>
                }
            >
                <div className={tableGroupStyles.slots.controls}>
                    <Select
                        value={group}
                        title={translations.tableGroupTypeTitle}
                        onChange={onChange}
                        options={options}
                        placeholder={translations.tableGroupPlaceholder}
                    />
                    <Button className={tableGroupStyles.slots["clear-button"]} onClick={onDelete} theme="raw" data-id={group}>
                        <span className={tableGroupStyles.slots["danger-icon"]}>
                            <TrashIcon aria-hidden="true" className={tableGroupStyles.slots["delete-icon"]} />
                        </span>
                    </Button>
                </div>
                {props.groups.length > 0 ? (
                    <section className={orderSectionClassName}>
                        <header>
                            <h2 className={orderTitleClassName}>{translations.tableGroupOrderTitle}</h2>
                        </header>
                        <LayoutGroup>
                            <Reorder.Group
                                axis="y"
                                className={orderListClassName}
                                drag
                                dragControls={controls}
                                dragListener={false}
                                layoutScroll
                                onReorder={props.setGroups}
                                values={props.groups}
                            >
                                {props.groups.map((item) => (
                                    <Item
                                        key={item.groupId}
                                        item={item}
                                        onPointerDown={(e) => {
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
