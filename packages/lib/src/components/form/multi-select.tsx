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
import Fuzzy from "fuzzy-search";
import { ChevronDown, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { forwardRef, Fragment, type PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { type Components, Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { useTranslations } from "../../hooks/use-translations";
import { Dict } from "../../lib/dict";
import { css, initializeInputDataset } from "../../lib/dom";
import { noop } from "../../lib/fns";
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

const Frag = (props: PropsWithChildren) => <Fragment>{props.children}</Fragment>;

const transitionStyles = {
    duration: 300,
    initial: { transform: "scaleY(0)", opacity: 0.2 },
    open: { transform: "scaleY(1)", opacity: 1 },
    close: { transform: "scaleY(0)", opacity: 0 },
} as const;

const fuzzyOptions = { caseSensitive: false, sort: false };

const emptyRef: any[] = [];

const List: Components["List"] = forwardRef(function VirtualList(props, ref) {
    return (
        <motion.ul {...props} ref={ref as any} className="w-full rounded-b-lg border-b border-tooltip-border last:border-transparent">
            <AnimatePresence>{props.children}</AnimatePresence>
        </motion.ul>
    );
});

const Item: Components["List"] = forwardRef(function VirtualItem({ item, context, ...props }: any, ref) {
    return <motion.li {...props} ref={ref as any} className="last:rounded-t-lg" />;
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
        const map = useMemo(() => new Dict(options.map((x) => [x.value, x])), [options]);
        const fieldset = useRef<HTMLFieldSetElement>(null);
        const virtuoso = useRef<VirtuosoHandle | null>(null);
        const defaults = props.value ?? props.defaultValue ?? (emptyRef as string[]);
        const translation = useTranslations();
        const [h, setH] = useState(0);
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
        const deriveValue = useMemo(() => Array.from(value.keys()), [value]);
        const [label, setLabel] = useState<string[]>(() => {
            const d = new Set(defaults);
            return options.reduce<string[]>((acc, x) => (d.has(x.value) ? [...acc, x.label ?? x.value] : acc), []) ?? defaults;
        });
        const [index, setIndex] = useState<number | null>(null);
        const listRef = useRef<Array<HTMLElement | null>>(emptyRef);
        const innerOptions: MultiSelectItemProps[] =
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

        useEffect(() => {
            if (!open) setH(0);
        }, [open]);

        useEffect(() => {
            if (props.value) {
                setValue(new Dict(props.value.map((x) => [x, map.get(x)!])));
            }
        }, [props.value, map]);

        const { x, y, strategy, refs, context } = useFloating<HTMLInputElement>({
            open,
            transform: true,
            strategy: "absolute",
            onOpenChange: setOpen,
            whileElementsMounted: autoUpdate,
            middleware: [
                offset(4),
                size({
                    padding: 10,
                    elementContext: "reference",
                    apply(a) {
                        if (fieldset.current === null) return;
                        const w = fieldset.current.getBoundingClientRect().width;
                        const maxH = 360;
                        flushSync(() => setTimeout(() => setH(maxH), 200));
                        Object.assign(a.elements.floating.style, {
                            width: `${w}px`,
                            maxWidth: `${w}px`,
                            maxHeight: `${maxH}px`,
                            height: `${maxH}px`,
                        });
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
                onNavigate: (n) => setIndex((prev) => n ?? prev),
            }),
        ]);

        useEffect(() => {
            const input = refs.reference.current as HTMLInputElement;
            if (!input) return;
            return initializeInputDataset(input);
        }, []);

        const onSelect = (opt: MultiSelectItemProps, i: number) => {
            const clone = value.clone((c) => {
                if (c.has(opt.value)) return c.remove(opt.value);
                return c.set(opt.value, opt);
            });
            setValue(clone);
            const input = refs.reference.current as HTMLInputElement;
            if (!input) return;
            const options = clone.map((x) => x.value);
            input?.setAttribute("data-value", JSON.stringify(options));
            if (onChangeOptions) onChangeOptions(options);
            setLabel((prev) => prev.concat(opt.label ?? ""));
            setShadow("");
            setIndex(i);
        };

        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setShadow(value);
            if (!open && value === "") return setOpen(true);
            event.target.name = props.name || "";
            return value ? setOpen(true) : undefined;
        };

        const onCaretDownClick = () => {
            setOpen(true);
            setShadow("");
            (refs.reference.current as HTMLInputElement)?.focus();
        };

        const onFocus = () => {
            setOpen(true);
            setShadow("");
        };

        const onClose = () => {
            (refs.reference.current as HTMLInputElement)?.setAttribute("data-value", "[]");
            setShadow("");
            setOpen(false);
            setValue(new Dict());
            onChangeOptions?.([]);
        };

        const id = props.id || props.name;

        const tags = value.map((x, i) => (
            <Tag
                size="small"
                key={`MultiSelect-${x.value}-x`}
                icon={
                    <button type="button" onClick={() => onSelect(x, i)} className="focus:text-danger hover:text-danger text-current">
                        <XIcon size={14} />
                    </button>
                }
            >
                {x.label ?? x.value}
            </Tag>
        ));

        const displayList = list.filter((x) => x.hidden !== true);

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
                        {right}
                        <button type="button" className="transition-colors link:text-primary" onClick={onCaretDownClick}>
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
                <button
                    {...getReferenceProps({
                        ...props,
                        onFocus,
                        id: `${id}-shadow`,
                        name: `${id}-shadow`,
                        ref: refs.setReference,
                    })}
                    type="button"
                    data-name={id}
                    data-target={id}
                    data-shadow="true"
                    data-error={!!error}
                    aria-autocomplete="list"
                    data-value={deriveValue.join(",")}
                    value={open ? shadow : label || value}
                    className={css(
                        "input placeholder-input-mask group h-input-height w-full",
                        "rounded-md bg-transparent px-input-x py-input-y text-foreground",
                        "outline-none transition-colors focus:ring-2 focus:ring-inset focus:ring-primary",
                        "group-error:text-danger group-error:placeholder-input-mask-error",
                        "group-focus-within:border-primary group-hover:border-primary",
                        "flex flex-row items-center gap-2 whitespace-nowrap text-left",
                        "max-w-full overflow-x-auto truncate overflow-ellipsis",
                        props.className
                    )}
                >
                    <OverflowControl label={selectedLabel}>{tags}</OverflowControl>
                </button>
                <input
                    id={id}
                    name={id}
                    type="hidden"
                    data-origin={id}
                    ref={externalRef}
                    required={required}
                    defaultValue={props.value || deriveValue || undefined}
                />
                <FloatingPortal preserveTabOrder>
                    {open ? (
                        <FloatingFocusManager modal guards returnFocus={false} context={context} initialFocus={-1} visuallyHiddenDismiss>
                            <div
                                {...getFloatingProps({
                                    ref: refs.setFloating,
                                    style: {
                                        ...transitions.styles,
                                        position: strategy,
                                        left: (x ?? 0) + (!!value ? 26 : 18),
                                        top: y ?? 0,
                                    },
                                })}
                                data-floating="true"
                                className="isolate z-floating m-0 w-full origin-[top_center] list-none overscroll-contain rounded-b-lg rounded-t-lg border border-floating-border bg-floating-background p-0 text-foreground shadow-floating"
                            >
                                <input
                                    autoFocus
                                    value={shadow}
                                    onChange={onChange}
                                    title={props.title}
                                    placeholder={translation.multiSelectInnerPlaceholder}
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
                                            return setOpen(false);
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
                                    className="input placeholder-input-mask group mb-1 h-10 w-full flex-1 border-b border-input-border bg-transparent px-input-x py-input-y outline-none transition-colors focus:ring-2 focus:ring-inset focus:ring-primary"
                                />
                                {displayList.length === 0 ? (
                                    <li role="option" className="w-full border-b border-tooltip-border last:border-transparent">
                                        <span className="flex w-full justify-between p-2 text-left text-disabled">
                                            {emptyMessage || translation.autocompleteEmpty}
                                        </span>
                                    </li>
                                ) : null}
                                <Virtuoso
                                    ref={virtuoso}
                                    data={displayList}
                                    components={components as any}
                                    hidden={displayList.length === 0}
                                    style={{ height: value.size === 0 ? h - 49 : h - 86 }}
                                    className="border-floating-border bg-floating-background p-0 text-foreground"
                                    itemContent={(i, option) => {
                                        const Label = (option.Render as React.FC<any>) ?? Frag;
                                        const active = value.has(option.value) || value.has(option.label ?? "");
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
                                                <Label {...props} label={option.label} value={option.value} children={children} />
                                            </button>
                                        );
                                    }}
                                />
                                {value.size === 0 ? null : (
                                    <div className="sticky bottom-0 flex w-full flex-nowrap items-center gap-2 overflow-x-auto rounded-b-lg bg-floating-background p-2">
                                        {tags}
                                    </div>
                                )}
                            </div>
                        </FloatingFocusManager>
                    ) : null}
                </FloatingPortal>
            </InputField>
        );
    }
);
