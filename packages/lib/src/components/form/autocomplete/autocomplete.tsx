"use client";
import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    FloatingPortal,
    offset,
    size,
    useDismiss,
    useFloating,
    useInteractions,
    useTransitionStyles,
} from "@floating-ui/react";
import { CaretDownIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { forwardRef, Fragment, type PropsWithChildren, type Ref, useEffect, useId, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { type ContextProp, type ItemProps, type ListProps, type SizeFunction, Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { useMediaQuery } from "../../../hooks/use-media-query";
import { useRemoveScroll } from "../../../hooks/use-remove-scroll";
import { useTranslations } from "../../../hooks/use-translations";
import { css, dispatchInput, getRemainingSize, initializeInputDataset, synthesizeChangeEvent } from "../../../lib/dom";
import { safeRegex } from "../../../lib/fns";
import { fzf } from "../../../lib/fzf";
import type { Label } from "../../../types";
import { freeTextStyles } from "../input/free-text.styles";
import { InputField, type InputFieldProps } from "../input/input-field";
import { Select, type OptionProps, type SelectProps } from "../select/select";
import { autocompleteStyles } from "./autocomplete.styles";

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

const autocompleteOptionActiveClassName = `${autocompleteStyles.slots.option}--active`;
const autocompleteOptionSelectedClassName = `${autocompleteStyles.slots.option}--selected`;
const autocompleteActionPrimaryClassName = `${autocompleteStyles.slots.action}--primary`;
const autocompleteActionDangerClassName = `${autocompleteStyles.slots.action}--danger`;
const autocompletePanelTopClassName = `${autocompleteStyles.slots.panel}--top`;
const autocompletePanelBottomClassName = `${autocompleteStyles.slots.panel}--bottom`;

const List = forwardRef<HTMLDivElement, ListProps & ContextProp<{ listboxId?: string }>>(function VirtualList({ context, ...props }, ref) {
    return (
        <motion.div {...props} ref={ref} role="listbox" id={context?.listboxId} className={autocompleteStyles.slots.list}>
            <AnimatePresence>{props.children}</AnimatePresence>
        </motion.div>
    );
});

const Item = forwardRef<HTMLDivElement, ItemProps<AutocompleteItemProps> & ContextProp<unknown>>(function VirtualItem(
    { item: _item, context: _context, ...props },
    ref
) {
    return <motion.div {...props} ref={ref} role="presentation" className={autocompleteStyles.slots.item} />;
});

const components = { List, Item };

const EMPTY_NODES: Array<HTMLElement | null> = [];

const MIN_SIZE = 40;
// The panel scales from zero, but layout dimensions remain stable during the transition.
const measureItemSize: SizeFunction = (element, field) => element[field];
const TOUCH_DEVICE_QUERY = "(any-pointer: coarse)";

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
            size: fieldSize = "normal",
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
        const isTouchableDevice = useMediaQuery(TOUCH_DEVICE_QUERY, false);
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
        const nativeOptions = useMemo<OptionProps[]>(
            () =>
                options.map((option) => {
                    const nativeOption = { ...option };
                    delete nativeOption.Render;
                    return nativeOption;
                }),
            [options]
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
                flip({ fallbackPlacements: ["top-start"], padding: 10 }),
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
        const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([useDismiss(context)]);

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
            setIndex(null);
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

        const navigateOption = (direction: 1 | -1) => {
            if (!open) openDropdown();
            if (displayList.length === 0) {
                setIndex(null);
                return;
            }

            const start = typeof index === "number" ? index : direction === 1 ? -1 : displayList.length;
            let next = start;

            for (let count = 0; count < displayList.length; count++) {
                next += direction;
                if (next > displayList.length - 1) next = 0;
                if (next < 0) next = displayList.length - 1;
                if (displayList[next]?.disabled) continue;

                setIndex(next);
                requestAnimationFrame(() => scrollOptionIntoView(next));
                return;
            }

            setIndex(null);
        };

        const renderOption = (i: number, option: AutocompleteItemProps | undefined) => {
            if (!option) return null;
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
                            autocompleteStyles.slots.option,
                            active ? autocompleteOptionActiveClassName : undefined,
                            selected ? autocompleteOptionSelectedClassName : undefined
                        ),
                    })}
                >
                    <Label {...option} ref={undefined} label={option.label} value={option.value}>
                        {children}
                    </Label>
                </div>
            );
        };

        if (isTouchableDevice && !dynamicOption) {
            const onTouchDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
                const nextValue = event.target.value;
                const selected = options.find((option) => option.value === nextValue);
                setValue(nextValue);
                setLabel(selected?.label ?? nextValue);
                if (!hiddenInput.current) return;
                hiddenInput.current.value = nextValue;
                hiddenInput.current.setAttribute("data-value", nextValue);
                hiddenInput.current.dispatchEvent(new Event("change", { bubbles: false, cancelable: true }));
                props.onChange?.(synthesizeChangeEvent(hiddenInput.current));
            };

            return (
                <Fragment>
                    <Select
                        {...(props as unknown as SelectProps)}
                        left={left}
                        error={error}
                        right={right}
                        loading={loading}
                        options={nativeOptions}
                        container={container}
                        rightLabel={rightLabel}
                        interactive={interactive}
                        feedback={feedback}
                        optionalText={optionalText}
                        labelClassName={labelClassName}
                        hideLeft={hideLeft}
                        size={fieldSize}
                        required={required}
                        id={shadowId}
                        name={shadowId}
                        value={value}
                        onChange={onTouchDeviceChange}
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
                        value={value}
                        readOnly
                    />
                </Fragment>
            );
        }

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
                size={fieldSize}
                container={css(container, autocompleteStyles.className({ size: fieldSize }))}
                rightLabel={rightLabel}
                interactive={interactive}
                optionalText={optionalText}
                componentName="autocomplete"
                labelClassName={css(
                    !props.disabled && autocompleteStyles.slots["field-state"],
                    props.disabled && autocompleteStyles.slots["disabled-border"],
                    labelClassName
                )}
                placeholder={props.placeholder}
                ref={fieldset as unknown as Ref<HTMLInputElement>}
                feedback={open && isTopPlacement ? props.title : feedback}
                right={
                    <span className={autocompleteStyles.slots.actions}>
                        {right}
                        <button
                            type="button"
                            disabled={props.disabled}
                            onClick={onCaretDownClick}
                            className={css(
                                autocompleteStyles.className({ size: fieldSize }),
                                autocompleteStyles.slots.action,
                                !props.disabled && autocompleteActionPrimaryClassName
                            )}
                        >
                            <CaretDownIcon aria-hidden="true" className={autocompleteStyles.slots["input-icon"]} />
                            <span className={autocompleteStyles.slots["sr-label"]}>{translation.inputCaretDown}</span>
                        </button>
                        {value ? (
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={props.disabled}
                                aria-label={translation.inputCloseValue}
                                className={css(
                                    autocompleteStyles.className({ size: fieldSize }),
                                    autocompleteStyles.slots.action,
                                    !props.disabled && autocompleteActionDangerClassName
                                )}
                            >
                                <XIcon aria-hidden="true" className={autocompleteStyles.slots["input-icon"]} />
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
                        onClick: onCaretDownClick,
                        onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
                            props.onKeyDown?.(event);
                            if (event.defaultPrevented) return;
                            if (event.key === "Escape") {
                                event.preventDefault();
                                return setClosed();
                            }
                            if (event.key === "ArrowDown") {
                                event.preventDefault();
                                return navigateOption(1);
                            }
                            if (event.key === "ArrowUp") {
                                event.preventDefault();
                                return navigateOption(-1);
                            }
                            if (event.key === "Enter") {
                                const selectedIndex = index;
                                const selected = selectedIndex !== null ? displayList[selectedIndex] : undefined;
                                if (selectedIndex !== null && selected && !selected.disabled) {
                                    event.preventDefault();
                                    return onSelect(selected, selectedIndex);
                                }
                                if (displayList.length === 1 && !displayList[0]?.disabled) {
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
                        "input",
                        autocompleteStyles.className({ size: fieldSize }),
                        autocompleteStyles.slots.input,
                        freeTextStyles.className({ size: fieldSize }),
                        freeTextStyles.slots.input,
                        freeTextStyles.slots.surface,
                        freeTextStyles.slots.transition,
                        freeTextStyles.slots.placeholder,
                        freeTextStyles.slots["input-state"],
                        !props.disabled && autocompleteStyles.slots["control-state"],
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
                                data-placement={placement}
                                className={css(
                                    autocompleteStyles.className({ size: fieldSize }),
                                    autocompleteStyles.slots.panel,
                                    isTopPlacement ? autocompletePanelTopClassName : autocompletePanelBottomClassName
                                )}
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
                            >
                                {isEmpty ? (
                                    <div className={autocompleteStyles.slots.empty}>
                                        <span className={autocompleteStyles.slots["empty-text"]}>
                                            {emptyMessage || translation.autocompleteEmpty}
                                        </span>
                                    </div>
                                ) : null}
                                {insideModal ? (
                                    <ul
                                        id={listboxId}
                                        role="listbox"
                                        ref={setScrollElement}
                                        hidden={isEmpty}
                                        style={{ maxHeight: h, overflowY: "auto" }}
                                        className={autocompleteStyles.slots.scroll}
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
                                        itemSize={measureItemSize}
                                        components={components as never}
                                        scrollerRef={(e) => setScrollElement(e as HTMLElement)}
                                        className={autocompleteStyles.slots.scroll}
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
