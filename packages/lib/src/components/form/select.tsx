"use client";
import { ChevronDown } from "lucide-react";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useTranslations } from "../../hooks/use-translate-context";
import { css, initializeInputDataset, mergeRefs } from "../../lib/dom";
import { Override } from "../../types";
import { InputField, InputFieldProps } from "./input-field";

export type OptionProps = Override<React.ComponentProps<"option">, { value: string; "data-dynamic"?: string }>;

export type SelectProps = Override<
    InputFieldProps<"select">,
    {
        options: OptionProps[];
        selectContainer?: string;
    }
>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            required = true,
            options,
            info,
            selectContainer = "",
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
            ...props
        }: SelectProps,
        ref
    ) => {
        const translation = useTranslations();
        const inputRef = useRef<HTMLSelectElement>(null);
        const id = props.id ?? props.name;
        useImperativeHandle(ref, () => inputRef.current!);

        useEffect(() => {
            if (inputRef.current === null) return;
            const input = inputRef.current;
            const focus = initializeInputDataset(inputRef.current);
            const change = () => input.setAttribute("data-selected", "true");
            input.addEventListener("change", change);
            return () => {
              focus()
                input.removeEventListener("change", change);
            };
        }, []);

        const onClickLabel = () => inputRef.current?.focus();

        return (
            <InputField<"select">
                container={css("group inline-block w-full", container)}
                error={error}
                feedback={feedback}
                hideLeft={hideLeft}
                left={left}
                info={info}
                optionalText={optionalText}
                rightLabel={rightLabel}
                interactive={interactive}
                form={props.form}
                id={props.name || props.id}
                name={props.name}
                labelClassName={labelClassName}
                title={props.title}
                placeholder={props.placeholder}
                required={required}
                right={
                    <label htmlFor={id}>
                        <button onClick={onClickLabel} type="button" className="mt-2 transition-colors hover:text-primary">
                            <ChevronDown size={20} />
                            <span className="sr-only">{translation.inputCaretDown}</span>
                        </button>
                    </label>
                }
            >
                <select
                    {...props}
                    id={id}
                    name={id}
                    value={props.value}
                    required={required}
                    ref={mergeRefs(ref, inputRef)}
                    data-selected={!!props.value || false}
                    defaultValue={props.value ? undefined : ""}
                    className={css(
                        "input appearance-none select group h-10 py-1 px-2 w-full flex-1 rounded-md bg-transparent text-foreground placeholder-input-placeholder outline-none transition-colors group-error:text-danger group-error:placeholder-input-mask-error",
                        "data-[selected=false]:text-input-placeholder",
                        props.className
                    )}
                >
                    <option value="" disabled hidden>
                        {props.placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={`${id}-select-option-${option.value}`} {...option} children={option.label ?? option.value} />
                    ))}
                </select>
            </InputField>
        );
    }
);
