"use client";
import { __rest } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId, useState } from "react";
import { css } from "../../lib/dom";
export const Switch = forwardRef((_a, ref) => {
    var _b;
    var { children, container, error } = _a, props = __rest(_a, ["children", "container", "error"]);
    const id = useId();
    const [innerChecked, setInnerChecked] = useState(false);
    const checked = (_b = props.checked) !== null && _b !== void 0 ? _b : innerChecked;
    const onCheck = (e) => {
        var _a;
        const button = e.target;
        const checked = !(button.dataset.checked === "true");
        setInnerChecked(checked);
        (_a = props === null || props === void 0 ? void 0 : props.onCheck) === null || _a === void 0 ? void 0 : _a.call(props, checked);
    };
    return (_jsxs("fieldset", { className: css("flex flex-wrap items-center", container), children: [_jsx("input", Object.assign({}, props, { ref: ref, hidden: true, type: "checkbox", checked: checked, onChange: (e) => setInnerChecked(e.target.checked) })), _jsx("button", { type: "button", role: "switch", onClick: onCheck, "aria-checked": checked, "data-checked": checked, "aria-labelledby": `${id}-label`, className: "duration-300 ease-in-out relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 data-[checked=false]:bg-input-switch-bg data-[checked=true]:bg-primary", children: _jsx("span", { "aria-hidden": "true", "data-checked": checked, className: "duration-300 duration-300 ease-in-out inline-block aspect-square size-5 transform rounded-full shadow ring-0 transition data-[checked=false]:translate-x-0 data-[checked=true]:translate-x-5 data-[checked=false]:bg-disabled data-[checked=true]:bg-input-switch" }) }), _jsx("span", { className: "ml-3 text-sm", id: `${id}-label`, children: _jsx("span", { className: "font-medium text-foreground", children: children }) }), _jsx("span", { className: "mt-1 flex-1 whitespace-nowrap text-xs text-danger empty:mt-0 empty:hidden", children: error })] }));
});
