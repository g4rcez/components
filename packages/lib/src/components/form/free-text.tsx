"use client";
import React, { forwardRef, useEffect, useRef } from "react";
import MaskInput, { InputTypes } from "the-mask-input";
import { css, initializeInputDataset, mergeRefs } from "../../lib/dom";
import { Override } from "../../types";
import { FeedbackProps, InputField, InputFieldProps } from "./input-field";

type FreeTextTag = "input" | "textarea";

export type FreeTextProps<T extends FreeTextTag, ExtraProps extends object> = Override<
    ExtraProps & FeedbackProps,
    InputFieldProps<T> & Partial<{ next: string; type: InputTypes }>
>;

export const createFreeText = <T extends FreeTextTag, Html extends HTMLInputElement | HTMLTextAreaElement, Extra extends object>(
    Element: "input" | "textarea" | typeof MaskInput,
    elementName: "input" | "textarea",
    defaultProps: FreeTextProps<T, Extra>,
    register?: (el: Html) => () => void
) => {
    const FreeText: React.FC<FreeTextProps<T, Extra>> = forwardRef<Html, FreeTextProps<T, Extra>>(
        (
            {
                info,
                left,
                next,
                error,
                right,
                container,
                rightLabel,
                interactive,
                optionalText,
                type = "text",
                labelClassName,
                feedback = null,
                hideLeft = false,
                ...props
            }: FreeTextProps<T, Extra>,
            ref
        ): any => {
            const Render = Element as any;
            const id = props.id ?? props.name;
            const inputRef = useRef<Html>(null);

            useEffect(() => {
                if (inputRef.current === null) return;
                const input = inputRef.current;
                const focus = initializeInputDataset(inputRef.current);
                const registered = register?.(input);
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
                    registered?.();
                    focus();
                    input.removeEventListener("keydown", goNextInputImpl);
                };
            }, []);

            return (
                <InputField
                    {...(defaultProps as any)}
                    info={info}
                    left={left}
                    error={error}
                    right={right}
                    form={props.form}
                    name={props.name}
                    feedback={feedback}
                    hideLeft={hideLeft}
                    title={props.title}
                    container={container}
                    rightLabel={rightLabel}
                    disabled={props.disabled}
                    interactive={interactive}
                    required={props.required}
                    componentName={elementName}
                    id={props.name || props.id}
                    optionalText={optionalText}
                    labelClassName={labelClassName}
                    placeholder={props.placeholder}
                >
                    <Render
                        {...defaultProps}
                        {...props}
                        id={id}
                        name={id}
                        type={type}
                        data-next={next}
                        aria-busy={props.disabled}
                        aria-disabled={props.disabled}
                        aria-readonly={props.readOnly}
                        ref={mergeRefs(ref, inputRef) as any}
                        className={css(
                            "input placeholder-input-mask group h-input-height w-full flex-1",
                            "rounded-md bg-transparent px-input-x py-input-y text-foreground",
                            "outline-none transition-colors focus:ring-2 focus:ring-inset focus:ring-primary",
                            "group-error:text-danger group-error:placeholder-input-mask-error",
                            "resize-y group-focus-within:border-primary group-hover:border-primary",
                            "disabled:cursor-not-allowed disabled:text-disabled",
                            props.className
                        )}
                    />
                </InputField>
            );
        }
    ) as any;
    return FreeText;
};
