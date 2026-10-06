import type React from "react";
import { Fragment, type PropsWithChildren, useRef, useState } from "react";
import { Is } from "sidekicker";
import { css } from "../../lib/dom";
import { path } from "../../lib/fns";
import { SkeletonCell } from "../display/skeleton/skeleton";
import { tableRowStyles } from "./row.styles";
import { getLabel, type CellAsideElement, type CellPropsElement, type Col, type ColMatrix } from "./table-lib";

type ItemContentContext<T extends Record<string, unknown>> = {
    cols: Col<T>[];
    loading?: boolean;
    loadingMore?: boolean;
    Aside?: React.FC<CellAsideElement<T>>;
};

const RowAside = (props: PropsWithChildren) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLDivElement>(null);
    const hiddenClassName = `${tableRowStyles.slots.aside}-hidden`;
    const visibleClassName = `${tableRowStyles.slots.aside}-visible`;
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const className = isHovered || isFocused ? visibleClassName : hiddenClassName;

    const reveal = () => {
        const child = ref.current;
        const parent = parentRef.current;
        if (child !== null && parent !== null) {
            parent.style.left = `-${child.getBoundingClientRect().width + 4}px`;
        }
    };

    const onFocus = () => {
        reveal();
        setIsFocused(true);
    };

    const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsFocused(false);
        }
    };

    return (
        <div
            ref={parentRef}
            onMouseEnter={() => {
                reveal();
                setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={onFocus}
            onBlur={onBlur}
            data-component="cell-aside"
            className={css(tableRowStyles.slots.aside, tableRowStyles.slots["aside-overlay"], className)}
        >
            <div ref={ref} className={tableRowStyles.slots["aside-content"]}>
                {props.children}
            </div>
        </div>
    );
};

export const Row = <T extends Record<string, unknown>>(index: number, row: T, context: ItemContentContext<T>) => {
    const cols = context.cols;
    const loading = context.loading;
    return (
        <Fragment>
            {cols.map((col, colIndex) => {
                const matrix: ColMatrix = `${colIndex},${index}`;
                const value = path(row, col.id);
                const Component = col.Element as React.FC<CellPropsElement<T, typeof col.id>> | undefined;
                const className = col.cellProps?.className || "";
                const exposeAside = colIndex === 0 && context.Aside && loading === false;
                const Aside = context.Aside!;
                return (
                    <td
                        {...col.cellProps}
                        role="cell"
                        data-matrix={matrix}
                        key={`accessor-${index}-${colIndex}`}
                        className={css(
                            "typography",
                            tableRowStyles.slots.cell,
                            `${tableRowStyles.base}__border`,
                            tableRowStyles.slots["cell-content"],
                            className
                        )}
                    >
                        {exposeAside ? (
                            <RowAside>
                                <Aside col={col} row={row} rowIndex={index} />
                            </RowAside>
                        ) : null}
                        <span className={tableRowStyles.slots["cell-label"]}>{getLabel(col)}</span>
                        <span className={tableRowStyles.slots["cell-frame"]}>
                            {loading ? (
                                SkeletonCell
                            ) : Component ? (
                                <Fragment>
                                    <Component
                                        row={row}
                                        matrix={matrix}
                                        col={col}
                                        rowIndex={index}
                                        value={value as CellPropsElement<T, typeof col.id>["value"]}
                                    />
                                </Fragment>
                            ) : (
                                <Fragment>{Is.nil(value) ? "" : (value as React.ReactNode)}</Fragment>
                            )}
                        </span>
                    </td>
                );
            })}
        </Fragment>
    );
};
