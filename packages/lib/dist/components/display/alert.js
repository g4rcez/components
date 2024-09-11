import { __rest } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { CheckCircleIcon, CircleAlertIcon, XIcon } from "lucide-react";
import { forwardRef } from "react";
import { css } from "../../lib/dom";
import { Polymorph } from "../core/polymorph";
const variants = {
    true: { opacity: 1, height: "auto" },
    false: { opacity: [0.7, 0.3, 0], height: 0 },
};
const transition = {
    type: "tween",
    duration: 0.7,
    ease: [0.04, 0.62, 0.23, 0.98],
};
export const Collapse = (props) => (_jsx(motion.section, Object.assign({}, props, { layout: true, layoutRoot: true, layoutScroll: true, initial: !props.open, animate: props.open.toString(), "aria-hidden": !props.open, className: props.className, exit: variants.false, transition: transition, variants: variants, children: props.children })));
const alertVariants = cva("px-4 py-4 border relative rounded-lg text-sm", {
    variants: {
        theme: {
            neutral: "border-border bg-background",
            danger: "text-danger-contrast bg-danger/10 border-danger/50",
            success: "text-success-foreground bg-success/10 border-success/50",
        },
    },
    defaultVariants: { theme: "neutral" },
});
export const Alert = forwardRef(function Alert(_a, ref) {
    var _b;
    var { className, theme, onClose, open = true } = _a, props = __rest(_a, ["className", "theme", "onClose", "open"]);
    return (_jsx("div", { "data-open": !!open, "aria-hidden": !open, className: "pointer-events-none isolate data-[open=true]:pointer-events-auto data-[open=true]:mb-4", children: _jsx(Collapse, { "data-open": !!open, open: !!open, children: _jsxs(Polymorph, Object.assign({}, props, { className: css(alertVariants({ theme }), className), ref: ref, "data-theme": theme, role: "alert", as: (_b = props.as) !== null && _b !== void 0 ? _b : "div", children: [_jsxs("h4", { className: "mb-2 flex items-center gap-2", children: [theme === "success" ? _jsx(CheckCircleIcon, { size: 20 }) : null, theme === "danger" ? _jsx(CircleAlertIcon, { size: 20 }) : null, _jsx("span", { className: "tracking-3 text-balance text-lg font-semibold", children: props.title })] }), props.children, onClose !== undefined ? (_jsx("button", { type: "button", onClick: () => onClose(false), className: "duration-300 ease-in-out absolute right-3 top-3 text-foreground transition-colors hover:text-danger", children: _jsx(XIcon, { size: 20 }) })) : null] })) }) }));
});
