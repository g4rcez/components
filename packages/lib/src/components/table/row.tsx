import React, { Fragment, PropsWithChildren, useEffect, useRef, useState } from "react";
import { Is } from "sidekicker";
import { path } from "../../lib/fns";
import { Any } from "../../types";
import { SkeletonCell } from "../display/skeleton";
import { CellAsideElement, CellPropsElement, Col, ColMatrix } from "./table-lib";

type ItemContentContext = {
    cols: Col<Any>[];
    loading?: boolean;
    loadingMore?: boolean;
    Aside?: React.FC<CellAsideElement<any>>;
};

const RowAside = (props: PropsWithChildren) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLDivElement>(null);
    const [className, setClassName] = useState("opacity-0");
    const ariaHidden = className === "opacity-0";

    const onLeave = () => setClassName("opacity-0");

    const callback = () => {
        const child = ref.current;
        const parent = parentRef.current;
        if (child === null || parent === null) return;
        parent.style.left = `-${child.getBoundingClientRect().width + 4}px`;
    };

    const onEnter = () => setClassName("opacity-100");

    useEffect(() => {
        const child = ref.current;
        if (child === null || parent === null) return;
        callback();
        const observer = new IntersectionObserver((entries) => entries.forEach(callback), { root: document.documentElement });
        observer.observe(child);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={parentRef}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            data-component="cell-aside"
            // inert={ariaHidden ? true : undefined}
            tabIndex={ariaHidden ? -1 : undefined}
            className={`group-table-cell-aside absolute inset-0 top-0 flex h-full w-full min-w-8 max-w-20 items-stretch transition-opacity duration-300 ease-in-out ${className}`}
        >
            <div ref={ref} className="isolate block h-full w-auto">
                {props.children}
            </div>
        </div>
    );
};

export const Row = (index: number, row: any, context: ItemContentContext) => {
    const cols = context.cols;
    const loading = context.loading;
    return (
        <Fragment>
            {cols.map((col, colIndex) => {
                const matrix: ColMatrix = `${colIndex},${index}`;
                const value: any = path(row, col.id as any);
                const Component: React.FC<CellPropsElement<any, any>> = col.Element as any;
                const className = col.cellProps?.className || "";
                const exposeAside = colIndex === 0 && context.Aside && loading === false;
                const Aside = context.Aside!;
                return (
                    <td
                        {...col.cellProps}
                        role="cell"
                        data-matrix={matrix}
                        key={`accessor-${index}-${colIndex}`}
                        className={`group-table-cell py-2 sm:py-2 flex flex-col md:table-cell md:h-14 md:border-l md:border-table-border px-2 first:border-transparent ${className}`}
                    >
                        {exposeAside ? (
                            <RowAside>
                                <Aside col={col} row={row} rowIndex={index} />
                            </RowAside>
                        ) : null}
                        <span className="block md:hidden text-sm font-bold leading-tight">{col.thead}</span>
                        <span className="relative">
                            {loading ? (
                                SkeletonCell
                            ) : Component ? (
                                <Fragment>
                                    <Component row={row} matrix={matrix} col={col} rowIndex={index} value={value} />
                                </Fragment>
                            ) : (
                                <Fragment>{Is.nil(value) ? "" : value}</Fragment>
                            )}
                        </span>
                    </td>
                );
            })}
        </Fragment>
    );
};
