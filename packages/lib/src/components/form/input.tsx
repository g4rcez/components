"use client";
import React, { forwardRef, useEffect, useRef } from "react";
import MaskInput, { TheMaskProps } from "the-mask-input";
import { css, initializeInputDataset, mergeRefs } from "../../lib/dom";
import { Override } from "../../types";
import { FeedbackProps, InputField, InputFieldProps } from "./input-field";

export type InputProps = Override<InputFieldProps<"input">, TheMaskProps & FeedbackProps & { next?: string }>;

export const Input: React.FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            type = "text",
            feedback = null,
            info,
            labelClassName,
            next,
            interactive,
            rightLabel,
            optionalText,
            container,
            hideLeft = false,
            right,
            left,
            error,
            ...props
        }: InputProps,
        ref
    ): any => {
        const id = props.id ?? props.name;
        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (inputRef.current === null) return;
            const input = inputRef.current;
            const focus = initializeInputDataset(inputRef.current);
            const goNextInputImpl = (e: Event) => {
                const event = e as KeyboardEvent;
                if (event.key === "Enter" && input.enterKeyHint === "next") {
                    const focusNext = input.getAttribute("data-next");
                    if (focusNext) {
                        const el = document.getElementById(focusNext);
                        if (el) {
                            el.focus();
                            return void event.preventDefault();
                        }
                    }
                }
            };
            input.addEventListener("keydown", goNextInputImpl);
            return () => {
                focus();
                input.removeEventListener("keydown", goNextInputImpl);
            };
        }, []);

        return (
            <InputField<"input">
                info={info}
                container={container}
                error={error}
                feedback={feedback}
                hideLeft={hideLeft}
                left={left}
                optionalText={optionalText}
                right={right}
                rightLabel={rightLabel}
                interactive={interactive}
                form={props.form}
                id={props.name || props.id}
                name={props.name}
                labelClassName={labelClassName}
                title={props.title}
                placeholder={props.placeholder}
                required={props.required}
            >
                <MaskInput
                    {...(props as any)}
                    id={id}
                    name={id}
                    type={type}
                    data-next={next}
                    aria-busy={props.disabled}
                    aria-disabled={props.disabled}
                    aria-readonly={props.readOnly}
                    ref={mergeRefs(ref, inputRef)}
                    className={css(
                        "input placeholder-input-mask group h-input-height w-full flex-1",
                        "rounded-md bg-transparent px-input-x py-input-y text-foreground",
                        "outline-none transition-colors focus:ring-2 focus:ring-inset focus:ring-primary",
                        "group-error:text-danger group-error:placeholder-input-mask-error",
                        "group-focus-within:border-primary group-hover:border-primary",
                        props.className
                    )}
                />
            </InputField>
        );
    }
) as any;
