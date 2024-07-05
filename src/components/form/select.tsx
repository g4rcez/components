"use client";
import React, { forwardRef, useEffect, useRef } from "react";
import { InputField, InputFieldProps } from "~/components/form/input-field";
import { css, mergeRefs } from "~/lib/dom";
import { Override } from "~/types";

export type SelectProps = Override<
    InputFieldProps<"select">,
    {
        options: React.ComponentProps<"option">[];
    }
>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ container, options, ...props }: SelectProps, ref) => {
    const inputRef = useRef<HTMLSelectElement>(null);
    const id = props.id ?? props.name;

    useEffect(() => {
        if (inputRef.current === null) return;
        const input = inputRef.current;
        const focus = () => input.setAttribute("data-initialized", "true");
        input.addEventListener("focus", focus);
        input.addEventListener("change", (e) => {
            input.setAttribute("data-selected", "true");
        });
        return () => input.removeEventListener("focus", focus);
    }, []);

    return (
        <InputField<"select"> {...(props as any)} container={css("group inline-block w-full", container)}>
            <select
                {...props}
                ref={mergeRefs(ref, inputRef)}
                id={id}
                name={id}
                data-selected={false}
                defaultValue={props.defaultValue ?? ""}
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
