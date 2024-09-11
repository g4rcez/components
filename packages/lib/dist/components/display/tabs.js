"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, useMotionValue } from "framer-motion";
import React, { createContext, Fragment, useContext, useEffect, useRef } from "react";
import { useReactive } from "../../hooks/use-reactive";
import { Card } from "./card";
import { Select } from "../form/select";
const Context = createContext("");
export const Tabs = (props) => {
    const [active, setActive] = useReactive(props.active);
    const left = useMotionValue(0);
    const width = useMotionValue(0);
    const ref = useRef(null);
    const Render = props.useHash ? "a" : "button";
    useEffect(() => {
        const header = ref.current;
        if (header === null)
            return;
        const resize = (element) => {
            if (!element)
                return;
            const rect = element.getBoundingClientRect();
            width.set(rect.width);
            left.set(element.offsetLeft);
        };
        const listener = () => {
            const element = header.querySelector(`li[data-active=true]`);
            return void resize(element);
        };
        window.addEventListener("resize", listener);
        let first = header.querySelector(`li[data-active=true]`);
        const hash = window.location.hash.replace(/^#/, "");
        if (props.active === "" && hash !== "") {
            first = header.querySelector(`li[data-id=${hash}]`);
            setActive(hash);
        }
        if (first === null) {
            first = header.querySelector(`li[data-id]`);
            const id = first.getAttribute("data-id") || "";
            setActive(id);
        }
        resize(first);
        return () => window.removeEventListener("resize", listener);
    }, []);
    useEffect(() => {
        if (props.onChange)
            props.onChange(active);
    }, [props.onChange, active]);
    const items = React.Children.toArray(props.children);
    const onClick = (e) => {
        const anchor = e.currentTarget;
        const rect = anchor.getBoundingClientRect();
        width.set(rect.width);
        left.set(anchor.offsetLeft);
        setActive(anchor.dataset.id || "");
    };
    return (_jsx(Context.Provider, { value: active, children: _jsx(Card, { className: props.className, container: "pt-0", header: _jsxs("header", { ref: ref, className: "border-b border-card-border relative mb-2", children: [_jsx(motion.div, { layout: true, initial: false, "aria-hidden": "true", style: { left, width }, transition: { type: "tween", left, width }, className: "w-28 h-0.5 bg-primary absolute bottom-0 duration-300 transition-all hidden lg:block" }), _jsxs("nav", { children: [_jsx(Select, { onChange: (e) => setActive(e.target.value), value: active, hideLeft: true, container: "container rounded mt-4 lg:mt-0 min-w-full lg:hidden inline-flex px-6 w-full mx-auto", labelClassName: "border-transparent rounded-none", rightLabel: null, options: items.map((x) => {
                                    var _a;
                                    const inner = x.props;
                                    return { value: inner.id, label: (_a = inner.label) !== null && _a !== void 0 ? _a : inner.title };
                                }) }), _jsx("ul", { className: "hidden lg:flex divide-x divide-card-border overflow-x-auto justify-between md:justify-start", children: items.map((x) => {
                                    const inner = x.props;
                                    return (_jsx("li", { "data-id": inner.id, "data-active": active === inner.id, className: "data-[active=true]:text-primary w-full md:w-auto", children: _jsx(Render, { "data-id": inner.id, onClick: onClick, "aria-current": "page", className: "px-10 py-4 block font-medium w-full whitespace-nowrap", href: props.useHash ? `#${inner.id}` : undefined, children: inner.title }) }, `tab-header-${inner.id}`));
                                }) })] })] }), children: props.children }) }));
};
const useTabs = () => useContext(Context);
export const Tab = (props) => {
    const active = useTabs();
    return _jsx(Fragment, { children: props.id === active ? props.children : null });
};
