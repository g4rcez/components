"use client";
import { ChevronDown } from "lucide-react";
import React, { forwardRef, useEffect, useRef } from "react";
import { InputField, InputFieldProps } from "./input-field";
import { css, mergeRefs } from "../../lib/dom";
import { Override } from "../../types";

export type OptionProps = Override<React.ComponentProps<"option">, { value: string }>;

export type SelectProps = Override<InputFieldProps<"select">, { options: OptionProps[] }>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ container, required = true, options, ...props }: SelectProps, ref) => {
    const inputRef = useRef<HTMLSelectElement>(null);
    const id = props.id ?? props.name;

    useEffect(() => {
        if (inputRef.current === null) return;
        const input = inputRef.current;
        const focus = () => input.setAttribute("data-initialized", "true");
        const change = () => input.setAttribute("data-selected", "true");
        input.addEventListener("focus", focus);
        input.addEventListener("change", change);
        return () => {
            input.removeEventListener("focus", focus);
            input.removeEventListener("change", change);
        };
    }, []);

    return (
        <InputField<"select">
            {...(props as any)}
            required={required}
            container={css("group inline-block w-full", container)}
            right={<ChevronDown size={20} />}
        >
            <select
                {...props}
                ref={mergeRefs(ref, inputRef)}
                id={id}
                name={id}
                required={required}
                data-selected={!!props.value || false}
                className={css(
                    "input bg-transparent text-foreground select group h-10 w-full flex-1 rounded-md p-2 placeholder-input-placeholder outline-none transition-colors group-error:text-danger group-error:placeholder-input-mask-error",
                    "data-[selected=false]:text-input-placeholder",
                    props.className
                )}
            >
                <option value="" hidden disabled>
                    {props.placeholder}
                </option>
                {options.map((option) => (
                    <option key={`${id}-select-option-${option.value}`} {...option} children={option.label ?? option.value} />
                ))}
            </select>
        </InputField>
    );
});
