import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useId, useMemo } from "react";
import { useTranslations } from "../../hooks/use-translate-context";
function createPaginationItems(current, max) {
    if (!current || !max)
        return [];
    const items = [1];
    if (current === 1 && max === 1)
        return items;
    if (current > 4)
        items.push("-");
    let r = 2;
    const r1 = current - r;
    const r2 = current + r;
    for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++)
        items.push(i);
    const p2 = max - 2;
    if (r2 + 1 !== p2) {
        if (r2 + 1 < max)
            items.push("_");
    }
    if (r2 < max) {
        items.push(max - 2);
        items.push(max - 1);
        items.push(max);
    }
    return Array.from(new Set(items));
}
export const Pagination = (pagination) => {
    const id = useId();
    const translation = useTranslations();
    const Render = pagination.asLink || "button";
    const pageNavigation = useMemo(() => createPaginationItems(pagination.current, pagination.pages), [pagination.current, pagination.pages]);
    const hasNext = pagination.current < pagination.pages;
    return (_jsxs("footer", { className: "flex px-1 py-4 items-center justify-center gap-4 lg:justify-between flex-wrap lg:flex-nowrap", children: [_jsx("p", { children: _jsx(translation.tablePaginationFooter, Object.assign({}, pagination, { sizes: pagination.sizes, select: pagination.onChangeSize && Array.isArray(pagination.sizes) ? (_jsxs(Fragment, { children: [_jsx("label", { htmlFor: id, children: translation.tablePaginationSelectLabel }), _jsx("select", { id: id, value: pagination.size, className: "cursor-pointer bg-transparent", onChange: (e) => {
                                    var _a;
                                    (_a = pagination.onChangeSize) === null || _a === void 0 ? void 0 : _a.call(pagination, Number(e.target.value));
                                }, children: pagination.sizes.map((value) => (_jsx("option", { value: value, children: value }, `pagination-opt-${value}`))) }), " "] })) : null })) }), _jsx("nav", { children: _jsxs("ul", { className: "flex items-center gap-2", children: [pagination.current > 1 ? (_jsx("li", { children: _jsx(Render, { href: "previous", className: "", children: translation.tablePaginationPrevious }) })) : null, pageNavigation.map((x) => {
                            if (x === null)
                                return null;
                            return (_jsx(Fragment, { children: typeof x === "string" ? (_jsx("li", { children: "..." })) : (_jsx("li", { children: _jsx(Render, { href: x, className: `cursor-pointer px-3 py-1 transition-colors border-b-2 hover:text-primary-subtle hover:border-primary-subtle proportional-nums ${x === pagination.current ? "text-primary border-primary" : "border-transparent"}`, children: x }) })) }, `pagination-${x}`));
                        }), hasNext ? (_jsx("li", { children: _jsx(Render, { href: "next", className: "", children: translation.tablePaginationNext }) })) : null] }) })] }));
};
