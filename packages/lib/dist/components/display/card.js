import { __rest } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from "../../lib/dom";
import { Polymorph } from "../core/polymorph";
export const Card = (_a) => {
    var { children, title, as = "div", container = "", header = null, className = "" } = _a, props = __rest(_a, ["children", "title", "as", "container", "header", "className"]);
    return (_jsxs(Polymorph, Object.assign({}, props, { as: as, className: css("flex flex-col gap-4 rounded-card border border-card-border bg-card-background py-4 pb-8 shadow", container), children: [title ? _jsx("header", { className: "mb-2 w-full border-b border-card-border px-8 pb-4 text-xl font-medium", children: title }) : header, _jsx("div", { className: css("min-w-full px-8", className), children: children })] })));
};
