import {
    FloatingFocusManager,
    FloatingList,
    FloatingNode,
    FloatingPortal,
    FloatingTree,
    autoUpdate,
    flip,
    offset,
    safePolygon,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useFloatingNodeId,
    useFloatingParentNodeId,
    useFloatingTree,
    useHover,
    useInteractions,
    useListItem,
    useListNavigation,
    useMergeRefs,
    useRole,
    useTypeahead,
} from "@floating-ui/react";
import { ChevronRightIcon, LucideProps } from "lucide-react";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { css } from "../../lib/dom";
import { Label } from "../../types";

const menuItemClassName = (highlight: string = "") =>
    css(
        "w-full min-w-36 outline-none px-2 py-1 items-center flex justify-between text-left",
        "data-[active=true]:bg-primary data-[open]:bg-primary focus:bg-primary aria-expanded:opacity-80",
        "first-of-type:rounded-t-lg last-of-type:rounded-b-lg",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        highlight
    );

const MenuContext = createContext<{
    getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
    activeIndex: number | null;
    setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
    setHasFocusInside: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
}>({
    isOpen: false,
    activeIndex: null,
    getItemProps: () => ({}),
    setActiveIndex: () => { },
    setHasFocusInside: () => { },
});

type MenuProps = Partial<{
    isParent: boolean;
    label: Label;
    nested: boolean;
    children: React.ReactNode;
}>;

const MenuComponent = React.forwardRef<HTMLButtonElement, MenuProps & React.HTMLProps<HTMLButtonElement>>(
    ({ children, isParent, label, ...props }, forwardedRef) => {
        const parentId = useFloatingParentNodeId();
        const isNested = parentId !== null;

        const [isOpen, setIsOpen] = useState(false);
        const [hasFocusInside, setHasFocusInside] = useState(false);
        const [activeIndex, setActiveIndex] = useState<number | null>(null);
        const elementsRef = useRef<Array<HTMLButtonElement | null>>([]);
        const labelsRef = useRef<Array<string | null>>([]);
        const parent = useContext(MenuContext);
        const tree = useFloatingTree();
        const nodeId = useFloatingNodeId();
        const item = useListItem();

        const { floatingStyles, refs, context } = useFloating<HTMLButtonElement>({
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
            if (!tree) return;
            const handleTreeClick = () => setIsOpen(false);
            const onSubMenuOpen = (event: { nodeId: string; parentId: string }) => {
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
            if (isOpen && tree) tree.events.emit("menuopen", { parentId, nodeId });
        }, [tree, isOpen, nodeId, parentId]);

        const className = isParent ? props.className : menuItemClassName(props.className);

        return (
            <FloatingNode id={nodeId}>
                <button
                    ref={useMergeRefs([refs.setReference, item.ref, forwardedRef])}
                    tabIndex={!isNested ? undefined : parent.activeIndex === item.index ? 0 : -1}
                    data-open={isOpen ? "" : undefined}
                    data-nested={isNested ? "" : undefined}
                    role={isNested ? "menuitem" : undefined}
                    data-focus-inside={hasFocusInside ? "" : undefined}
                    className={className}
                    {...getReferenceProps(
                        parent.getItemProps({
                            ...props,
                            onFocus(event: React.FocusEvent<HTMLButtonElement>) {
                                props.onFocus?.(event);
                                setHasFocusInside(false);
                                parent.setHasFocusInside(true);
                            },
                        })
                    )}
                >
                    {label}
                    {isNested && (
                        <span style={{ marginLeft: 10, fontSize: 10 }}>
                            <span className="sr-only">Next menu</span>
                            <ChevronRightIcon size={14} />
                        </span>
                    )}
                </button>
                <MenuContext.Provider value={{ activeIndex, setActiveIndex, getItemProps, setHasFocusInside, isOpen }}>
                    <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
                        {isOpen && (
                            <FloatingPortal preserveTabOrder>
                                <FloatingFocusManager context={context} modal={false} initialFocus={isNested ? -1 : 0} returnFocus={!isNested}>
                                    <div
                                        ref={refs.setFloating}
                                        style={floatingStyles}
                                        className="bg-floating-background z-tooltip isolate outline-none items-start border text-left shadow-xl border-floating-border flex flex-col rounded-lg"
                                        {...getFloatingProps()}
                                    >
                                        {children}
                                    </div>
                                </FloatingFocusManager>
                            </FloatingPortal>
                        )}
                    </FloatingList>
                </MenuContext.Provider>
            </FloatingNode>
        );
    }
);

type MenuItemProps = { label: string; disabled?: boolean; Right?: React.FC<LucideProps> };

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ label, Right, disabled, ...props }, forwardedRef) => {
        const menu = useContext(MenuContext);
        const item = useListItem({ label: disabled ? null : label });
        const tree = useFloatingTree();
        const isActive = item.index === menu.activeIndex;

        return (
            <button
                {...props}
                ref={useMergeRefs([item.ref, forwardedRef])}
                data-active={isActive}
                type="button"
                role="menuitem"
                disabled={disabled}
                tabIndex={isActive ? 0 : -1}
                className={menuItemClassName(props.className)}
                {...menu.getItemProps({
                    onClick(event: React.MouseEvent<HTMLButtonElement>) {
                        props.onClick?.(event);
                        tree?.events.emit("click");
                    },
                    onFocus(event: React.FocusEvent<HTMLButtonElement>) {
                        props.onFocus?.(event);
                        menu.setHasFocusInside(true);
                    },
                })}
            >
                {label}
                {Right ? <Right size={16} /> : null}
            </button>
        );
    }
);

export const Menu = React.forwardRef<HTMLButtonElement, MenuProps & React.HTMLProps<HTMLButtonElement>>((props, ref) => {
    const parentId = useFloatingParentNodeId();
    return parentId !== null ? (
        <MenuComponent {...props} isParent={false} ref={ref} />
    ) : (
        <FloatingTree>
            <MenuComponent {...props} isParent ref={ref} />
        </FloatingTree>
    );
});
