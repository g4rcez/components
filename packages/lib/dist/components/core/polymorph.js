import { __rest } from "tslib";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
export const Polymorph = forwardRef(function Polymorph(_a, ref) {
    var { as } = _a, props = __rest(_a, ["as"]);
    const Component = as || "span";
    return _jsx(Component, Object.assign({}, props, { ref: ref }));
});
