"use client";
import React, { forwardRef, useEffect, useRef } from "react";
import MaskInput, { InputTypes } from "the-mask-input";
import { css, initializeInputDataset, mergeRefs } from "../../lib/dom";
import { Any, Override, ReactComponent } from "../../types";
import { FeedbackProps, InputField, InputFieldProps } from "./input-field";

type FreeTextTag = "input" | "textarea";

export type FreeTextProps<T extends FreeTextTag, ExtraProps extends Any> = Override<
    InputFieldProps<T> & FeedbackProps & Partial<{ next: string; type: InputTypes }>,
    ExtraProps
>;

export const createFreeText = <const T extends FreeTextTag, const Html extends HTMLInputElement | HTMLTextAreaElement, Extra extends Any>(
    Element: "input" | "textarea" | typeof MaskInput,
    elementName: "input" | "textarea",
    defaultProps: FreeTextProps<T, Extra>,
    register?: (el: Html) => () => void
) => {
    const FreeText: ReactComponent<FreeTextProps<T, Extra>> = forwardRef<Html, FreeTextProps<T, Extra>>(
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
                loading,
                hiddenLabel,
                ...props
            },
            ref
        ): React.ReactElement => {
            const Render: React.ElementType = Element;
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
                    {...(defaultProps as unknown as InputFieldProps<T>)}
                    info={info}
                    left={left}
                    error={error}
                    right={right}
                    form={props.form}
                    loading={loading}
                    name={props.name}
                    feedback={feedback}
                    hideLeft={hideLeft}
                    title={props.title}
                    rightLabel={rightLabel}
                    disabled={props.disabled}
                    hiddenLabel={hiddenLabel}
                    interactive={interactive}
                    required={props.required}
                    componentName={elementName}
                    id={props.name || props.id}
                    optionalText={optionalText}
                    labelClassName={labelClassName}
                    placeholder={props.placeholder}
                    container={css(container, defaultProps.container)}
                >
                    <Render
                        {...defaultProps}
                        {...props}
                        id={id}
                        name={id}
                        type={type}
                        data-next={next}
                        aria-busy={loading}
                        aria-invalid={!!error}
                        aria-disabled={props.disabled}
                        aria-readonly={props.readOnly}
                        aria-describedby={error ? `${id}-error` : undefined}
                        ref={mergeRefs(ref, inputRef) as unknown as React.Ref<Html>}
                        className={css(
                            "input placeholder-input-mask group h-input-height w-full flex-1",
                            "rounded-input-radius bg-transparent px-input-padding-x py-input-padding-y text-input-text text-foreground",
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
    ) as unknown as ReactComponent<FreeTextProps<T, Extra>>;
    return FreeText;
};
