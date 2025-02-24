import {
    autoUpdate,
    FloatingFocusManager,
    FloatingPortal,
    offset,
    size,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useListNavigation,
    useRole,
    useTransitionStyles,
} from "@floating-ui/react";
import { useVirtualizer, VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import Fuzzy from "fuzzy-search";
import { CheckIcon, ChevronDown } from "lucide-react";
import React, { forwardRef, Fragment, type PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTranslations } from "../../hooks/use-components-provider";
import { css, dispatchInput } from "../../lib/dom";
import { safeRegex } from "../../lib/fns";
import { Label } from "../../types";
import { InputField, InputFieldProps } from "./input-field";
import type { OptionProps } from "./select";

export type VirtualCompleteItem = OptionProps & { Render?: React.FC<OptionProps> };

export type VirtualCompleteProps = Omit<InputFieldProps<"input">, "value"> & {
    value?: string;
    emptyMessage?: Label;
    dynamicOption?: boolean;
    options: VirtualCompleteItem[];
};

const Frag = (props: PropsWithChildren) => <Fragment>{props.children}</Fragment>;

const transitionStyles = {
    duration: 300,
    initial: { transform: "scaleY(0)", opacity: 0.2 },
    open: { transform: "scaleY(1)", opacity: 1 },
    close: { transform: "scaleY(0)", opacity: 0 },
} as const;

const ITEM_HEIGHT = 16;

const overflowPadding = 10;

const fuzzyOptions = { caseSensitive: false, sort: false };

const Option = (props: {
    virtual: Virtualizer<any, any>;
    size: number;
    getItemProps: any;
    handleSelect: any;
    listElementsRef: any;
    virtualItem: VirtualItem;
    activeIndex: number | null;
    selectedIndex: number | null;
    option: VirtualCompleteItem;
}) => {
    const [h, setH] = useState(44);
    const index = props.virtualItem.index;
    const option = props.option;
    const Label = (option.Render as React.FC<any>) ?? Frag;
    const children = option.label ?? option.value;
    const selected = index === props.selectedIndex;
    const active = props.activeIndex === index;
    return (
        <li
            id={`item-${index}`}
            data-index={index}
            tabIndex={-1}
            ref={(node) => {
                props.listElementsRef.current[index] = node;
            }}
            role="option"
            aria-selected={active}
            aria-setsize={props.size}
            aria-posinset={index + 1}
            {...props.getItemProps({
                onClick: props.handleSelect,
                style: {
                    height: `${h}px`,
                    transform: `translateY(${props.virtualItem.start}px)`,
                },
            })}
        >
            <button
                type="button"
                aria-checked={active}
                aria-current={active}
                aria-selected={active}
                data-value={option.value}
                aria-busy={option.disabled}
                className={`flex w-full max-w-full cursor-pointer justify-between overflow-ellipsis p-2 text-left ${active ? "bg-primary-hover text-primary-foreground" : ""} ${selected ? "bg-primary text-primary-foreground" : ""}`}
            >
                <Label {...option} label={option.label} value={option.value} children={children} />
                {selected ? (
                    <span>
                        <CheckIcon aria-hidden className="text-current" absoluteStrokeWidth strokeWidth={2} size={22} />
                    </span>
                ) : null}
            </button>
        </li>
    );
};

export const VirtualAutocomplete = forwardRef<HTMLInputElement, VirtualCompleteProps>(function VirtualAutocomplete(
    {
        options,
        emptyMessage,
        dynamicOption = false,
        feedback = null,
        labelClassName,
        interactive,
        rightLabel,
        optionalText,
        container,
        hideLeft = false,
        right,
        left,
        error,
        required = false,
        ...props
    }: VirtualCompleteProps,
    externalRef: any
) {
    const [value, setValue] = useState(props.value);
    const [shadow, setShadow] = useState("");
    const [label, setLabel] = useState("");
    const translation = useTranslations();
    const fieldset = useRef<HTMLFieldSetElement | null>(null);
    const [open, setOpen] = useState(false);
    const [pointer, setPointer] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [maxHeight, setMaxHeight] = useState(400);
    const wrapperRef = useRef<HTMLUListElement>(null);
    const innerOptions: VirtualCompleteItem[] =
        dynamicOption && shadow !== ""
            ? [
                  {
                      value: shadow,
                      label: shadow,
                      "data-dynamic": "true",
                  },
                  ...options,
              ]
            : options;
    const list = new Fuzzy(innerOptions, ["value", "label"], fuzzyOptions).search(shadow);
    const listElementsRef = useRef<Array<HTMLElement | null>>([]);
    useEffect(() => {
        listElementsRef.current = Array.from({ length: list.length }).fill(null) as any[];
    }, [list]);

    const onSelect = (opt: VirtualCompleteItem, i: number) => {
        setValue(opt.value);
        const input = refs.reference.current as HTMLInputElement;
        if (!input) return;
        input?.setAttribute("data-value", opt.value);
        input.value = opt.value;
        const event = new Event("change", { bubbles: false, cancelable: true });
        input.dispatchEvent(event);
        if (props.onChange) props.onChange(event as any);
        setLabel(opt.label ?? "");
        setOpen(false);
        setShadow("");
        setActiveIndex(i);
    };

    if (!open && pointer) {
        setPointer(false);
    }

    const { refs, floatingStyles, context, isPositioned, x, y, strategy } = useFloating<HTMLButtonElement>({
        open,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(8),
            size({
                padding: overflowPadding,
                apply(args) {
                    flushSync(() => setMaxHeight(args.availableHeight));
                    const max = fieldset.current?.getBoundingClientRect().width;
                    Object.assign(args.elements.floating.style, { width: `${max}px`, maxWidth: `${max}px` });
                },
            }),
        ],
    });

    const transitions = useTransitionStyles(context, transitionStyles);

    const virtualizer = useVirtualizer({
        overscan: 10,
        count: list.length,
        estimateSize: (i) => {
            if (fieldset.current === null) return ITEM_HEIGHT;
            const item = list[i];
            const width = fieldset.current.getBoundingClientRect().width;
            const chars = item.label?.length ?? 1;
            const r = Math.ceil((chars * 8) / width);
            return Math.min(r, 3) * ITEM_HEIGHT;
        },
        getScrollElement: () => refs.floating.current,
    });

    const click = useClick(context);
    const role = useRole(context, { role: "listbox" });
    const dismiss = useDismiss(context);
    const listNavigation = useListNavigation(context, {
        loop: true,
        activeIndex,
        selectedIndex,
        virtual: true,
        disabledIndices: [],
        listRef: listElementsRef,
        onNavigate: setActiveIndex,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([click, role, dismiss, listNavigation]);

    useLayoutEffect(() => {
        if (isPositioned && !pointer) {
            if (activeIndex === null && selectedIndex === null) {
                virtualizer.scrollToIndex(0, { behavior: "auto" });
            }
            if (activeIndex !== null) {
                wrapperRef.current?.focus({ preventScroll: true });
                virtualizer.scrollToIndex(activeIndex, { behavior: "auto" });
            }
        }
    }, [virtualizer, isPositioned, activeIndex, selectedIndex, pointer, refs]);

    const handleSelect = () => {
        if (activeIndex !== null) {
            setSelectedIndex(activeIndex);
            const opt = list[activeIndex];
            const input = refs.reference.current as HTMLInputElement;
            if (!input) return;
            input?.setAttribute("data-value", opt.value);
            input.value = opt.value;
            const event = new Event("change", { bubbles: false, cancelable: true });
            input.dispatchEvent(event);
            if (props.onChange) props.onChange(event as any);
            setLabel(opt.label ?? "");
            setOpen(false);
            setShadow("");
        }
    };

    const onOpenCaret = () => {
        setOpen(true);
        (refs.reference.current as HTMLInputElement | null)?.focus();
    };

    const onClose = () => {
        setShadow("");
        setValue("");
        setLabel("");
        setOpen(false);
        dispatchInput(refs.reference.current as HTMLInputElement, "");
    };

    const pattern = dynamicOption
        ? undefined
        : `^(${options.map((x) => `${safeRegex(x.value)}${x.label ? "|" + safeRegex(x.label) : ""}`).join("|")})$`;

    const id = props.id || props.name;

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setShadow(value);
        if (!open && value === "") return setOpen(true);
        event.target.name = props.name || "";
        return value ? setOpen(true) : props.onChange?.(event);
    };

    const onFocus = () => {
        setOpen(true);
        setShadow("");
        setActiveIndex((prev) => (prev === null ? 0 : prev));
    };

    const itemsToRender = virtualizer.getVirtualItems();

    return (
        <InputField
            {...(props as any)}
            left={left}
            error={error}
            ref={fieldset}
            form={props.form}
            name={props.name}
            feedback={feedback}
            hideLeft={hideLeft}
            required={required}
            title={props.title}
            container={container}
            rightLabel={rightLabel}
            interactive={interactive}
            id={props.name || props.id}
            optionalText={optionalText}
            componentName="autocomplete"
            labelClassName={labelClassName}
            placeholder={props.placeholder}
            right={
                <span className="flex items-center gap-0.5">
                    <button type="button" className="transition-colors link:text-primary" onClick={onOpenCaret}>
                        <ChevronDown size={20} />
                        <span className="sr-only">{translation.inputCaretDown}</span>
                    </button>
                    {value ? (
                        <button type="button" onClick={onClose} className="transition-colors link:text-danger">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    ) : null}
                </span>
            }
        >
            <input
                {...getReferenceProps({
                    ...props,
                    onChange,
                    onFocus,
                    pattern,
                    id: `${id}-shadow`,
                    name: `${id}-shadow`,
                    ref: refs.setReference,
                    onClick: (e: React.MouseEvent<HTMLInputElement>) => e.currentTarget.focus(),
                    onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
                        if (event.key === "Escape") {
                            event.currentTarget.blur();
                            return setOpen(false);
                        }
                        if (event.key === "Enter") {
                            if (activeIndex !== null && list[activeIndex]) {
                                event.preventDefault();
                                return onSelect(list[activeIndex], activeIndex);
                            }
                            if (list.length === 1) {
                                event.preventDefault();
                                return onSelect(list[0], 0);
                            }
                        }
                    },
                })}
                data-value={value}
                data-error={!!error}
                data-name={id}
                data-target={id}
                required={required}
                value={open ? shadow : label || value}
                aria-autocomplete="list"
                autoComplete="off"
                className={css(
                    "input placeholder-input-mask group h-input-height w-full flex-1",
                    "rounded-md bg-transparent px-input-x py-input-y text-foreground",
                    "outline-none transition-colors focus:ring-2 focus:ring-inset focus:ring-primary",
                    "group-error:text-danger group-error:placeholder-input-mask-error",
                    "group-focus-within:border-primary group-hover:border-primary",
                    props.className
                )}
            />
            <input
                id={id}
                name={id}
                type="hidden"
                data-origin={id}
                ref={externalRef}
                required={required}
                defaultValue={props.value || value || undefined}
            />
            <FloatingPortal>
                {open && (
                    <FloatingFocusManager guards returnFocus={false} context={context} initialFocus={-1} visuallyHiddenDismiss modal={false}>
                        <div
                            tabIndex={-1}
                            ref={refs.setFloating}
                            className="isolate z-floating m-0 origin-[top_center] list-none overflow-auto overflow-y-auto overscroll-contain rounded-b-lg rounded-t-lg border border-floating-border bg-floating-background p-0 text-foreground shadow-floating"
                            style={{
                                ...floatingStyles,
                                ...transitions.styles,
                                maxHeight,
                                top: y ?? 0,
                                position: strategy,
                                left: (x ?? 0) + (!!value ? 26 : 16),
                            }}
                        >
                            <ul
                                tabIndex={0}
                                ref={wrapperRef}
                                style={{ height: virtualizer.getTotalSize() }}
                                className="relative w-full outline-0"
                                {...getFloatingProps({
                                    onPointerMove() {
                                        setPointer(true);
                                    },
                                    onKeyDown(e) {
                                        setPointer(false);
                                        if (e.key === "Enter" && activeIndex !== null) {
                                            handleSelect();
                                        }
                                    },
                                })}
                            >
                                {itemsToRender.map((virtualItem) => {
                                    return (
                                        <Option
                                            virtual={virtualizer}
                                            size={list.length}
                                            key={virtualItem.key}
                                            activeIndex={activeIndex}
                                            virtualItem={virtualItem}
                                            getItemProps={getItemProps}
                                            handleSelect={handleSelect}
                                            selectedIndex={selectedIndex}
                                            option={list[virtualItem.index]}
                                            listElementsRef={listElementsRef}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </FloatingFocusManager>
                )}
            </FloatingPortal>
        </InputField>
    );
});
