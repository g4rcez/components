"use client";
import {
    autoPlacement,
    autoUpdate,
    FloatingFocusManager,
    FloatingOverlay,
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
import { CaretDownIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import React, { forwardRef, Fragment, type PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { type Components, type ContextProp, type ItemProps, type ListProps, Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { useRemoveScroll } from "../../hooks/use-remove-scroll";
import { useTranslations } from "../../hooks/use-translations";
import { Dict } from "../../lib/dict";
import { css, getRemainingSize, initializeInputDataset } from "../../lib/dom";
import { noop } from "../../lib/fns";
import { fzf } from "../../lib/fzf";
import { Label, Override } from "../../types";
import { Tag } from "../core/tag";
import { Checkbox } from "./checkbox";
import { InputField, InputFieldProps } from "./input-field";
import { type OptionProps } from "./select";

export type MultiSelectItemProps = OptionProps & { Render?: React.FC<OptionProps> };

export type MultiSelectProps = Override<
    InputFieldProps<"input">,
    {
        title?: string;
        value?: string[];
        emptyMessage?: Label;
        selectedLabel?: string;
        defaultValue?: string[];
        dynamicOption?: boolean;
        options: MultiSelectItemProps[];
        onChangeOptions?: (options: string[]) => void;
    }
>;

const MIN_SIZE = 40;

const Frag = (props: PropsWithChildren) => <Fragment>{props.children}</Fragment>;

const transitionStyles = {
    duration: 200,
    initial: { transform: "scaleY(0)", opacity: 0.2 },
    open: { transform: "scaleY(1)", opacity: 1 },
    close: { transform: "scaleY(0)", opacity: 0 },
} as const;

const EMPTY_NODES: Array<HTMLElement | null> = [];
const EMPTY_VALUES: string[] = [];

const List = forwardRef(function VirtualItem(
    { item, context, ...props }: Record<string, never>,
    ref
) {
    return <motion.li {...props} ref={ref as never} className="last:rounded-t-lg" />;
});

const Item = forwardRef<HTMLLIElement, ItemProps<MultiSelectItemProps> & ContextProp<unknown>>(function VirtualList({ context, ...props }, ref) {
    return (
        <motion.ul {...props} role="listbox" ref={ref as never} className="w-full rounded-b-lg border-b border-tooltip-border last:border-transparent">
            <AnimatePresence>{props.children}</AnimatePresence>
        </motion.ul>
    );
});

const components = { List, Item };

const OverflowControl = (props: PropsWithChildren<{ label?: string }>) => {
    const translate = useTranslations();
    const ref = useRef<HTMLSpanElement>(null);
    const countable = React.Children.count(props.children);
    const [normalView, setNormalView] = useState(false);

    useEffect(() => {
        if (ref.current === null) return;
        const parent = ref.current.parentElement!.getBoundingClientRect();
        const items = Array.from(ref.current.querySelectorAll("[data-component='tag']"));
        const child = items.reduce((acc, el) => acc + el.getBoundingClientRect().width, 0);
        const hasOnlyCounter = ref.current.querySelectorAll("[data-multicounter]").length;
        if (hasOnlyCounter && countable <= 3) return setNormalView(false);
        if (child > parent.width) return setNormalView(true);
    }, [countable]);

    return (
        <span ref={ref} className="flex flex-nowrap gap-x-2">
            {!normalView ? (
                props.children
            ) : (
                <Tag size="small" data-multicounter="true">
                    {countable} {translate.multiSelectSelectedLabel}
                </Tag>
            )}
        </span>
    );
};

export const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(
    (
        {
            left,
            error,
            right,
            options,
            container,
            rightLabel,
            interactive,
            emptyMessage,
            optionalText,
            selectedLabel,
            labelClassName,
            feedback = null,
            hideLeft = false,
            required = false,
            dynamicOption = false,
            onChangeOptions,
            ...props
        }: MultiSelectProps,
        externalRef
    ) => {
        const scroller = useRef<HTMLElement | null>(null);
        const map = useMemo(() => new Dict(options.map((x) => [x.value, x])), [options]);
        const fieldset = useRef<HTMLFieldSetElement>(null);
        const virtuoso = useRef<VirtuosoHandle | null>(null);
        const defaults = props.value ?? props.defaultValue ?? EMPTY_VALUES;
        const translation = useTranslations();
        const [open, setOpen] = useState(false);
        const [shadow, setShadow] = useState("");
        const [value, setValue] = useState<Dict<string, MultiSelectItemProps>>(() => {
            const d = new Dict<string, MultiSelectItemProps>();
            defaults.forEach((x) => {
                const result = map.get(x);
                return result ? d.set(x, result) : undefined;
            });
            return d;
        });
        const [label, setLabel] = useState<string[]>(() => {
            const d = new Set(defaults);
            return options.reduce<string[]>((acc, x) => (d.has(x.value) ? [...acc, x.label ?? x.value] : acc), []) ?? defaults;
        });
        const [index, setIndex] = useState<number | null>(null);
        const listRef = useRef<Array<HTMLElement | null>>(EMPTY_NODES);
        const [, tick] = useState(0);
        const [h, setH] = useState(() => Math.min(320, MIN_SIZE * options.length));
        const removeScrollRef = useRemoveScroll<HTMLElement>(open, "block-only");

        const innerOptions = useMemo<MultiSelectItemProps[]>(
            () => (dynamicOption && shadow !== "" ? [{ value: shadow, label: shadow, "data-dynamic": "true" }, ...options] : options),
            [dynamicOption, shadow, options]
        );

        const list = useMemo(
            () =>
                shadow.length === 0
                    ? innerOptions
                    : fzf(innerOptions, "value", [
                          { key: "value", value: shadow },
                          { key: "label", value: shadow },
                      ]),
            [innerOptions, shadow]
        );

        const displayList = useMemo(() => list.filter((x) => x.hidden !== true), [list]);

        const values = useMemo(() => Array.from(value.keys()), [value]);

        const isEmpty = displayList.length === 0;

        const openDropdown = () => flushSync(() => setOpen(true));

        const setClosed = () => {
            setOpen(false);
            setH(0);
        };

        const { x, y, strategy, refs, context, placement } = useFloating<HTMLInputElement>({
            open,
            transform: true,
            placement: "bottom-start",
            strategy: "absolute",
            onOpenChange: setOpen,
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

        const isTopPlacement = placement === "top" || placement === "top-start";

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
                onNavigate: (n) => setIndex((prev) => n ?? prev),
            }),
        ]);

        useEffect(() => {
            if (props.value) {
                setValue(new Dict(props.value.map((x) => [x, map.get(x)!])));
            }
        }, [props.value, map]);

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

        const onSelect = (opt: MultiSelectItemProps, i: number) => {
            const clone = value.clone((c) => {
                if (c.has(opt.value)) return c.remove(opt.value);
                return c.set(opt.value, opt);
            });
            setValue(clone);
            const input = refs.reference.current as HTMLInputElement;
            if (!input) return;
            const opts = clone.map((x) => x.value);
            input?.setAttribute("data-value", JSON.stringify(opts));
            if (onChangeOptions) onChangeOptions(opts);
            setLabel((prev) => prev.concat(opt.label ?? ""));
            setShadow("");
            setIndex(i);
        };

        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const v = event.target.value;
            setShadow(v);
            if (!open && v === "") return setOpen(true);
            event.target.name = props.name || "";
            return v ? setOpen(true) : undefined;
        };

        const onCaretDownClick = () => {
            openDropdown();
            setShadow("");
            (refs.reference.current as HTMLInputElement)?.focus();
        };

        const onFocus = () => {
            openDropdown();
            setShadow("");
        };

        const onClose = () => {
            (refs.reference.current as HTMLInputElement)?.setAttribute("data-value", "[]");
            setShadow("");
            setValue(new Dict());
            onChangeOptions?.([]);
            setClosed();
        };

        const id = props.id || props.name;

        const tags = value.map((x, i) => (
            <Tag
                size="small"
                key={`MultiSelect-${x.value}-x`}
                icon={
                    <button
                        type="button"
                        aria-label={`Remove ${x.label ?? x.value}`}
                        className="text-current hover:text-danger focus:text-danger"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelect(x, i);
                        }}
                    >
                        <XIcon size={14} aria-hidden="true" />
                    </button>
                }
            >
                {x.label ?? x.value}
            </Tag>
        ));

        return (
            <InputField
                {...props}
                left={left}
                error={error}
                ref={fieldset as never}
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
                        {right}
                        <button type="button" className="transition-colors link:text-primary" onClick={onCaretDownClick}>
                            <CaretDownIcon size={20} />
                            <span className="sr-only">{translation.inputCaretDown}</span>
                        </button>
                        {value ? (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label={translation.inputCloseValue}
                                className="transition-colors link:text-danger"
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
                <ul
                    {...getReferenceProps({
                        ...props,
                        onFocus,
                        id: `${id}-shadow`,
                        name: `${id}-shadow`,
                        ref: refs.setReference,
                    } as React.HTMLProps<HTMLElement>)}
                    tabIndex={0}
                    role="button"
                    data-name={id}
                    data-target={id}
                    data-shadow="true"
                    data-error={!!error}
                    aria-autocomplete="list"
                    data-value={values.join(",")}
                    className={css(
                        "input placeholder-input-mask group h-input-height w-full text-base",
                        "rounded-md bg-transparent px-input-x py-input-y text-foreground",
                        "outline-none transition-colors focus:ring-2 focus:ring-inset focus:ring-primary",
                        "group-error:text-danger group-error:placeholder-input-mask-error",
                        "group-focus-within:border-primary group-hover:border-primary",
                        "flex flex-row items-center gap-2 whitespace-nowrap text-left",
                        "max-w-full overflow-x-auto truncate overflow-ellipsis",
                        props.className
                    )}
                >
                    {values.length > 0 ? null : <li className="text-input-placeholder">{props.placeholder}</li>}
                    <OverflowControl label={selectedLabel}>{tags}</OverflowControl>
                </ul>
                <input
                    id={id}
                    name={id}
                    type="hidden"
                    data-origin={id}
                    ref={externalRef}
                    required={required}
                    defaultValue={props.value || values || undefined}
                />
                <FloatingPortal preserveTabOrder>
                    {open ? (
                        <FloatingOverlay lockScroll className="z-floating">
                            <FloatingFocusManager modal guards returnFocus={false} context={context} initialFocus={-1} visuallyHiddenDismiss>
                                <div
                                    {...getFloatingProps({
                                        ref: refs.setFloating,
                                        style: {
                                            ...transitions.styles,
                                            left: x,
                                            top: y ?? 0,
                                            position: strategy,
                                        },
                                    })}
                                    data-floating="true"
                                    className={css(
                                        "relative shadow-floating overflow-clip isolate z-floating m-0 max-h-96 list-none overscroll-contain rounded-b-lg rounded-t-lg border border-floating-border bg-floating-background p-0 text-foreground ease-in-out",
                                        isTopPlacement ? "origin-[bottom_center]" : "origin-[top_center]"
                                    )}
                                >
                                    <input
                                        autoFocus
                                        value={shadow}
                                        onChange={onChange}
                                        title={props.title}
                                        placeholder={translation.multiSelectInnerPlaceholder}
                                        className="input placeholder-input-mask group mb-1 h-10 w-full flex-1 rounded-none border-b border-input-border bg-transparent px-input-x py-input-y outline-none transition-colors focus:border-primary"
                                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (event.key === "ArrowDown") {
                                                let next = index! + 1;
                                                if (next > displayList.length - 1) next = 0;
                                                virtuoso.current?.scrollIntoView({ index: next });
                                                return setIndex(next);
                                            }
                                            if (event.key === "ArrowUp") {
                                                let next = index! - 1;
                                                if (next < 0) next = displayList.length - 1;
                                                virtuoso.current?.scrollIntoView({ index: next });
                                                return setIndex(next);
                                            }
                                            if (event.key === "Escape") {
                                                event.currentTarget.blur();
                                                return setClosed();
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
                                        }}
                                    />
                                    {isEmpty ? (
                                        <li className="w-full border-b border-tooltip-border last:border-transparent">
                                            <span className="flex w-full justify-between p-2 text-left text-disabled">
                                                {emptyMessage || translation.autocompleteEmpty}
                                            </span>
                                        </li>
                                    ) : null}
                                    {isEmpty ? null : (
                                        <motion.div
                                            initial={false}
                                            animate={{ height: isEmpty ? "auto" : h }}
                                            className="max-h-72 w-full overscroll-contain"
                                            onAnimationComplete={() => {
                                                if (!open) {
                                                    setH(0);
                                                    return;
                                                }
                                                const li = refs.floating.current?.querySelector("li");
                                                const sum = (li?.getBoundingClientRect().height ?? MIN_SIZE) * displayList.length;
                                                flushSync(() => setH(Math.min(320, sum + 2)));
                                            }}
                                        >
                                            <Virtuoso
                                                overscan={40}
                                                ref={virtuoso}
                                                hidden={isEmpty}
                                                data={displayList}
                                                style={{ height: h }}
                                                defaultItemHeight={MIN_SIZE}
                                                components={components as never}
                                                totalListHeightChanged={(totalHeight) => setH(Math.min(320, totalHeight))}
                                                scrollerRef={(e) => {
                                                    scroller.current = e as HTMLElement;
                                                    removeScrollRef.current = e as HTMLElement;
                                                }}
                                                className="max-h-72 border-floating-border bg-floating-background p-0 text-foreground"
                                                itemContent={(i, option) => {
                                                    const Label = option.Render ?? Frag;
                                                    const active = value.has(option.value) || value.has(option.label ?? "");
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
                                                            })}
                                                            className={`flex w-full max-w-full cursor-pointer items-center justify-start p-2 text-left hover:bg-floating-hover focus:bg-floating-hover ${active || selected ? "bg-floating-hover text-floating-foreground" : ""}`}
                                                        >
                                                            <Checkbox
                                                                onChange={noop}
                                                                checked={active}
                                                                aria-checked={active}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onSelect(option, i);
                                                                }}
                                                            />
                                                            <Label {...option} label={option.label} value={option.value}>
                                                                {children}
                                                            </Label>
                                                        </button>
                                                    );
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                    <div className="sticky bottom-0 flex w-full flex-nowrap items-center gap-2 overflow-x-auto rounded-b-lg bg-floating-background p-2">
                                        {value.size === 0 ? (
                                            <Tag theme="muted" size="small">
                                                {translation.autocompleteEmpty}
                                            </Tag>
                                        ) : (
                                            tags
                                        )}
                                    </div>
                                </div>
                            </FloatingFocusManager>
                        </FloatingOverlay>
                    ) : null}
                </FloatingPortal>
            </InputField>
        );
    }
);
