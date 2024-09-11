import { __rest } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from "../../lib/dom";
export const Radiobox = (_a) => {
    var { children, className = "", size } = _a, props = __rest(_a, ["children", "className", "size"]);
    return (_jsxs("label", { "data-disabled": props.disabled, "aria-disabled": props.disabled, className: "group font-normal flex items-center gap-2 data-[disabled=true]:cursor-not-allowed", children: [_jsx("input", Object.assign({}, props, { type: "radio", className: css("form-radio rounded-full h-4 w-4 app border-card-border text-primary focus:ring-primary appearance-none inline-block bg-origin-border group-aria-disabled:cursor-not-allowed disabled:opacity-70", className) }, props)), children] }));
};
