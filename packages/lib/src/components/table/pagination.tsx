import { Fragment, useId, useMemo } from "react";
import { useTranslations } from "../../hooks/use-translations";
import { Polymorph } from "../core/polymorph";
import { TablePagination } from "./table-lib";

function createPaginationItems(current: number, max: number) {
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
    const pageNavigation = useMemo(() => createPaginationItems(pagination.current, pagination.pages), [pagination.current, pagination.pages]);
    const hasNext = pagination.current < pagination.pages;

    return (
        <footer className="flex flex-wrap items-center justify-center gap-4 px-1 py-4 lg:flex-nowrap lg:justify-between">
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
                                    className="cursor-pointer bg-transparent"
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
                <ul className="flex items-center gap-2">
                    {pagination.current > 1 ? (
                        <li>
                            <Polymorph as={pagination.asLink || ("button" as any)} href="previous" className="">
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
                                            as={pagination.asLink || ("button" as any)}
                                            className={`cursor-pointer border-b-2 px-3 py-1 proportional-nums transition-colors hover:border-primary-subtle hover:text-primary-subtle ${x === pagination.current ? "border-primary text-primary" : "border-transparent"}`}
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
                            <Polymorph as={pagination.asLink || ("button" as any)} href="next" className="">
                                {translation.tablePaginationNext}
                            </Polymorph>
                        </li>
                    ) : null}
                </ul>
            </nav>
        </footer>
    );
};
