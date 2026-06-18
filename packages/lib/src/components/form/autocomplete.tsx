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
    useTransitionStyles,
} from "@floating-ui/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { forwardRef, Fragment, type PropsWithChildren, type Ref, useEffect, useId, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { type ContextProp, type ItemProps, type ListProps, Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { Is } from "sidekicker";
import { useRemoveScroll } from "../../hooks/use-remove-scroll";
import { useTranslations } from "../../hooks/use-translations";
import { css, dispatchInput, getRemainingSize, initializeInputDataset, synthesizeChangeEvent } from "../../lib/dom";
import { safeRegex } from "../../lib/fns";
import { fzf } from "../../lib/fzf";
import type { Label } from "../../types";
import { InputField, type InputFieldProps } from "./input-field";
import type { OptionProps } from "./select";

export type AutocompleteItemProps = OptionProps & {
    Render?: React.FC<OptionProps>;
};

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

const List = forwardRef<HTMLDivElement, ListProps & ContextProp<{ listboxId?: string }>>(function VirtualList({ context, ...props }, ref) {
    return (
        <motion.div {...props} ref={ref} role="listbox" id={context?.listboxId} className="__autocomplete__list">
            <AnimatePresence>{props.children}</AnimatePresence>
        </motion.div>
    );
});

