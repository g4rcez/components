import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import React, { Fragment, useCallback, useEffect, useId, useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks/use-click-outside";
const FloatItem = ({ item, setter }) => {
    const ref = useRef(null);
    useOnClickOutside(ref, setter);
    useEffect(() => {
        function onKeyDown(event) {
            if (event.key === "Escape")
                setter();
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);
    return (_jsxs(Fragment, { children: [_jsx(AnimatePresence, { children: item ? (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "pointer-events-none absolute inset-0 z-floating h-screen w-screen bg-floating-overlay/70" })) : null }), _jsx(AnimatePresence, { children: item ? (_jsx("div", { className: "absolute inset-0 z-tooltip flex items-center justify-center", children: _jsxs(motion.div, { layout: true, ref: ref, layoutId: `item-${item.id}`, className: "relative flex h-min w-min min-w-xs flex-col gap-4 rounded-card border border-card-border bg-card-background p-6 py-4 pb-8 shadow", children: [_jsx("nav", { className: "absolute right-4 top-1 lg:right-2", children: _jsx("button", { type: "button", onClick: setter, className: "p-1 opacity-70 transition-colors hover:text-danger hover:opacity-100 focus:text-danger", children: _jsx(XIcon, {}) }) }), _jsxs("header", { className: "flex w-full flex-wrap items-center justify-between gap-2", children: [_jsx("h3", { className: "min-w-full text-balance text-2xl font-medium", children: item.title }), _jsx("p", { className: "text-sm leading-snug text-secondary", children: item.description })] }), item.children] }) })) : null })] }));
};
export const AnimatedList = (props) => {
    const [selected, setSelected] = useState(null);
    const id = useId();
    const clear = useCallback(() => {
        setSelected(null);
    }, []);
    const items = React.Children.toArray(props.children);
    return (_jsxs(Fragment, { children: [_jsx(FloatItem, { item: selected, setter: clear }), _jsx("ul", { role: "list", children: items.map((x, index) => {
                    const item = x.props;
                    const isLast = index === items.length - 1;
                    const innerId = `${id}-${index}`;
                    const setter = () => setSelected(Object.assign(Object.assign({}, item), { id: innerId }));
                    const Leading = item.leading;
                    return (_jsx(motion.li, { layout: true, layoutId: `item-${innerId}`, className: `border-b border-card-border py-2 last:border-transparent`, children: _jsx(motion.div, { layoutId: `toast-${innerId}`, className: "relative", children: _jsx("div", { className: "relative flex items-start space-x-3", children: _jsxs(Fragment, { children: [item.avatar ? (_jsx("div", { children: _jsx("div", { className: "relative px-1", children: _jsx("button", { onClick: setter, className: "flex size-10 items-center justify-center ring-primary", children: item.avatar }) }) })) : null, _jsx("div", { className: "min-w-0 flex-1 py-1 text-foreground", children: _jsxs("div", { className: "flex flex-row flex-nowrap justify-between gap-4", children: [_jsxs("button", { onClick: setter, className: "ease-out cursor-pointer text-left transition-all hover:scale-105 hover:text-primary", children: [_jsx("h3", { children: item.title }), _jsx("p", { className: "text-sm leading-snug text-secondary", children: item.description })] }), Leading ? _jsx(Leading, { open: setter }) : null] }) })] }) }) }) }, innerId));
                }) })] }));
};
export const AnimatedListItem = (props) => _jsx(Fragment, { children: props.children });
