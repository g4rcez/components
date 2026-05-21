import React, { Fragment, PropsWithChildren, useRef, useState } from "react";
import { Is } from "sidekicker";
import { path } from "../../lib/fns";
import { SkeletonCell } from "../display/skeleton";
import { CellAsideElement, CellPropsElement, Col, ColMatrix } from "./table-lib";

type ItemContentContext<T extends Record<string, unknown>> = {
    cols: Col<T>[];
    loading?: boolean;
    loadingMore?: boolean;
    Aside?: React.FC<CellAsideElement<T>>;
};

const RowAside = (props: PropsWithChildren) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLDivElement>(null);
    const [className, setClassName] = useState("opacity-0");
    const ariaHidden = className === "opacity-0";

    const onLeave = () => setClassName("opacity-0");

    const onEnter = () => {
        const child = ref.current;
        const parent = parentRef.current;
        if (child !== null && parent !== null) {
            parent.style.left = `-${child.getBoundingClientRect().width + 4}px`;
        }
        setClassName("opacity-100");
    };

    return (
        <div
            ref={parentRef}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            data-component="cell-aside"
            inert={ariaHidden ? true : undefined}
            tabIndex={ariaHidden ? -1 : undefined}
            className={`group-table-cell-aside absolute inset-0 top-0 flex h-full w-full items-stretch transition-opacity duration-300 ease-in-out ${className}`}
        >
            <div ref={ref} className="isolate block">
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
                        className={`typography group-table-cell flex border-collapse flex-col whitespace-pre-wrap border border-y border-b border-table-border p-table-cell-padding md:table-cell md:border-b-0 md:border-r md:border-l-transparent md:last:border-r-transparent ${className}`}
                    >
                        {exposeAside ? (
                            <RowAside>
                                <Aside col={col} row={row} rowIndex={index} />
                            </RowAside>
                        ) : null}
                        <span className="text-typography-sm block font-bold leading-tight md:hidden">{col.thead}</span>
                        <span className="relative">
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
