import { __rest } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { css } from "../../lib/dom";
export const Checkbox = forwardRef((_a, ref) => {
    var { children, error, className = "", size, container } = _a, props = __rest(_a, ["children", "error", "className", "size", "container"]);
    return (_jsxs("label", { "data-disabled": props.disabled, "aria-disabled": props.disabled, className: css("group flex flex-wrap items-center font-normal data-[disabled=true]:cursor-not-allowed", container), children: [_jsx("input", Object.assign({}, props, { ref: ref, type: "checkbox", className: css("form-checkbox mr-2 inline-block size-4 appearance-none rounded border-card-border bg-origin-border text-primary focus:ring-primary disabled:opacity-70 group-aria-disabled:cursor-not-allowed", className) })), children, _jsx("span", { className: "flex-1 whitespace-nowrap text-xs text-danger empty:mt-0 empty:hidden", children: error })] }));
});
