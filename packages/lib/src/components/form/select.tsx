"use client";
import { ChevronDownIcon } from "lucide-react";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useTranslations } from "../../hooks/use-translations";
import { css, initializeInputDataset, mergeRefs } from "../../lib/dom";
import { Override } from "../../types";
import { InputField, InputFieldProps } from "./input-field";

export type OptionProps = Override<
    React.ComponentProps<"option">,
    {
        value: string;
        "data-dynamic"?: string;
    } & Partial<Record<`data-${string}`, string>>
>;

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
            loading,
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
            const controller = new AbortController();
            const input = inputRef.current;
            const focus = initializeInputDataset(inputRef.current);
            input.addEventListener("change", () => input.setAttribute("data-selected", "true"), {
                once: true,
                signal: controller.signal,
            });
            return () => {
                focus();
                controller.abort();
            };
        }, []);

        const onClickLabel = () => inputRef.current?.focus();

        return (
            <InputField<"select">
                info={info}
                left={left}
                error={error}
                form={props.form}
                loading={loading}
                name={props.name}
                feedback={feedback}
                hideLeft={hideLeft}
                required={required}
                title={props.title}
                container={container}
                componentName="select"
                rightLabel={rightLabel}
                interactive={interactive}
                id={props.name || props.id}
                optionalText={optionalText}
                labelClassName={labelClassName}
                placeholder={props.placeholder}
                right={
                    <label htmlFor={id}>
                        {right}
                        <button onClick={onClickLabel} type="button" className="mt-2 transition-colors hover:text-primary">
                            <ChevronDownIcon size={20} />
                            <span className="sr-only">{translation.inputCaretDown}</span>
                        </button>
                    </label>
                }
            >
                <select
                    {...props}
                    id={id}
                    name={id}
                    required={required}
                    ref={mergeRefs(ref, inputRef)}
                    data-selected={!!props.value || false}
                    title={typeof props.title === "string" ? props.title : undefined}
                    className={css(
                        "input select group h-10 w-full flex-1 appearance-none rounded-md",
                        "bg-transparent px-2 py-1 text-foreground placeholder-input-placeholder",
                        "outline-none transition-colors group-error:text-danger group-error:placeholder-input-mask-error",
                        "data-[selected=false]:text-input-placeholder",
                        props.className
                    )}
                >
                    <option value="" disabled hidden>
                        {props.placeholder}
                    </option>
                    {options.map((option) => (
                        <option
                            {...option}
                            value={option.value}
                            children={option.label ?? option.value}
                            key={`${id}-select-option-${option.value}`}
                        />
                    ))}
                </select>
            </InputField>
        );
    }
);
