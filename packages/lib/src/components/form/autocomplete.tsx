"use client";
import {
    autoPlacement,
    autoUpdate,
    FloatingFocusManager,
    FloatingPortal,
    offset,
    size,
    useDismiss,
    useFloating,
    useInteractions,
    useListNavigation,
    useRole,
    useTransitionStyles,
} from "@floating-ui/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import React, { forwardRef, Fragment, type PropsWithChildren, Ref, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { type ContextProp, type ItemProps, type ListProps, Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { Is } from "sidekicker";
import { useRemoveScroll } from "../../hooks/use-remove-scroll";
import { useTranslations } from "../../hooks/use-translations";
import { css, dispatchInput, getRemainingSize, initializeInputDataset, synthesizeChangeEvent } from "../../lib/dom";
import { safeRegex } from "../../lib/fns";
import { fzf } from "../../lib/fzf";
import { Label } from "../../types";
import { InputField, InputFieldProps } from "./input-field";
import { type OptionProps } from "./select";

export type AutocompleteItemProps = OptionProps & { Render?: React.FC<OptionProps> };

export type AutocompleteProps = Omit<InputFieldProps<"input">, "value"> & {
    title?: string;
    value?: string;
    emptyMessage?: Label;
    dynamicOption?: boolean;
    options: AutocompleteItemProps[];
};

const Frag = (props: PropsWithChildren) => <Fragment>{props.children}</Fragment>;

const transitionStyles = {
    duration: 200,
    open: { transform: "scaleY(1)", opacity: 1 },
    close: { transform: "scaleY(0)", opacity: 0 },
    initial: { transform: "scaleY(0)", opacity: 0.2 },
} as const;

const List = forwardRef<HTMLUListElement, ListProps & ContextProp<unknown>>(function VirtualList({ context, ...props }, ref) {
    return (
        <motion.ul {...props} ref={ref} className="max-h-96 w-full overscroll-contain rounded-lg">
            <AnimatePresence>{props.children}</AnimatePresence>
        </motion.ul>
    );
});

const Item = forwardRef<HTMLLIElement, ItemProps<AutocompleteItemProps> & ContextProp<unknown>>(function VirtualItem(
    { item, context, ...props },
    ref
) {
    return <motion.li {...props} ref={ref} className="first:rounded-t-lg last:rounded-t-lg" />;
});

const components = { List, Item };

const EMPTY_NODES: Array<HTMLElement | null> = [];

