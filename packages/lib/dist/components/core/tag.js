import { __rest } from "tslib";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { css } from "../../lib/dom";
import { Polymorph } from "./polymorph";
const tagVariants = cva("inline-flex rounded-pill gap-1.5 text-main-foreground border-2 border-transparent items-center justify-center align-middle whitespace-nowrap", {
    variants: {
        size: {
            icon: "p-1",
            big: "h-12 px-6 py-4",
            default: "h-8 px-4 py-2",
            small: "h-6 p-2 px-3 text-sm",
        },
        theme: {
            raw: "",
            main: "bg-primary-subtle text-primary-hover",
            warn: "bg-warn-subtle text-warn-hover",
            danger: "bg-danger-subtle text-danger-hover",
            secondary: "bg-secondary-background text-secondary-foreground",
            success: "bg-success-subtle text-success-hover",
            info: "bg-info-subtle text-info-hover",
            loading: "animate-pulse bg-disabled duration-700 opacity-70",
            disabled: "bg-disabled duration-700 opacity-70",
        },
    },
    defaultVariants: { theme: "main", size: "default" },
});
export const Tag = forwardRef(function Tag(_a, ref) {
    var _b;
    var { className, icon, loading, theme, size } = _a, props = __rest(_a, ["className", "icon", "loading", "theme", "size"]);
    return (_jsxs(Polymorph, Object.assign({}, props, { ref: ref, "data-theme": theme, as: (_b = props.as) !== null && _b !== void 0 ? _b : "span", className: css(tagVariants({ size, theme }), className), children: [props.children, icon] })));
});