const Item = forwardRef<HTMLDivElement, ItemProps<AutocompleteItemProps> & ContextProp<unknown>>(function VirtualItem(
    { item: _item, context: _context, ...props },
    ref
) {
    return <motion.div {...props} ref={ref} role="presentation" className="__autocomplete__item" />;
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
        const hiddenInput = useRef<HTMLInputElement | null>(null);
        const suppressNextFocusOpen = useRef(false);
        const virtuoso = useRef<VirtuosoHandle | null>(null);
        const defaults = props.value ?? props.defaultValue ?? "";
        const translation = useTranslations();
        const generatedId = useId();
        const isControlled = props.value !== undefined;
        const [open, setOpen] = useState(false);
        const [insideModal, setInsideModal] = useState(false);
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

        useEffect(() => {
            if (!props.disabled) return;
            setOpen(false);
            setH(0);
        }, [props.disabled]);

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
            }),
        ]);

        useEffect(() => {
            if (!isControlled) return;
            const nextValue = props.value ?? "";
            const item = options.find((x) => x.value === nextValue);
            setLabel(item?.label ?? nextValue);
            setValue(nextValue);
            if (hiddenInput.current) hiddenInput.current.value = nextValue;
        }, [isControlled, props.value, options]);

        useEffect(() => {
            const input = refs.reference.current as HTMLInputElement;
            if (!input) return;
            return initializeInputDataset(input);
        }, [refs.reference]);

        useEffect(() => {
            if (!open) return;
            setInsideModal(Boolean(fieldset.current?.closest('[data-component="modal"]')));
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
            const origin = hiddenInput.current ?? input;
            if (!input || !origin) return;
            input.setAttribute("data-value", opt.value);
            input.value = opt.value;
            origin.value = opt.value;
            origin.setAttribute("data-value", opt.value);
            const event = new Event("change", { bubbles: false, cancelable: true });
            origin.dispatchEvent(event);
            if (props.onChange) props.onChange(synthesizeChangeEvent(origin));
            setLabel(opt.label ?? opt.value);
            setClosed();
            setShadow("");
            setIndex(i);
            suppressNextFocusOpen.current = true;
            requestAnimationFrame(() => {
                if (input.isConnected) input.focus();
                requestAnimationFrame(() => {
                    suppressNextFocusOpen.current = false;
                });
            });
        };

        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setShadow(value);
            if (!open && value === "") return setOpen(true);
            event.target.name = props.name || "";
            return value ? setOpen(true) : props.onChange?.(event);
        };

        const onCaretDownClick = () => {
            if (props.disabled) return;
            openDropdown();
            setShadow("");
            (refs.reference.current as HTMLInputElement)?.focus();
        };

        const onFocus = () => {
            if (props.disabled) return;
            if (suppressNextFocusOpen.current) {
                suppressNextFocusOpen.current = false;
                return;
            }
            setIndex((prev) => (prev === null ? 0 : prev));
            openDropdown();
            setShadow("");
        };

        const onClose = () => {
            if (props.disabled) return;
            const input = refs.reference.current as HTMLInputElement;
            const origin = hiddenInput.current ?? input;
            input?.setAttribute("data-value", "");
            if (input) input.value = "";
            if (origin) {
                origin.value = "";
                origin.setAttribute("data-value", "");
            }
            setShadow("");
            setValue("");
            setLabel("");
            dispatchInput(origin);
            setClosed();
        };

        const id = props.id || props.name || generatedId;

        const shadowId = `${id}-shadow`;
        const listboxId = `${shadowId}-listbox`;

        const isEmpty = displayList.length === 0;

        const isTopPlacement = placement === "top" || placement === "top-start";

        const activeOptionId = open && index !== null && displayList[index] ? `${shadowId}-option-${index}` : undefined;

        const setScrollElement = (node: HTMLElement | null) => {
            scroller.current = node;
            removeScrollRef.current = node;
        };

        const scrollOptionIntoView = (next: number) => {
            if (insideModal) {
                listRef.current[next]?.scrollIntoView({ block: "nearest" });
                return;
            }
            virtuoso.current?.scrollIntoView({ index: next });
        };

        const renderOption = (i: number, option: AutocompleteItemProps) => {
            const Label = option.Render ?? Frag;
            const active = value === option.value || value === option.label;
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
                        className: css(
                            "__autocomplete__option",
                            active ? "__autocomplete__option-active" : "",
                            selected ? "__autocomplete__option-selected" : ""
                        ),
                    })}
                >
                    <Label {...option} ref={undefined} label={option.label} value={option.value}>
                        {children}
                    </Label>
                </div>
            );
        };

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
                labelClassName={css(
                    !props.disabled && "__autocomplete__field-state",
                    props.disabled && "__form-autocomplete__disabled-border",
                    labelClassName
                )}
                placeholder={props.placeholder}
                ref={fieldset as unknown as Ref<HTMLInputElement>}
                feedback={open && isTopPlacement ? props.title : feedback}
                right={
                    <span className="__autocomplete__actions">
                        {right}
                        <button
                            type="button"
                            disabled={props.disabled}
                            className={css("__autocomplete__action", !props.disabled && "link:text-primary")}
                            onClick={onCaretDownClick}
                        >
                            <CaretDownIcon aria-hidden="true" className="__autocomplete__caret-icon" />
                            <span className="__autocomplete__sr-label">{translation.inputCaretDown}</span>
                        </button>
                        {value ? (
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={props.disabled}
                                aria-label={translation.inputCloseValue}
                                className={css("__autocomplete__action", !props.disabled && "link:text-danger")}
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
                            props.onKeyDown?.(event);
                            if (event.defaultPrevented) return;
                            if (event.key === "Escape") {
                                event.preventDefault();
                                return setClosed();
                            }
                            if (!open) return;
                            if (event.key === "ArrowDown") {
                                event.preventDefault();
                                let next = Is.number(index) ? index + 1 : 0;
                                if (next > displayList.length - 1) next = 0;
                                scrollOptionIntoView(next);
                                return setIndex(next);
                            }
                            if (event.key === "ArrowUp") {
                                event.preventDefault();
                                let next = Is.number(index) ? index! - 1 : displayList.length - 1;
                                if (next < 0) next = displayList.length - 1;
                                scrollOptionIntoView(next);
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
                    value={open ? shadow : options.length === 0 ? "" : label || value}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    aria-controls={listboxId}
                    aria-activedescendant={activeOptionId}
                    aria-labelledby={`${shadowId}-label`}
                    autoComplete="off"
                    className={css(
                        "input __autocomplete __autocomplete__input __autocomplete__placeholder",
                        "__autocomplete__surface",
                        "__autocomplete__transition",
                        "__autocomplete__invalid",
                        "__autocomplete__text",
                        !props.disabled && "__autocomplete__control-state",
                        props.className
                    )}
                />
                <input
                    id={id}
                    name={id}
                    type="hidden"
                    data-origin={id}
                    ref={(node) => {
                        hiddenInput.current = node;
                        if (typeof externalRef === "function") externalRef(node);
                        else if (externalRef) externalRef.current = node;
                    }}
                    required={required}
                    value={value}
                    readOnly
                />
                <FloatingPortal preserveTabOrder>
                    {open && !props.disabled ? (
                        <FloatingFocusManager modal guards returnFocus={false} context={context} initialFocus={-1} visuallyHiddenDismiss>
                            <motion.div
                                {...getFloatingProps({
                                    ref: refs.setFloating,
                                    style: {
                                        ...transitions.styles,
                                        left: x,
                                        top: y ?? 0,
                                        position: strategy,
                                        height: "auto",
                                    },
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
                                    "__form-autocomplete__border __autocomplete__panel",
                                    isTopPlacement ? "__autocomplete__panel-top" : "__autocomplete__panel-bottom"
                                )}
                            >
                                {isEmpty ? (
                                    <div className="__autocomplete__empty">
                                        <span className="__autocomplete__empty-text">{emptyMessage || translation.autocompleteEmpty}</span>
                                    </div>
                                ) : null}
                                {insideModal ? (
                                    <ul
                                        id={listboxId}
                                        role="listbox"
                                        ref={setScrollElement}
                                        hidden={isEmpty}
                                        style={{ maxHeight: h, overflowY: "auto" }}
                                        className="__autocomplete__scroll"
                                    >
                                        {displayList.map((option, i) => (
                                            <li key={`${option.value}-${i}`} role="presentation">
                                                {renderOption(i, option)}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
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
                                        scrollerRef={(e) => setScrollElement(e as HTMLElement)}
                                        className="__autocomplete__scroll"
                                        itemContent={(i, option) => renderOption(i, option)}
                                    />
                                )}
                            </motion.div>
                        </FloatingFocusManager>
                    ) : null}
                </FloatingPortal>
            </InputField>
        );
    }
);