const MIN_SIZE = 40;

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
    (
        {
            left,
            error,
            right,
            loading,
            options,
            container,
            rightLabel,
            interactive,
            emptyMessage,
            optionalText,
            labelClassName,
            feedback = null,
            hideLeft = false,
            required = false,
            dynamicOption = false,
            ...props
        }: AutocompleteProps,
        externalRef
    ) => {
        const scroller = useRef<HTMLElement | null>(null);
        const fieldset = useRef<HTMLFieldSetElement>(null);
        const virtuoso = useRef<VirtuosoHandle | null>(null);
        const defaults = props.value ?? props.defaultValue ?? "";
        const translation = useTranslations();
        const [open, setOpen] = useState(false);
        const [shadow, setShadow] = useState("");
        const [value, setValue] = useState(defaults);
        const [label, setLabel] = useState(() => options.find((x) => x.value === defaults)?.label ?? defaults);
        const [index, setIndex] = useState<number | null>(null);
        const listRef = useRef<Array<HTMLElement | null>>(EMPTY_NODES);
        const [, tick] = useState(0);
        const removeScrollRef = useRemoveScroll(open, "block-only");

        const innerOptions = useMemo<AutocompleteItemProps[]>(
            () => (dynamicOption && shadow !== "" ? [{ value: shadow, label: shadow, "data-dynamic": "true" }, ...options] : options),
            [dynamicOption, shadow, options]
        );

        const openDropdown = () => flushSync(() => setOpen(true));

        const list = useMemo(
            () =>
                shadow
                    ? fzf(innerOptions, "value", [
                          { key: "value", value: shadow },
                          { key: "label", value: shadow },
                      ])
                    : innerOptions,
            [innerOptions, shadow]
        );

        const [h, setH] = useState(() => Math.min(320, MIN_SIZE * options.length));

        const setClosed = () => {
            setOpen(false);
            setH(0);
        };

        const displayList = useMemo(() => list.filter((x) => x.hidden !== true), [list]);

        const pattern = useMemo(
            () =>
                dynamicOption ? undefined : `^(${options.map((x) => `${safeRegex(x.value)}${x.label ? "|" + safeRegex(x.label) : ""}`).join("|")})$`,
            [dynamicOption, options]
        );

        const { x, y, strategy, refs, context, placement } = useFloating<HTMLInputElement>({
            open,
            transform: true,
            onOpenChange: setOpen,
            placement: "bottom-start",
            whileElementsMounted: autoUpdate,
            middleware: [
                offset(4),
                autoPlacement({ allowedPlacements: ["top-start", "bottom-start"], alignment: "start" }),
                size({
                    padding: 10,
                    elementContext: "reference",
                    apply(args) {
                        const DEFAULT_SIZE = getRemainingSize(refs.reference!.current as HTMLElement, window.innerHeight);
                        const mw = `${fieldset.current?.getBoundingClientRect().width || DEFAULT_SIZE}px`;
                        Object.assign(args.elements.floating.style, { width: mw, maxWidth: mw });
                    },
                }),
            ],
        });
        const transitions = useTransitionStyles(context, transitionStyles);
        const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
            useRole(context, { role: "listbox" }),
            useDismiss(context),
            useListNavigation(context, {
                cols: 0,
                listRef,
                loop: true,
                virtual: true,
                allowEscape: true,
                activeIndex: index,
                selectedIndex: index,
                focusItemOnOpen: "auto",
                openOnArrowKeyDown: true,
                scrollItemIntoView: true,
            }),
        ]);

        useEffect(() => {
            if (props.value) {
                const item = options.find((x) => x.value === props.value);
                if (item) {
                    setLabel(item.label ?? item.value);
                    setValue(props.value);
                }
            }
        }, [props.value, options.length]);

        useEffect(() => {
            const input = refs.reference.current as HTMLInputElement;
            if (!input) return;
            return initializeInputDataset(input);
        }, []);

        useEffect(() => {
            if (!open) return;
            const id = requestAnimationFrame(() => tick((n) => n + 1));
            return () => cancelAnimationFrame(id);
        }, [open]);

        useEffect(() => {
            if (!open) {
                setH(0);
                return;
            }
            const id = setTimeout(() => setH(Math.min(320, displayList.length * MIN_SIZE)), 100);
            return () => clearTimeout(id);
        }, [open, displayList.length]);

        const onSelect = (opt: AutocompleteItemProps, i: number) => {
            setValue(opt.value);
            const input = refs.reference.current as HTMLInputElement;
            if (!input) return;
            input?.setAttribute("data-value", opt.value);
            input.value = opt.value;
            const event = new Event("change", { bubbles: false, cancelable: true });
            input.dispatchEvent(event);
            if (props.onChange) props.onChange(synthesizeChangeEvent(input));
            setLabel(opt.label ?? "");
            setClosed();
            setShadow("");
            setIndex(i);
        };

        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setShadow(value);
            if (!open && value === "") return setOpen(true);
            event.target.name = props.name || "";
            return value ? setOpen(true) : props.onChange?.(event);
        };

        const onCaretDownClick = () => {
            openDropdown();
            setShadow("");
            (refs.reference.current as HTMLInputElement)?.focus();
        };

        const onFocus = () => {
            setIndex((prev) => (prev === null ? 0 : prev));
            openDropdown();
            setShadow("");
        };

        const onClose = () => {
            (refs.reference.current as HTMLInputElement)?.setAttribute("data-value", "");
            setShadow("");
            setValue("");
            setLabel("");
            dispatchInput(refs.reference.current as HTMLInputElement);
            setClosed();
        };

        const id = props.id || props.name;

        const shadowId = `${id}-shadow`;

        const isEmpty = displayList.length === 0;

        const isTopPlacement = placement === "top" || placement === "top-start";

        return (
            <InputField
                {...props}
                left={left}
                error={error}
                id={shadowId}
                form={props.form}
                loading={loading}
                name={props.name}
                hideLeft={hideLeft}
                required={required}
                title={props.title}
                container={container}
                rightLabel={rightLabel}
                interactive={interactive}
                optionalText={optionalText}
                componentName="autocomplete"
                labelClassName={labelClassName}
                placeholder={props.placeholder}
                ref={fieldset as unknown as Ref<HTMLInputElement>}
                feedback={open && isTopPlacement ? props.title : feedback}
                right={
                    <span className="flex items-center gap-0.5">
                        {right}
                        <button type="button" className="p-2 transition-colors link:text-primary md:p-1" onClick={onCaretDownClick}>
                            <CaretDownIcon size={20} />
                            <span className="sr-only">{translation.inputCaretDown}</span>
                        </button>
                        {value ? (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label={translation.inputCloseValue}
                                className="p-2 transition-colors link:text-danger md:p-1"
                            >
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
                    data-shadow="true"
                    {...getReferenceProps({
                        ...props,
                        onFocus,
                        pattern,
                        onChange,
                        id: shadowId,
                        name: shadowId,
                        ref: refs.setReference,
                        onClick: (e: React.MouseEvent<HTMLInputElement>) => e.currentTarget.focus(),
                        onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
                            if (event.key === "Escape") {
                                event.currentTarget.blur();
                                return setClosed();
                            }
                            if (!open) return;
                            if (event.key === "ArrowDown") {
                                let next = Is.number(index) ? index + 1 : 0;
                                if (next > displayList.length - 1) next = 0;
                                virtuoso.current?.scrollIntoView({ index: next });
                                return setIndex(next);
                            }
                            if (event.key === "ArrowUp") {
                                let next = Is.number(index) ? index! - 1 : displayList.length - 1;
                                if (next < 0) next = displayList.length - 1;
                                virtuoso.current?.scrollIntoView({ index: next });
                                return setIndex(next);
                            }
                            if (event.key === "Enter") {
                                if (index !== null && displayList[index]) {
                                    event.preventDefault();
                                    return onSelect(displayList[index], index);
                                }
                                if (displayList.length === 1) {
                                    event.preventDefault();
                                    return onSelect(displayList[0], 0);
                                }
                            }
                        },
                    } as React.HTMLProps<HTMLInputElement>)}
                    data-value={value}
                    data-error={!!error}
                    data-name={id}
                    data-target={id}
                    required={required}
                    value={open ? shadow : options.length === 0 ? "" : label || value}
                    aria-autocomplete="list"
                    autoComplete="off"
                    className={css(
                        "input placeholder-input-mask group h-input-height w-full flex-1",
                        "rounded-md bg-transparent px-input-x py-input-y text-foreground",
                        "outline-none transition-colors focus:ring-2 focus:ring-inset focus:ring-primary",
                        "group-error:text-danger group-error:placeholder-input-mask-error",
                        "text-base group-focus-within:border-primary group-hover:border-primary",
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
                <FloatingPortal preserveTabOrder>
                    {open ? (
                        <FloatingFocusManager modal guards returnFocus={false} context={context} initialFocus={-1} visuallyHiddenDismiss>
                            <motion.div
                                {...getFloatingProps({
                                    ref: refs.setFloating,
                                    style: { ...transitions.styles, left: x, top: y ?? 0, position: strategy, height: "auto" },
                                })}
                                initial={false}
                                data-floating="true"
                                animate={{ height: isEmpty ? "auto" : h }}
                                onAnimationComplete={() => {
                                    if (!open) {
                                        setH(0);
                                        return;
                                    }
                                    const li = refs.floating.current?.querySelector("li");
                                    const sum = (li?.getBoundingClientRect().height ?? MIN_SIZE) * displayList.length;
                                    flushSync(() => setH(Math.min(320, sum + 2)));
                                }}
                                className={css(
                                    "shadow-floating isolate z-floating m-0 max-h-80 origin-[top_center] list-none overscroll-contain rounded-b-lg rounded-t-lg border border-floating-border bg-floating-background p-0 text-foreground ease-in-out",
                                    isTopPlacement ? "origin-[bottom_center]" : "origin-[top_center]"
                                )}
                            >
                                {isEmpty ? (
                                    <div className="w-full border-b border-tooltip-border">
                                        <span className="flex w-full justify-between p-2 text-left text-disabled">
                                            {emptyMessage || translation.autocompleteEmpty}
                                        </span>
                                    </div>
                                ) : null}
                                <Virtuoso
                                    overscan={40}
                                    ref={virtuoso}
                                    hidden={isEmpty}
                                    data={displayList}
                                    style={{ height: h }}
                                    defaultItemHeight={MIN_SIZE}
                                    components={components as never}
                                    scrollerRef={(e) => {
                                        scroller.current = e as HTMLElement;
                                        removeScrollRef.current = e as HTMLElement;
                                    }}
                                    className="border-floating max-h-full overscroll-contain rounded-lg bg-floating-background p-0 text-foreground"
                                    itemContent={(i, option) => {
                                        const Label = option.Render ?? Frag;
                                        const active = value === option.value || value === option.label;
                                        const selected = index === i;
                                        const children = option.label ?? option.value;
                                        return (
                                            <button
                                                data-value={option.value}
                                                {...getItemProps({
                                                    ref: (node) => {
                                                        listRef.current[i] = node;
                                                    },
                                                    role: "option",
                                                    type: "button",
                                                    "aria-checked": active,
                                                    "aria-current": active,
                                                    "aria-selected": active,
                                                    "aria-disabled": option.disabled,
                                                    onClick: () => onSelect(option, i),
                                                    className: `cursor-pointer min-h-10 hover:bg-floating-hover w-full p-2 text-left ${active ? "bg-primary-hover text-primary-foreground" : ""} ${selected ? "bg-floating-hover text-floating-foreground" : ""}`,
                                                })}
                                            >
                                                <Label {...option} ref={undefined} label={option.label} value={option.value}>
                                                    {children}
                                                </Label>
                                            </button>
                                        );
                                    }}
                                />
                            </motion.div>
                        </FloatingFocusManager>
                    ) : null}
                </FloatingPortal>
            </InputField>
        );
    }
);
