import type React from "react";
import { Fragment, useId, useMemo } from "react";
import { useTranslations } from "../../hooks/use-translations";
import { css } from "../../lib/dom";
import { Polymorph } from "../core/polymorph/polymorph";
import { tablePaginationStyles } from "./pagination.styles";
import type { TablePagination } from "./table-lib";

export function createPaginationItems(current: number, max: number) {
    if (!current || !max) return [];
    const items: Array<string | number> = [1];
    if (current === 1 && max === 1) return items;
    if (current > 4) items.push("-");
    const r = 2;
    const r1 = current - r;
    const r2 = current + r;
    for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++) items.push(i);
    const p2 = max - 2;
    if (r2 + 1 !== p2) {
        if (r2 + 1 < max) items.push("_");
    }
    if (r2 < max) {
        items.push(max - 2);
        items.push(max - 1);
        items.push(max);
    }
    return Array.from(new Set(items));
}

export const Pagination = (pagination: TablePagination) => {
    const id = useId();
    const translation = useTranslations();
    const pageNavigation = useMemo(() => createPaginationItems(pagination.current, pagination.pages), [pagination]);
    const hasNext = pagination.current < pagination.pages;
    const Link: React.ElementType = pagination.asLink ?? "button";
    const sizeSelectClassName = tablePaginationStyles.slots["size-select"];

    return (
        <footer className={tablePaginationStyles.slots.root}>
            <p>
                <translation.tablePaginationFooter
                    {...pagination}
                    sizes={pagination.sizes}
                    select={
                        pagination.onChangeSize && Array.isArray(pagination.sizes) ? (
                            <Fragment>
                                <label htmlFor={id}>{translation.tablePaginationSelectLabel}</label>
                                <select
                                    id={id}
                                    value={pagination.size}
                                    className={sizeSelectClassName}
                                    onChange={(e) => {
                                        pagination.onChangeSize?.(Number(e.target.value));
                                    }}
                                >
                                    {pagination.sizes.map((value) => (
                                        <option key={`pagination-opt-${value}`} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>{" "}
                            </Fragment>
                        ) : null
                    }
                />
            </p>
            <nav>
                <ul className={tablePaginationStyles.slots.items}>
                    {pagination.current > 1 ? (
                        <li>
                            <Polymorph as={Link} href="previous" className="">
                                {translation.tablePaginationPrevious}
                            </Polymorph>
                        </li>
                    ) : null}
                    {pageNavigation.map((x) => {
                        if (x === null) return null;
                        return (
                            <Fragment key={`pagination-${x}`}>
                                {typeof x === "string" ? (
                                    <li>...</li>
                                ) : (
                                    <li>
                                        <Polymorph
                                            href={x}
                                            as={Link}
                                            className={css(
                                                tablePaginationStyles.slots["page-link"],
                                                `${tablePaginationStyles.slots["page-link"]}--${x === pagination.current ? "active" : "inactive"}`
                                            )}
                                        >
                                            {x}
                                        </Polymorph>
                                    </li>
                                )}
                            </Fragment>
                        );
                    })}
                    {hasNext ? (
                        <li>
                            <Polymorph as={Link} href="next" className="">
                                {translation.tablePaginationNext}
                            </Polymorph>
                        </li>
                    ) : null}
                </ul>
            </nav>
        </footer>
    );
};
