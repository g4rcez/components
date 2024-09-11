import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronRightIcon } from "lucide-react";
import { forwardRef, Fragment, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import { useParentHeight } from "../../hooks/use-parent";
import { Button } from "../core/button";
import { Checkbox } from "../form/checkbox";
import { Input } from "./input";
const components = {
    Item: forwardRef(function InnerList(props, ref) {
        return _jsx("li", Object.assign({}, props, { ref: ref, className: "flex items-center gap-1 justify-between" }));
    }),
    List: forwardRef(function InnerList(props, ref) {
        return _jsx("ul", Object.assign({}, props, { ref: ref, className: "space-y-3" }));
    }),
};
export const TransferList = (props) => {
    const ref = useRef(null);
    const h = useParentHeight(ref);
    return (_jsxs("div", { className: "flex flex-row gap-4", ref: ref, children: [_jsxs("div", { className: "py-8 space-y-4 min-w-64 w-fit flex flex-col whitespace-nowrap rounded-lg border border-card-border", children: [_jsx("header", { className: "border-b border-card-border pb-2" }), _jsxs("div", { className: "px-8 space-y-2", children: [_jsx(Input, { rightLabel: "", title: "Search", placeholder: "Looking for..." }), _jsx(Virtuoso, { height: h, useWindowScroll: true, data: props.source, components: components, itemContent: (_, row) => (_jsx(Fragment, { children: _jsx(Checkbox, { children: _jsx(props.Item, { data: row }) }) })) })] })] }), _jsx("div", { children: _jsx(Button, { children: _jsx(ChevronRightIcon, {}) }) }), _jsx("div", {})] }));
};
