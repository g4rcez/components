"use client";
import {
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
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { forwardRef, Fragment, type PropsWithChildren, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { type Components, Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { Is } from "sidekicker";
import { useRemoveScroll } from "../../hooks/use-remove-scroll";
import { useTranslations } from "../../hooks/use-translations";
import { css, dispatchInput, getRemainingSize, initializeInputDataset, mergeRefs } from "../../lib/dom";
import { safeRegex } from "../../lib/fns";
import { Label } from "../../types";
import { InputField, InputFieldProps } from "./input-field";
import { type OptionProps } from "./select";
import { fzf } from "../../lib/fzf";

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
    duration: 300,
    initial: { transform: "scaleY(0)", opacity: 0.2 },
    open: { transform: "scaleY(1)", opacity: 1 },
    close: { transform: "scaleY(0)", opacity: 0 },
} as const;

const emptyRef: any[] = [];

const List: Components["List"] = forwardRef(function VirtualList(props, ref) {
    return (
        <motion.ul
            {...props}
            ref={ref as any}
            className="w-full overscroll-contain rounded-lg border-b border-tooltip-border last:border-transparent"
        >
            <AnimatePresence>{props.children}</AnimatePresence>
        </motion.ul>
    );
});

const Item: Components["List"] = forwardRef(function VirtualItem({ item, context, ...props }: any, ref) {
    return <motion.li {...props} ref={ref as any} className="first:rounded-t-lg last:rounded-t-lg" />;
});

const components = { List, Item };

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
        const [h, setH] = useState(() => Math.min(320, MIN_SIZE * options.length));
        const [open, setOpen] = useState(false);
        const [shadow, setShadow] = useState("");
        const [value, setValue] = useState(defaults);
        const [label, setLabel] = useState(() => options.find((x) => x.value === defaults)?.label ?? defaults);
        const [index, setIndex] = useState<number | null>(null);
        const listRef = useRef<Array<HTMLElement | null>>(emptyRef);
        const removeScrollRef = useRemoveScroll(open, "block-only");
        const innerOptions: AutocompleteItemProps[] =
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

        const list = shadow
            ? fzf(innerOptions, "value", [
                  { key: "value", value: shadow },
                  { key: "label", value: shadow },
              ])
            : innerOptions;

        const setClosed = () => {
            setOpen(false);
            setH(0);
        };

        const displayList = list.filter((x) => x.hidden !== true);

        const pattern = dynamicOption
            ? undefined
            : `^(${options.map((x) => `${safeRegex(x.value)}${x.label ? "|" + safeRegex(x.label) : ""}`).join("|")})$`;

        const { x, y, strategy, refs, context } = useFloating<HTMLInputElement>({
            open,
            transform: true,
            onOpenChange: setOpen,
            placement: "bottom-start",
            whileElementsMounted: autoUpdate,
            middleware: [
                offset(4),
                size({
                    padding: 10,
                    elementContext: "reference",
                    apply(args) {
                        const ul = args.elements.floating.querySelector("ul");
                        const fullSize = ul?.getBoundingClientRect().height || 0;
                        const DEFAULT_SIZE = getRemainingSize(refs.reference!.current as HTMLElement, window.innerHeight);
                        const maxH = Math.min(fullSize < MIN_SIZE ? DEFAULT_SIZE : fullSize, DEFAULT_SIZE, args.availableHeight);
                        const size = displayList.length === 0 ? MIN_SIZE : Math.min(maxH, DEFAULT_SIZE, fullSize);
                        const mw = `${fieldset.current!.getBoundingClientRect().width!}px`;
                        Object.assign(args.elements.floating.style, { width: mw, maxWidth: mw, height: size });
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
                setValue(item?.label ?? props.value);
            }
        }, [props.value]);

        useEffect(() => {
            if (!open) return setH(0);
            const inputRef = refs.reference;
            if (inputRef.current === null) return;
            const s = getRemainingSize(inputRef.current as HTMLElement, window.innerHeight);
            setTimeout(() => setH(Math.min(s, displayList.length * MIN_SIZE)), 100);
        }, [shadow, open, refs.reference]);

        useEffect(() => {
            const input = refs.reference.current as HTMLInputElement;
            if (!input) return;
            return initializeInputDataset(input);
        }, []);

        const onSelect = (opt: AutocompleteItemProps, i: number) => {
            setValue(opt.value);
            const input = refs.reference.current as HTMLInputElement;
            if (!input) return;
            input?.setAttribute("data-value", opt.value);
            input.value = opt.value;
            const event = new Event("change", { bubbles: false, cancelable: true });
            input.dispatchEvent(event);
            if (props.onChange) props.onChange(event as any);
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
            setOpen(true);
            setShadow("");
            (refs.reference.current as HTMLInputElement)?.focus();
        };

        const onFocus = () => {
            setIndex((prev) => (prev === null ? 0 : prev));
            setOpen(true);
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

        const isEmpty = displayList.length === 0;

        return (
            <InputField
                {...(props as any)}
                left={left}
                error={error}
                ref={fieldset}
                form={props.form}
                loading={loading}
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
                        {right}
                        <button type="button" className="p-2 transition-colors link:text-primary md:p-1" onClick={onCaretDownClick}>
                            <ChevronDown size={20} />
                            <span className="sr-only">{translation.inputCaretDown}</span>
                        </button>
                        {value ? (
                            <button type="button" onClick={onClose} className="p-2 transition-colors link:text-danger md:p-1">
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
                        onChange,
                        onFocus,
                        pattern,
                        ref: refs.setReference,
                        name: `${id}-shadow`,
                        id: `${id}-shadow`,
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
                        "group-focus-within:border-primary group-hover:border-primary text-base",
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
                                    ref: mergeRefs(removeScrollRef, refs.setFloating),
                                    style: { ...transitions.styles, left: x, top: y ?? 0, position: strategy },
                                })}
                                initial={false}
                                data-floating="true"
                                animate={{ height: isEmpty ? "auto" : h }}
                                className="isolate z-floating m-0 max-h-80 origin-[top_center] list-none overscroll-contain rounded-b-lg rounded-t-lg border border-floating-border bg-floating-background p-0 text-foreground shadow-floating ease-in-out"
                                onAnimationComplete={() => {
                                    if (!open) return setH(0);
                                    const ul = refs.floating.current as HTMLElement;
                                    const li = ul.querySelectorAll("li").item(0);
                                    const sum = (li ? li.getBoundingClientRect().height : MIN_SIZE) * displayList.length;
                                    return flushSync(() => setH(sum + 2));
                                }}
                            >
                                {isEmpty ? (
                                    <div role="option" className="w-full border-b border-tooltip-border last:border-transparent">
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
                                    components={components as any}
                                    scrollerRef={(e) => void (scroller.current = e as HTMLElement)}
                                    className="max-h-80 overscroll-contain rounded-lg border-floating-border bg-floating-background p-0 text-foreground"
                                    itemContent={(i, option) => {
                                        const Label = (option.Render as React.FC<any>) ?? Frag;
                                        const active = value === option.value || value === option.label;
                                        const selected = index === i;
                                        const children = option.label ?? option.value;
                                        return (
                                            <button
                                                data-value={option.value}
                                                {...getItemProps({
                                                    ref: (node) => void (listRef.current[i] = node) as any,
                                                    role: "option",
                                                    type: "button",
                                                    "aria-checked": active,
                                                    "aria-current": active,
                                                    "aria-selected": active,
                                                    "aria-busy": option.disabled,
                                                    onClick: () => onSelect(option, i),
                                                    className: `cursor-pointer min-h-10 hover:bg-floating-hover w-full p-2 text-left ${active ? "bg-primary-hover text-primary-foreground" : ""} ${selected ? "bg-floating-hover text-floating-foreground" : ""}`,
                                                })}
                                            >
                                                <Label {...props} label={option.label} value={option.value} children={children} />
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
