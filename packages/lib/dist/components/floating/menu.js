import { __rest } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { autoUpdate, flip, FloatingFocusManager, FloatingList, FloatingNode, FloatingPortal, FloatingTree, offset, safePolygon, shift, useClick, useDismiss, useFloating, useFloatingNodeId, useFloatingParentNodeId, useFloatingTree, useHover, useInteractions, useListItem, useListNavigation, useMergeRefs, useRole, useTypeahead, } from "@floating-ui/react";
import { ChevronRightIcon } from "lucide-react";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { css } from "../../lib/dom";
const menuItemClassName = (highlight = "") => css("w-full min-w-36 outline-none px-2 py-1 items-center flex justify-between text-left", "data-[active=true]:bg-primary data-[open]:bg-primary focus:bg-primary aria-expanded:opacity-80", "first-of-type:rounded-t-lg last-of-type:rounded-b-lg", "disabled:opacity-40 disabled:cursor-not-allowed", highlight);
const MenuContext = createContext({
    isOpen: false,
    activeIndex: null,
    getItemProps: () => ({}),
    setActiveIndex: () => { },
    setHasFocusInside: () => { },
});
const MenuComponent = React.forwardRef((_a, forwardedRef) => {
    var { children, isParent, label } = _a, props = __rest(_a, ["children", "isParent", "label"]);
    const parentId = useFloatingParentNodeId();
    const isNested = parentId !== null;
    const [isOpen, setIsOpen] = useState(false);
    const [hasFocusInside, setHasFocusInside] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const elementsRef = useRef([]);
    const labelsRef = useRef([]);
    const parent = useContext(MenuContext);
    const tree = useFloatingTree();
    const nodeId = useFloatingNodeId();
    const item = useListItem();
    const { floatingStyles, refs, context } = useFloating({
        nodeId,
        open: isOpen,
        transform: true,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        placement: isNested ? "right-start" : "bottom-start",
        middleware: [offset({ mainAxis: isNested ? 0 : 4, alignmentAxis: isNested ? -4 : 0 }), flip(), shift()],
    });
    const role = useRole(context, { role: "menu", enabled: true });
    const dismiss = useDismiss(context, { bubbles: true });
    const hover = useHover(context, {
        enabled: true,
        delay: { open: 100 },
        handleClose: safePolygon({ blockPointerEvents: true }),
    });
    const click = useClick(context, {
        event: "mousedown",
        toggle: !isNested,
        ignoreMouse: isNested,
        keyboardHandlers: true,
    });
    const listNavigation = useListNavigation(context, {
        loop: true,
        activeIndex,
        virtual: true,
        nested: isNested,
        allowEscape: true,
        listRef: elementsRef,
        scrollItemIntoView: true,
        onNavigate: setActiveIndex,
    });
    const typeahead = useTypeahead(context, {
        activeIndex,
        listRef: labelsRef,
        onMatch: isOpen ? setActiveIndex : undefined,
    });
    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([hover, click, role, dismiss, listNavigation, typeahead]);
    useEffect(() => {
        if (!tree)
            return;
        const handleTreeClick = () => setIsOpen(false);
        const onSubMenuOpen = (event) => {
            if (event.nodeId !== nodeId && event.parentId === parentId) {
                setIsOpen(false);
            }
        };
        tree.events.on("click", handleTreeClick);
        tree.events.on("menuopen", onSubMenuOpen);
        return () => {
            tree.events.off("click", handleTreeClick);
            tree.events.off("menuopen", onSubMenuOpen);
        };
    }, [tree, nodeId, parentId]);
    useEffect(() => {
        if (isOpen && tree)
            tree.events.emit("menuopen", { parentId, nodeId });
    }, [tree, isOpen, nodeId, parentId]);
    const className = isParent ? props.className : menuItemClassName(props.className);
    return (_jsxs(FloatingNode, { id: nodeId, children: [_jsxs("button", Object.assign({ ref: useMergeRefs([refs.setReference, item.ref, forwardedRef]), tabIndex: !isNested ? undefined : parent.activeIndex === item.index ? 0 : -1, "data-open": isOpen ? "" : undefined, "data-nested": isNested ? "" : undefined, role: isNested ? "menuitem" : undefined, "data-focus-inside": hasFocusInside ? "" : undefined, className: className }, getReferenceProps(parent.getItemProps(Object.assign(Object.assign({}, props), { onFocus(event) {
                    var _a;
                    (_a = props.onFocus) === null || _a === void 0 ? void 0 : _a.call(props, event);
                    setHasFocusInside(false);
                    parent.setHasFocusInside(true);
                } }))), { children: [label, isNested && (_jsxs("span", { style: { marginLeft: 10, fontSize: 10 }, children: [_jsx("span", { className: "sr-only", children: "Next menu" }), _jsx(ChevronRightIcon, { size: 14 })] }))] })), _jsx(MenuContext.Provider, { value: { activeIndex, setActiveIndex, getItemProps, setHasFocusInside, isOpen }, children: _jsx(FloatingList, { elementsRef: elementsRef, labelsRef: labelsRef, children: isOpen && (_jsx(FloatingPortal, { preserveTabOrder: true, children: _jsx(FloatingFocusManager, { context: context, modal: false, initialFocus: isNested ? -1 : 0, returnFocus: !isNested, children: _jsx("div", Object.assign({ ref: refs.setFloating, style: floatingStyles, className: "bg-floating-background z-tooltip isolate outline-none items-start border text-left shadow-xl border-floating-border flex flex-col rounded-lg" }, getFloatingProps(), { children: children })) }) })) }) })] }));
});
export const MenuItem = React.forwardRef((_a, forwardedRef) => {
    var { label, Right, disabled } = _a, props = __rest(_a, ["label", "Right", "disabled"]);
    const menu = useContext(MenuContext);
    const item = useListItem({ label: disabled ? null : label });
    const tree = useFloatingTree();
    const isActive = item.index === menu.activeIndex;
    return (_jsxs("button", Object.assign({}, props, { ref: useMergeRefs([item.ref, forwardedRef]), "data-active": isActive, type: "button", role: "menuitem", disabled: disabled, tabIndex: isActive ? 0 : -1, className: menuItemClassName(props.className) }, menu.getItemProps({
        onClick(event) {
            var _a;
            (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, event);
            tree === null || tree === void 0 ? void 0 : tree.events.emit("click");
        },
        onFocus(event) {
            var _a;
            (_a = props.onFocus) === null || _a === void 0 ? void 0 : _a.call(props, event);
            menu.setHasFocusInside(true);
        },
    }), { children: [label, Right ? _jsx(Right, { size: 16 }) : null] })));
});
export const Menu = React.forwardRef((props, ref) => {
    const parentId = useFloatingParentNodeId();
    return parentId !== null ? (_jsx(MenuComponent, Object.assign({}, props, { isParent: false, ref: ref }))) : (_jsx(FloatingTree, { children: _jsx(MenuComponent, Object.assign({}, props, { isParent: true, ref: ref })) }));
});
