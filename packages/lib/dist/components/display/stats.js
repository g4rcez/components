import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from "../../lib/dom";
export const Stats = (props) => {
    return (_jsxs("div", { className: "divide-y divide-card-border bg-card-background shadow border border-card-border rounded-card", children: [_jsxs("header", { className: "p-6 items-start flex gap-4", children: [_jsx("div", { className: css("size-10 p-8 rounded-card flex items-center justify-center aspect-square bg-primary", props.iconContainer), children: _jsx("div", { children: _jsx(props.Icon, { className: "size-10 aspect-square text-primary-foreground" }) }) }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("header", { children: _jsx("h3", { className: "text-base leading-none", children: props.title }) }), _jsx("p", { className: "text-4xl font-semibold", children: props.children })] })] }), props.footer ? _jsx("footer", { className: "px-6 py-2", children: props.footer }) : null] }));
};
