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
import { CheckIcon, ChevronDown } from "lucide-react";
import React, { forwardRef, Fragment, type PropsWithChildren, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "../../hooks/use-components-provider";
import { css, dispatchInput, initializeInputDataset } from "../../lib/dom";
import { safeRegex } from "../../lib/fns";
import { Label } from "../../types";
import { InputField, InputFieldProps } from "./input-field";
import { type OptionProps } from "./select";

export type AutocompleteItemProps = OptionProps & { Render?: React.FC<OptionProps> };

export type AutocompleteOptionProps = Omit<React.HTMLProps<HTMLLIElement>, "children"> & {
    active: boolean;
    selected: boolean;
    emptyMessage?: Label;
    option: AutocompleteItemProps;
};

const Frag = (props: PropsWithChildren) => <Fragment>{props.children}</Fragment>;

export const Option = forwardRef<HTMLLIElement, AutocompleteOptionProps>(({ selected, active, onClick, option, ...props }, ref) => {
    const Label = (option.Render as React.FC<any>) ?? Frag;
    const children = option.label ?? option.value;
    if (option.hidden) {
        return null;
    }
    return (
        <motion.li
            {...(props as any)}
            ref={ref}
            role="option"
            aria-selected={active}
            className="w-full border-b border-tooltip-border last:border-transparent"
        >
            <button
                type="button"
                aria-busy={option.disabled}
                aria-checked={active}
                aria-current={active}
                aria-selected={active}
                onClick={onClick as any}
                data-value={option.value}
                className={`flex w-full cursor-pointer justify-between p-2 text-left ${active ? "bg-primary-hover text-primary-foreground" : ""} ${selected ? "bg-primary text-primary-foreground" : ""}`}
            >
                <Label {...props} label={option.label} value={option.value} children={children} />
                {active ? (
                    <span>
                        <CheckIcon aria-hidden className="text-current" absoluteStrokeWidth strokeWidth={2} size={22} />
                    </span>
                ) : null}
            </button>
        </motion.li>
    );
});

export type AutocompleteProps = Omit<InputFieldProps<"input">, "value"> & {
    value?: string;
    emptyMessage?: Label;
    dynamicOption?: boolean;
    options: AutocompleteItemProps[];
};

const transitionStyles = {
    duration: 300,
    initial: { transform: "scaleY(0)", opacity: 0.2 },
    open: { transform: "scaleY(1)", opacity: 1 },
    close: { transform: "scaleY(0)", opacity: 0 },
} as const;

const fuzzyOptions = { caseSensitive: false, sort: false };

const emptyRef: any[] = [];

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
    (
        {
            options,
            dynamicOption = false,
            feedback = null,
            labelClassName,
            emptyMessage,
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
        }: AutocompleteProps,
        externalRef
    ) => {
        const fieldset = useRef<HTMLFieldSetElement>(null);
        const defaults = props.value ?? props.defaultValue ?? "";
        const translation = useTranslations();
        const [open, setOpen] = useState(false);
        const [shadow, setShadow] = useState("");
        const [value, setValue] = useState(defaults);
        const [label, setLabel] = useState(() => options.find((x) => x.value === defaults)?.label ?? defaults);
        const [index, setIndex] = useState<number | null>(null);
        const listRef = useRef<Array<HTMLElement | null>>(emptyRef);
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
        const list = new Fuzzy(innerOptions, ["value", "label"], fuzzyOptions).search(shadow);

        const pattern = dynamicOption
            ? undefined
            : `^(${options.map((x) => `${safeRegex(x.value)}${x.label ? "|" + safeRegex(x.label) : ""}`).join("|")})$`;

        useEffect(() => {
            if (props.value) {
                const item = options.find((x) => x.value === props.value);
                setValue(item?.label ?? props.value);
            }
        }, [props.value]);

        const { x, y, strategy, refs, context } = useFloating<HTMLInputElement>({
            open,
            transform: true,
            strategy: "absolute",
            onOpenChange: setOpen,
            whileElementsMounted: autoUpdate,
            middleware: [
                offset(4),
                size({
                    elementContext: "reference",
                    padding: 10,
                    apply(a) {
                        const w = fieldset.current?.getBoundingClientRect().width!;
                        Object.assign(a.elements.floating.style, {
                            width: `${w}px`,
                            maxWidth: `${w}px`,
                            maxHeight: `${Math.min(250, a.availableHeight)}px`,
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
            setOpen(false);
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

        const onFocus = () => {
            setOpen(true);
            setShadow("");
        };

        const onClose = () => {
            setShadow("");
            setValue("");
            (refs.reference.current as HTMLInputElement)?.setAttribute("data-value", "");
            setLabel("");
            dispatchInput(refs.reference.current as HTMLInputElement, "");
            setOpen(false);
        };

        const id = props.id || props.name;

        const onCaretDownClick = () => {
            setOpen(true);
            setShadow("");
            (refs.reference.current as HTMLInputElement)?.focus();
        };

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
                                return setOpen(false);
                            }
                            if (event.key === "Enter") {
                                if (index !== null && list[index]) {
                                    event.preventDefault();
                                    return onSelect(list[index], index);
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
                <FloatingPortal preserveTabOrder>
                    {open ? (
                        <FloatingFocusManager guards returnFocus={false} context={context} initialFocus={-1} visuallyHiddenDismiss>
                            <ul
                                {...getFloatingProps({
                                    ref: refs.setFloating,
                                    style: {
                                        position: strategy,
                                        left: (x ?? 0) + (!!value ? 26 : 16),
                                        top: y ?? 0,
                                        ...transitions.styles,
                                    },
                                })}
                                data-floating="true"
                                className="z-floating m-0 origin-[top_center] list-none overflow-auto overflow-y-auto overscroll-contain rounded-b-lg rounded-t-lg border border-floating-border bg-floating-background p-0 text-foreground shadow-floating"
                            >
                                <AnimatePresence>
                                    {list.map((option, i) => {
                                        const active = value === option.value || value === option.label;
                                        return (
                                            <Option
                                                key={`${option.value}-option`}
                                                {...getItemProps({
                                                    onClick: () => onSelect(option, i),
                                                    ref: (node) => void (listRef.current[i] = node) as any,
                                                    selected: index === i,
                                                })}
                                                option={option}
                                                active={active}
                                                selected={index === i}
                                            />
                                        );
                                    })}
                                    {list.length === 0 ? (
                                        <li role="option" className="w-full border-b border-tooltip-border last:border-transparent">
                                            <span className="flex w-full justify-between p-2 text-left text-disabled">
                                                {emptyMessage || translation.autocompleteEmpty}
                                            </span>
                                        </li>
                                    ) : null}
                                </AnimatePresence>
                            </ul>
                        </FloatingFocusManager>
                    ) : null}
                </FloatingPortal>
            </InputField>
        );
    }
);
