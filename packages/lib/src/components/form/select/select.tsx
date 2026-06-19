"use client";
import { CaretDownIcon } from "@phosphor-icons/react";
import type React from "react";
import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from "react";
import { useTranslations } from "../../../hooks/use-translations";
import { css, initializeInputDataset, mergeRefs } from "../../../lib/dom";
import type { Override } from "../../../types";
import { InputField, type InputFieldProps } from "../input/input-field";

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
            selectContainer: _selectContainer = "",
            feedback = null,
            labelClassName,
            interactive,
            rightLabel,
            hiddenLabel,
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
        const generatedId = useId();
        const id = props.id ?? props.name ?? generatedId;
        const describedBy =
            [props["aria-describedby"], feedback ? `${id}-feedback` : undefined, error ? `${id}-error` : undefined].filter(Boolean).join(" ") ||
            undefined;
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
                name={props.name ?? id}
                feedback={feedback}
                hideLeft={hideLeft}
                required={required}
                title={props.title}
                container={container}
                componentName="select"
                rightLabel={rightLabel}
                hiddenLabel={hiddenLabel}
                disabled={props.disabled}
                interactive={interactive}
                id={id}
                optionalText={optionalText}
                labelClassName={css("__select__field", labelClassName)}
                placeholder={props.placeholder}
                right={
                    <span>
                        {right}
                        <button disabled={props.disabled} onClick={onClickLabel} type="button" className="__select__trigger">
                            <CaretDownIcon aria-hidden="true" className="__select__trigger-icon" />
                            <span className="__select__trigger-label">{translation.inputCaretDown}</span>
                        </button>
                    </span>
                }
            >
                <select
                    {...props}
                    id={id}
                    name={props.name ?? id}
                    required={required}
                    ref={mergeRefs(ref, inputRef)}
                    aria-invalid={error ? true : props["aria-invalid"]}
                    aria-labelledby={`${id}-label`}
                    aria-describedby={describedBy}
                    data-selected={!!props.value || false}
                    title={typeof props.title === "string" ? props.title : undefined}
                    className={css("input select __select__control", props.className)}
                >
                    <option value="" disabled hidden>
                        {props.placeholder}
                    </option>
                    {options.map((option) => (
                        <option {...option} value={option.value} key={`${id}-select-option-${option.value}`}>
                            {option.label ?? option.value}
                        </option>
                    ))}
                </select>
            </InputField>
        );
    }
);
