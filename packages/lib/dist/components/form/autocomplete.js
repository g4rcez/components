"use client";
import { __rest } from "tslib";
import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { autoUpdate, FloatingFocusManager, FloatingPortal, offset, size, useDismiss, useFloating, useInteractions, useListNavigation, useRole, useTransitionStyles, } from "@floating-ui/react";
import Fuzzy from "fuzzy-search";
import { ChevronDown } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { usePrevious } from "../../hooks/use-previous";
import { useTranslations } from "../../hooks/use-translate-context";
import { css, dispatchInput } from "../../lib/dom";
import { safeRegex } from "../../lib/fns";
import { InputField } from "./input-field";
export const Option = forwardRef((_a, ref) => {
    var _b;
    var { selected, active, onClick, option } = _a, rest = __rest(_a, ["selected", "active", "onClick", "option"]);
    return (_jsx("li", Object.assign({}, rest, { ref: ref, role: "option", "aria-selected": selected, className: "w-full border-b border-tooltip-border last:border-transparent", children: _jsx("button", { type: "button", onClick: onClick, "aria-selected": selected, className: `w-full cursor-pointer p-2 text-left ${selected ? "bg-primary text-primary-foreground" : ""} ${active ? "bg-primary-subtle text-primary-foreground" : ""}`, children: (_b = option.label) !== null && _b !== void 0 ? _b : option.value }) })));
});
const transitionStyles = {
    duration: 300,
    initial: { transform: "scaleY(0)", opacity: 0.4 },
    open: { transform: "scaleY(1)", opacity: 1 },
    close: { transform: "scaleY(0)", opacity: 0 },
};
const fuzzyOptions = { caseSensitive: false, sort: false };
const emptyRef = [];
export const Autocomplete = forwardRef((_a, externalRef) => {
    var _b, _c, _d, _e;
    var { options, dynamicOption = false, feedback = null, labelClassName, interactive, rightLabel, optionalText, container, hideLeft = false, right, left, error, required = false } = _a, props = __rest(_a, ["options", "dynamicOption", "feedback", "labelClassName", "interactive", "rightLabel", "optionalText", "container", "hideLeft", "right", "left", "error", "required"]);
    const translation = useTranslations();
    const ref = useRef(null);
    const [open, setOpen] = useState(false);
    const [shadow, setShadow] = useState("");
    const [value, setValue] = useState((_c = (_b = props.value) !== null && _b !== void 0 ? _b : props.defaultValue) !== null && _c !== void 0 ? _c : "");
    const [label, setLabel] = useState((_e = (_d = props.value) !== null && _d !== void 0 ? _d : props.defaultValue) !== null && _e !== void 0 ? _e : "");
    const [index, setIndex] = useState(null);
    const listRef = useRef(emptyRef);
    const previousIndex = usePrevious(index);
    const innerOptions = dynamicOption && shadow !== "" ? [{ value: shadow, label: shadow, "data-dynamic": "true" }, ...options] : options;
    const list = new Fuzzy(innerOptions, ["value", "label"], fuzzyOptions).search(shadow);
    useImperativeHandle(externalRef, () => ref.current);
    const pattern = dynamicOption
        ? undefined
        : `^(${options.map((x) => `${safeRegex(x.value)}${x.label ? "|" + safeRegex(x.label) : ""}`).join("|")})$`;
    useEffect(() => {
        var _a;
        if (props.value) {
            setValue(props.value);
            const item = options.find((x) => x.value === props.value);
            setValue((_a = item === null || item === void 0 ? void 0 : item.label) !== null && _a !== void 0 ? _a : props.value);
        }
    }, [props.value]);
    const { x, y, strategy, refs, context } = useFloating({
        open,
        transform: true,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(4),
            size({
                padding: 10,
                apply(a) {
                    Object.assign(a.elements.floating.style, {
                        width: `${a.rects.reference.width}px`,
                        maxHeight: `${Math.min(480, a.availableHeight)}px`,
                    });
                },
            }),
        ],
    });
    useImperativeHandle(externalRef, () => { var _a; return (_a = refs.domReference) === null || _a === void 0 ? void 0 : _a.current; }, [refs]);
    const transitions = useTransitionStyles(context, transitionStyles);
    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
        useRole(context, { role: "listbox" }),
        useDismiss(context),
        useListNavigation(context, {
            listRef,
            loop: true,
            activeIndex: index,
            allowEscape: true,
            focusItemOnOpen: "auto",
            openOnArrowKeyDown: true,
            scrollItemIntoView: true,
            selectedIndex: index,
            virtual: true,
            onNavigate: (n) => {
                var _a;
                const lastIndex = list.length - 1;
                if (n === null && previousIndex === 0)
                    return setIndex(lastIndex);
                if (n === null && previousIndex === lastIndex)
                    return setIndex(0);
                const i = (_a = n !== null && n !== void 0 ? n : previousIndex) !== null && _a !== void 0 ? _a : null;
                return i === null ? undefined : setIndex(i);
            },
        }),
    ]);
    const onSelect = (opt) => {
        var _a, _b;
        setValue(opt.value);
        setLabel((_a = opt.label) !== null && _a !== void 0 ? _a : "");
        const fakeEvent = dispatchInput(ref.current, opt.value);
        if (fakeEvent)
            (_b = props.onChange) === null || _b === void 0 ? void 0 : _b.call(props, fakeEvent);
        setOpen(false);
        setShadow("");
    };
    const onChange = (event) => {
        var _a;
        const value = event.target.value;
        setShadow(value);
        if (!open && value === "")
            return setOpen(true);
        event.target.name = props.name || "";
        return value ? setOpen(true) : (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, event);
    };
    const onFocus = () => {
        setOpen(true);
        setShadow("");
    };
    const onClose = () => {
        setShadow("");
        setValue("");
        setLabel("");
        dispatchInput(refs.reference.current, "");
        setOpen(false);
    };
    const id = props.id || props.name;
    return (_jsxs(InputField, Object.assign({}, props, { container: css("group inline-block w-full", container), error: error, feedback: feedback, form: props.form, hideLeft: hideLeft, id: props.name || props.id, interactive: interactive, labelClassName: labelClassName, left: left, name: props.name, optionalText: optionalText, placeholder: props.placeholder, required: required, rightLabel: rightLabel, title: props.title, right: _jsxs("span", { className: "flex items-center gap-0.5", children: [_jsxs("button", { type: "button", className: "transition-colors link:text-primary", children: [_jsx(ChevronDown, { size: 20 }), _jsx("span", { className: "sr-only", children: translation.inputCaretDown })] }), value ? (_jsx("button", { type: "button", onClick: onClose, className: "transition-colors link:text-danger", children: _jsx("svg", { width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z", fill: "currentColor", fillRule: "evenodd", clipRule: "evenodd" }) }) })) : null] }), children: [_jsx("input", { ref: ref, required: required, type: "hidden", name: id, id: id, defaultValue: props.value || undefined }), _jsx("input", Object.assign({}, getReferenceProps(Object.assign(Object.assign({}, props), { onChange,
                onFocus,
                pattern, ref: refs.setReference, name: `${id}-shadow`, id: `${id}-shadow`, onClick: (e) => e.currentTarget.focus(), onKeyDown(event) {
                    if (event.key === "Escape") {
                        event.currentTarget.blur();
                        return setOpen(false);
                    }
                    if (event.key === "Enter") {
                        if (index !== null && list[index]) {
                            event.preventDefault();
                            return onSelect(list[index]);
                        }
                        if (list.length === 1) {
                            event.preventDefault();
                            return onSelect(list[0]);
                        }
                    }
                } })), { "data-name": id, "data-ignore": "ignore", required: required, value: open ? shadow : label || value, "aria-autocomplete": "list", autoComplete: "off", className: css("input placeholder-input-mask group h-11 w-full flex-1 rounded-md bg-transparent p-2 text-base text-foreground outline-none transition-colors group-error:text-danger group-error:placeholder-input-mask-error", !!right || shadow ? "pe-12" : "", !!left ? "ps-8" : "", props.className) })), _jsx(FloatingPortal, { preserveTabOrder: true, children: open ? (_jsx(FloatingFocusManager, { guards: true, returnFocus: false, context: context, initialFocus: -1, visuallyHiddenDismiss: true, children: _jsx("ul", Object.assign({}, getFloatingProps({
                        ref: refs.setFloating,
                        style: Object.assign({ position: strategy, left: x !== null && x !== void 0 ? x : 0, top: y !== null && y !== void 0 ? y : 0 }, transitions.styles),
                    }), { "data-floating": "true", className: "z-floating m-0 origin-[top_center] list-none overflow-auto overflow-y-auto rounded-b-lg rounded-t-lg bg-floating-background p-0 text-foreground shadow-floating", children: list.map((option, i) => (_createElement(Option, Object.assign({}, getItemProps({
                            onClick: () => onSelect(option),
                            ref: (node) => void (listRef.current[i] = node),
                            selected: index === i,
                            active: value === option.value,
                        }), { key: `${option.value}-option`, option: option, selected: index === i, active: value === option.value })))) })) })) : null })] })));
});
