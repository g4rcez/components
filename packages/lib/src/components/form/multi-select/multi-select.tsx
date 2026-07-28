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
    useTransitionStyles,
} from "@floating-ui/react";
import { CaretDownIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import React, { forwardRef, Fragment, type PropsWithChildren, useEffect, useId, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { type ContextProp, type ItemProps, type ListProps, Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { useRemoveScroll } from "../../../hooks/use-remove-scroll";
import { useTranslations } from "../../../hooks/use-translations";
import { Dict } from "../../../lib/dict";
import { css, getRemainingSize, initializeInputDataset } from "../../../lib/dom";
import { fzf } from "../../../lib/fzf";
import type { Label, Override } from "../../../types";
import { Tag } from "../../core/tag/tag";
import { Checkbox } from "../checkbox/checkbox";
import { freeTextStyles } from "../input/free-text.styles";
import { InputField, type InputFieldProps } from "../input/input-field";
import type { OptionProps } from "../select/select";
import { multiSelectStyles } from "./multi-select.styles";

export type MultiSelectItemProps = OptionProps & {
    Render?: React.FC<OptionProps>;
};

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
        renderTag?: (option: MultiSelectItemProps) => React.ReactNode;
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

const List = forwardRef<HTMLDivElement, ListProps & ContextProp<{ listboxId?: string }>>(function VirtualList({ context, ...props }, ref) {
    return <motion.div {...props} id={context?.listboxId} ref={ref} role="listbox" className={multiSelectStyles.slots.list} />;
});

const Item = forwardRef<HTMLDivElement, ItemProps<MultiSelectItemProps> & ContextProp<unknown>>(function VirtualList(
    { context: _context, ...props },
    ref
) {
    return (
        <motion.div {...props} ref={ref as never} role="presentation" className={multiSelectStyles.slots.item}>
            <AnimatePresence>{props.children}</AnimatePresence>
        </motion.div>
    );
});

const components = { List, Item };

const OverflowControl = (props: PropsWithChildren<{ label?: string; tagSize: "small" | "tiny" }>) => {
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
        <span ref={ref} className={css(multiSelectStyles.slots.tags, `${multiSelectStyles.slots.tags}--row`)}>
            {!normalView ? (
                props.children
            ) : (
                <Tag size={props.tagSize} data-multicounter="true">
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
            size: fieldSize = "normal",
            required = false,
            dynamicOption = false,
            onChangeOptions,
            renderTag,
            ...props
        }: MultiSelectProps,
        externalRef
    ) => {
        const scroller = useRef<HTMLElement | null>(null);
        const map = useMemo(() => new Dict(options.map((x) => [x.value, x])), [options]);
        const fieldset = useRef<HTMLFieldSetElement>(null);
        const virtuoso = useRef<VirtuosoHandle | null>(null);
        const searchInputRef = useRef<HTMLInputElement>(null);
        const defaults = props.value ?? props.defaultValue ?? EMPTY_VALUES;
        const translation = useTranslations();
        const generatedId = useId();
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
        const [_label, setLabel] = useState<string[]>(() => {
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
                autoPlacement({
                    allowedPlacements: ["top-start", "bottom-start"],
                    alignment: "start",
                }),
                size({
                    padding: 10,
                    elementContext: "reference",
                    apply(args) {
                        const DEFAULT_SIZE = getRemainingSize(refs.reference!.current as HTMLElement, window.innerHeight);
                        const mw = `${fieldset.current?.getBoundingClientRect().width || DEFAULT_SIZE}px`;
                        Object.assign(args.elements.floating.style, {
                            width: mw,
                            maxWidth: mw,
                        });
                    },
                }),
            ],
        });

        const isTopPlacement = placement === "top" || placement === "top-start";

        const transitions = useTransitionStyles(context, transitionStyles);

        const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
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
        }, [refs.reference]);

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
            searchInputRef.current?.focus();
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

        const id = props.id || props.name || generatedId;
        const shadowId = `${id}-shadow`;
        const listboxId = `${shadowId}-listbox`;
        const activeOptionId = open && index !== null && displayList[index] ? `${shadowId}-option-${index}` : undefined;
        const describedBy =
            [props["aria-describedby"], feedback ? `${id}-feedback` : undefined, error ? `${id}-error` : undefined].filter(Boolean).join(" ") ||
            undefined;

        const panelTopClass = `${multiSelectStyles.slots.panel}--top`;
        const panelBottomClass = `${multiSelectStyles.slots.panel}--bottom`;
        const optionSelectedClass = `${multiSelectStyles.slots.option}--selected`;
        const tagSize = fieldSize === "small" ? "tiny" : "small";

        const tags = value.map((x, i) => (
            <Tag
                size={tagSize}
                key={`MultiSelect-${x.value}-x`}
                icon={
                    <button
                        type="button"
                        aria-label={`Remove ${x.label ?? x.value}`}
                        className={multiSelectStyles.slots["tag-remove"]}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelect(x, i);
                        }}
                    >
                        <XIcon aria-hidden="true" className={multiSelectStyles.slots["tag-remove-icon"]} />
                    </button>
                }
            >
                {renderTag ? renderTag(x) : (x.label ?? x.value)}
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
                container={css(container, multiSelectStyles.className({ size: fieldSize }), multiSelectStyles.slots.field)}
                rightLabel={rightLabel}
                interactive={interactive}
                id={id}
                size={fieldSize}
                optionalText={optionalText}
                componentName="multi-select"
                labelClassName={labelClassName}
                placeholder={props.placeholder}
                right={
                    <span className={multiSelectStyles.slots.actions}>
                        {right}
                        <button
                            type="button"
                            className={css("link:text-primary", multiSelectStyles.className({ size: fieldSize }), multiSelectStyles.slots.action)}
                            onClick={onCaretDownClick}
                        >
                            <CaretDownIcon aria-hidden="true" className={multiSelectStyles.slots["caret-icon"]} />
                            <span className={multiSelectStyles.slots["sr-label"]}>{translation.inputCaretDown}</span>
                        </button>
                        {value ? (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label={translation.inputCloseValue}
                                className={css("link:text-danger", multiSelectStyles.className({ size: fieldSize }), multiSelectStyles.slots.action)}
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
                <div
                    {...getReferenceProps({
                        ...props,
                        tabIndex: open ? -1 : 0,
                        onFocus,
                        onClick: (event: React.MouseEvent<HTMLInputElement>) => {
                            props.onClick?.(event);
                            onFocus();
                        },
                        id: shadowId,
                        role: open ? "presentation" : "combobox",
                        name: shadowId,
                        ref: refs.setReference,
                        "aria-expanded": open,
                        "aria-haspopup": "listbox",
                        "aria-controls": listboxId,
                        "aria-activedescendant": activeOptionId,
                        "aria-labelledby": `${id}-label`,
                        "aria-invalid": error ? true : props["aria-invalid"],
                        "aria-describedby": describedBy,
                    } as Parameters<typeof getReferenceProps>[0])}
                    data-name={id}
                    data-target={id}
                    data-shadow="true"
                    data-error={!!error}
                    data-value={values.join(",")}
                    className={css(
                        "input",
                        multiSelectStyles.className({ size: fieldSize }),
                        multiSelectStyles.slots.input,
                        multiSelectStyles.slots.placeholder,
                        multiSelectStyles.slots.surface,
                        multiSelectStyles.slots.transition,
                        multiSelectStyles.slots.invalid,
                        freeTextStyles.className({ size: fieldSize }),
                        freeTextStyles.slots.input,
                        freeTextStyles.slots.surface,
                        freeTextStyles.slots.transition,
                        freeTextStyles.slots.placeholder,
                        freeTextStyles.slots.invalid,
                        multiSelectStyles.slots["control-state"],
                        multiSelectStyles.slots.value,
                        `${multiSelectStyles.slots.value}--row`,
                        multiSelectStyles.slots.overflow,
                        props.className
                    )}
                >
                    {values.length > 0 ? null : <span className={multiSelectStyles.slots["placeholder-text"]}>{props.placeholder}</span>}
                    <OverflowControl label={selectedLabel} tagSize={tagSize}>
                        {tags}
                    </OverflowControl>
                </div>
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
                        <FloatingOverlay lockScroll className={multiSelectStyles.slots.overlay}>
                            <FloatingFocusManager
                                modal
                                guards
                                returnFocus={false}
                                context={context}
                                initialFocus={searchInputRef}
                                visuallyHiddenDismiss
                            >
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
                                        multiSelectStyles.className({ size: fieldSize }),
                                        multiSelectStyles.slots.panel,
                                        isTopPlacement ? panelTopClass : panelBottomClass
                                    )}
                                >
                                    <input
                                        ref={searchInputRef}
                                        value={shadow}
                                        onChange={onChange}
                                        title={props.title}
                                        role="combobox"
                                        aria-autocomplete="list"
                                        aria-expanded={open}
                                        aria-haspopup="listbox"
                                        aria-controls={listboxId}
                                        aria-activedescendant={activeOptionId}
                                        aria-labelledby={`${id}-label`}
                                        aria-invalid={error ? true : props["aria-invalid"]}
                                        aria-describedby={describedBy}
                                        autoComplete="off"
                                        placeholder={translation.multiSelectInnerPlaceholder}
                                        className={css(
                                            "input",
                                            multiSelectStyles.className({ size: fieldSize }),
                                            multiSelectStyles.slots.search,
                                            multiSelectStyles.slots.placeholder,
                                            freeTextStyles.className({ size: fieldSize }),
                                            freeTextStyles.slots.input,
                                            freeTextStyles.slots.surface,
                                            freeTextStyles.slots.transition,
                                            freeTextStyles.slots.placeholder,
                                            freeTextStyles.slots["input-state"]
                                        )}
                                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (event.key === "ArrowDown") {
                                                event.preventDefault();
                                                let next = index === null ? 0 : index + 1;
                                                if (next > displayList.length - 1) next = 0;
                                                virtuoso.current?.scrollIntoView({ index: next });
                                                return setIndex(next);
                                            }
                                            if (event.key === "ArrowUp") {
                                                event.preventDefault();
                                                let next = index === null ? displayList.length - 1 : index - 1;
                                                if (next < 0) next = displayList.length - 1;
                                                virtuoso.current?.scrollIntoView({ index: next });
                                                return setIndex(next);
                                            }
                                            if (event.key === "Escape") {
                                                event.preventDefault();
                                                return setClosed();
                                            }
                                            if (event.key === "Enter" || event.key === " " || event.code === "Space") {
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
                                        <li className={multiSelectStyles.slots.empty}>
                                            <span className={multiSelectStyles.slots["empty-text"]}>
                                                {emptyMessage || translation.autocompleteEmpty}
                                            </span>
                                        </li>
                                    ) : null}
                                    {isEmpty ? null : (
                                        <motion.div
                                            initial={false}
                                            animate={{ height: isEmpty ? "auto" : h }}
                                            className={multiSelectStyles.slots.results}
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
                                                context={{ listboxId }}
                                                style={{ height: h }}
                                                initialItemCount={displayList.length}
                                                defaultItemHeight={MIN_SIZE}
                                                components={components as never}
                                                totalListHeightChanged={(totalHeight) => setH(Math.min(320, totalHeight))}
                                                scrollerRef={(e) => {
                                                    scroller.current = e as HTMLElement;
                                                    removeScrollRef.current = e as HTMLElement;
                                                }}
                                                className={multiSelectStyles.slots.scroll}
                                                itemContent={(i, option) => {
                                                    const Label = option.Render ?? Frag;
                                                    const active = value.has(option.value) || value.has(option.label ?? "");
                                                    const selected = index === i;
                                                    const children = option.label ?? option.value;
                                                    return (
                                                        <div
                                                            id={`${shadowId}-option-${i}`}
                                                            data-value={option.value}
                                                            {...getItemProps({
                                                                ref: (node: HTMLElement | null) => {
                                                                    listRef.current[i] = node;
                                                                },
                                                                role: "option",
                                                                "aria-selected": active,
                                                                "aria-disabled": option.disabled,
                                                                tabIndex: -1,
                                                                onClick: () => {
                                                                    if (!option.disabled) onSelect(option, i);
                                                                },
                                                            })}
                                                            className={css(
                                                                multiSelectStyles.slots.option,
                                                                active || selected ? optionSelectedClass : ""
                                                            )}
                                                        >
                                                            <Checkbox
                                                                checked={active}
                                                                readOnly
                                                                inert
                                                                aria-hidden="true"
                                                                container={multiSelectStyles.slots.checkbox}
                                                            />
                                                            <Label {...option} label={option.label} value={option.value}>
                                                                {children}
                                                            </Label>
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                    <div className={css(multiSelectStyles.slots.footer, `${multiSelectStyles.slots.tags}--row`)}>
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
