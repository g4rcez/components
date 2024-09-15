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
import { ChevronDown } from "lucide-react";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { usePrevious } from "../../hooks/use-previous";
import { useTranslations } from "../../hooks/use-translate-context";
import { css, dispatchInput, initializeInputDataset } from "../../lib/dom";
import { safeRegex } from "../../lib/fns";
import { InputField, InputFieldProps } from "./input-field";
import { type OptionProps } from "./select";

type ItemProps = Omit<React.HTMLProps<HTMLLIElement>, "children"> & {
    selected: boolean;
    active: boolean;
    option: OptionProps;
};

export const Option = forwardRef<HTMLLIElement, ItemProps>(({ selected, active, onClick, option, ...rest }, ref) => (
    <li {...rest} ref={ref} role="option" aria-selected={selected} className="w-full border-b border-tooltip-border last:border-transparent">
        <button
            type="button"
            data-value={option.value}
            onClick={onClick as any}
            aria-selected={selected}
            className={`w-full cursor-pointer p-2 text-left ${selected ? "bg-primary text-primary-foreground" : ""} ${active ? "bg-primary-subtle text-primary-foreground" : ""}`}
        >
            {option.label ?? option.value}
        </button>
    </li>
));

export type AutocompleteProps = Omit<InputFieldProps<"input">, "value"> & {
    value?: string;
    options: OptionProps[];
    dynamicOption?: boolean;
};

const transitionStyles = {
    duration: 300,
    initial: { transform: "scaleY(0)", opacity: 0.4 },
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
        const translation = useTranslations();
        const ref = useRef<HTMLInputElement>(null);
        const [open, setOpen] = useState(false);
        const [shadow, setShadow] = useState("");
        const [value, setValue] = useState(props.value ?? props.defaultValue ?? "");
        const [label, setLabel] = useState(props.value ?? props.defaultValue ?? "");
        const [index, setIndex] = useState<number | null>(null);
        const listRef = useRef<Array<HTMLElement | null>>(emptyRef);
        const previousIndex = usePrevious(index);
        const innerOptions: OptionProps[] =
            dynamicOption && shadow !== "" ? [{ value: shadow, label: shadow, "data-dynamic": "true" }, ...options] : options;
        const list = new Fuzzy(innerOptions, ["value", "label"], fuzzyOptions).search(shadow);

        const pattern = dynamicOption
            ? undefined
            : `^(${options.map((x) => `${safeRegex(x.value)}${x.label ? "|" + safeRegex(x.label) : ""}`).join("|")})$`;

        useEffect(() => {
            const input = refs.reference.current as HTMLInputElement;
            if (!input) return;
            return initializeInputDataset(input);
        }, []);

        useEffect(() => {
            if (props.value) {
                const item = options.find((x) => x.value === props.value);
                setValue(item?.label ?? props.value);
            }
        }, [props.value]);

        const { x, y, strategy, refs, context } = useFloating<HTMLInputElement>({
            open,
            transform: true,
            onOpenChange: setOpen,
            whileElementsMounted: autoUpdate,
            middleware: [
                offset(4),
                size({
                    padding: 10,
                    apply(a) {
                        Object.assign(a.elements.floating.style, {
                            width: `${a.rects.reference.width}px`,
                            maxHeight: `${Math.min(480, a.availableHeight)}px`,
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
                listRef,
                loop: true,
                activeIndex: index,
                allowEscape: true,
                focusItemOnOpen: "auto",
                openOnArrowKeyDown: true,
                scrollItemIntoView: true,
                selectedIndex: index,
                virtual: true,
                onNavigate: (n) => {
                    const lastIndex = list.length - 1;
                    if (n === null && previousIndex === 0) return setIndex(lastIndex);
                    if (n === null && previousIndex === lastIndex) return setIndex(0);
                    const i = n ?? previousIndex ?? null;
                    return i === null ? undefined : setIndex(i);
                },
            }),
        ]);

        const onSelect = (opt: OptionProps) => {
            setValue(opt.value);
            (refs.reference.current as HTMLInputElement)?.setAttribute("data-value", opt.value);
            setLabel(opt.label ?? "");
            const fakeEvent = dispatchInput(ref.current, opt.value);
            if (fakeEvent) props.onChange?.(fakeEvent as any);
            setOpen(false);
            setShadow("");
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

        return (
            <InputField
                {...(props as any)}
                container={css("group inline-block w-full", container)}
                error={error}
                feedback={feedback}
                form={props.form}
                hideLeft={hideLeft}
                id={props.name || props.id}
                interactive={interactive}
                labelClassName={labelClassName}
                left={left}
                name={props.name}
                optionalText={optionalText}
                placeholder={props.placeholder}
                required
                rightLabel={rightLabel}
                title={props.title}
                right={
                    <span className="flex items-center gap-0.5">
                        <button type="button" className="transition-colors link:text-primary">
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
                                    return onSelect(list[index]);
                                }
                                if (list.length === 1) {
                                    event.preventDefault();
                                    return onSelect(list[0]);
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
                        "input placeholder-input-mask group h-10 py-1 px-2 w-full flex-1 rounded-md bg-transparent text-base text-foreground outline-none transition-colors group-error:text-danger group-error:placeholder-input-mask-error",
                        !!right || shadow ? "pe-12" : "",
                        !!left ? "ps-8" : "",
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
                                    style: { position: strategy, left: x ?? 0, top: y ?? 0, ...transitions.styles },
                                })}
                                data-floating="true"
                                className="z-floating m-0 origin-[top_center] list-none overflow-auto overflow-y-auto rounded-b-lg rounded-t-lg bg-floating-background p-0 text-foreground shadow-floating"
                            >
                                {list.map((option, i) => (
                                    <Option
                                        {...getItemProps({
                                            onClick: () => onSelect(option),
                                            ref: (node) => void (listRef.current[i] = node) as any,
                                            selected: index === i,
                                            active: value === option.value,
                                        })}
                                        key={`${option.value}-option`}
                                        option={option}
                                        selected={index === i}
                                        active={value === option.value}
                                    />
                                ))}
                            </ul>
                        </FloatingFocusManager>
                    ) : null}
                </FloatingPortal>
            </InputField>
        );
    }
);
