"use client";
import { CheckCircleIcon, InfoIcon, XCircleIcon } from "@phosphor-icons/react";
import React, { forwardRef, Fragment, type PropsWithChildren } from "react";
import { useTweaks } from "../../../hooks/use-tweaks";
import type { ComponentStyleProps } from "../../../lib/component-styles";
import { css } from "../../../lib/dom";
import type { Label, Override } from "../../../types";
import type { PolymorphicProps } from "../../core/polymorph/polymorph";
import { Tooltip } from "../../floating/tooltip/tooltip";
import { inputFieldStyles } from "./input-field.styles";

export type InputFieldSize = NonNullable<ComponentStyleProps<typeof inputFieldStyles>["size"]>;

export type FeedbackProps = React.PropsWithChildren<
    Partial<{
        id: string;
        info: Label;
        title: Label;
        hideLeft: boolean;
        className: string;
        placeholder: string;
        reportStatus: boolean;
        hiddenLabel: boolean;
    }>
>;

export const InputFeedback = ({ reportStatus, id, hideLeft = false, className, info, children, title }: FeedbackProps) => (
    <span
        className={css(
            inputFieldStyles.slots.feedback,
            hideLeft && children === null ? inputFieldStyles.slots["feedback-hidden"] : inputFieldStyles.slots["feedback-body"],
            className
        )}
    >
        {hideLeft ? null : (
            <span
                className={css(inputFieldStyles.slots["label-row"], inputFieldStyles.slots["label-active"], inputFieldStyles.slots["label-disabled"])}
            >
                <span id={id ? `${id}-label` : undefined}>{title}</span>
                {reportStatus || info ? (
                    <span className={inputFieldStyles.slots["label-meta"]}>
                        {info ? (
                            <Tooltip
                                as="button"
                                type="button"
                                aria-label={typeof info === "string" ? info : undefined}
                                aria-describedby={typeof info !== "string" && id ? `tooltip-info-content-${id}` : undefined}
                                title={
                                    <span className={inputFieldStyles.slots["tooltip-trigger"]}>
                                        <span className={inputFieldStyles.slots["tooltip-icon"]}>
                                            <InfoIcon aria-hidden="true" className={inputFieldStyles.slots["feedback-icon"]} />
                                        </span>
                                    </span>
                                }
                            >
                                <div
                                    id={id ? `tooltip-info-content-${id}` : undefined}
                                    className={css(inputFieldStyles.slots["tooltip-body"], inputFieldStyles.slots["tooltip-content"])}
                                >
                                    {info}
                                </div>
                            </Tooltip>
                        ) : null}
                        {reportStatus ? (
                            <span className={inputFieldStyles.slots.status}>
                                <span className={css(inputFieldStyles.slots["status-indicator"], inputFieldStyles.slots["status-success"])}>
                                    <CheckCircleIcon aria-hidden="true" className={inputFieldStyles.slots["status-icon"]} />
                                </span>
                                <span className={css(inputFieldStyles.slots["status-indicator"], inputFieldStyles.slots["status-error"])}>
                                    <XCircleIcon aria-hidden="true" className={inputFieldStyles.slots["status-icon"]} />
                                </span>
                            </span>
                        ) : null}
                    </span>
                ) : null}
            </span>
        )}
        {children}
    </span>
);

export type InputFieldProps<T extends "input" | "select" | "textarea"> = PolymorphicProps<
    Partial<
        Override<
            FeedbackProps,
            {
                id: string;
                info: Label;
                left: Label;
                name: string;
                right: Label;
                error: string;
                feedback: Label;
                loading: boolean;
                container: string;
                hideLeft: boolean;
                rightLabel: Label;
                placeholder: string;
                interactive: boolean;
                optionalText: string;
                componentName: string;
                labelClassName: string;
                size: InputFieldSize;
            }
        >
    >,
    T
>;

export const InputField: <T extends "input" | "select" | "textarea">(props: PropsWithChildren<InputFieldProps<T>>) => React.ReactElement = forwardRef(
    <T extends "input" | "select" | "textarea">(
        {
            optionalText: _optionalText,
            left,
            rightLabel,
            container,
            feedback,
            interactive,
            right,
            info,
            children,
            error,
            form,
            id,
            labelClassName = "",
            name,
            title,
            componentName,
            placeholder,
            hideLeft = false,
            required,
            disabled,
            reportStatus,
            hiddenLabel,
            size = "normal",
        }: PropsWithChildren<InputFieldProps<T>>,
        ref: React.Ref<HTMLFieldSetElement>
    ) => {
        const tweaks = useTweaks();
        const reportStatusDefault = reportStatus === undefined ? tweaks.input.iconFeedback : reportStatus;
        const ID = id ?? name;
        const optionalText = _optionalText ?? "";
        return (
            <fieldset
                ref={ref}
                form={form}
                disabled={disabled}
                data-error={!!error}
                aria-disabled={disabled}
                data-component={componentName}
                data-interactive={!!interactive}
                className={css(inputFieldStyles.slots.fieldset, inputFieldStyles.className({ size }), container)}
            >
                <label
                    form={form}
                    htmlFor={ID}
                    className={css(inputFieldStyles.slots.label, inputFieldStyles.slots["label-layout"], inputFieldStyles.slots["label-state"])}
                >
                    {hiddenLabel ? (
                        <span className={inputFieldStyles.slots["sr-only"]}>
                            <InputFeedback
                                id={ID}
                                info={info}
                                hideLeft={hideLeft}
                                reportStatus={reportStatusDefault}
                                title={title}
                                placeholder={placeholder}
                            />
                        </span>
                    ) : (
                        <InputFeedback
                            id={ID}
                            info={info}
                            title={title}
                            hideLeft={hideLeft}
                            placeholder={placeholder}
                            reportStatus={reportStatusDefault}
                        >
                            {optionalText.trim() || rightLabel ? (
                                <Fragment>
                                    {optionalText.trim() && !required ? (
                                        <span
                                            aria-disabled={disabled}
                                            className={css(
                                                inputFieldStyles.slots.optional,
                                                inputFieldStyles.slots["optional-state"],
                                                inputFieldStyles.slots["optional-text"]
                                            )}
                                        >
                                            {optionalText}
                                        </span>
                                    ) : null}
                                    {rightLabel ? <Fragment>{rightLabel}</Fragment> : null}
                                </Fragment>
                            ) : null}
                        </InputFeedback>
                    )}
                    <div
                        className={css(
                            inputFieldStyles.slots.border,
                            inputFieldStyles.slots.control,
                            inputFieldStyles.slots["control-surface"],
                            inputFieldStyles.slots["control-state"],
                            inputFieldStyles.slots["control-disabled"],
                            labelClassName
                        )}
                    >
                        {left ? <span className={css(inputFieldStyles.slots["slot-start"], inputFieldStyles.slots.slot)}>{left}</span> : null}
                        {children}
                        {right ? <span className={css(inputFieldStyles.slots["slot-end"], inputFieldStyles.slots.slot)}>{right}</span> : null}
                    </div>
                </label>
                <p
                    id={ID ? `${ID}-error` : undefined}
                    role="alert"
                    className={css(inputFieldStyles.slots["error-text"], inputFieldStyles.slots["error-state"], inputFieldStyles.slots.error)}
                >
                    {error}
                </p>
                <p
                    id={ID ? `${ID}-feedback` : undefined}
                    className={css(inputFieldStyles.slots["feedback-text"], inputFieldStyles.slots["feedback-state"])}
                >
                    {feedback}
                </p>
            </fieldset>
        );
    }
) as unknown as <T extends "input" | "select" | "textarea">(props: PropsWithChildren<InputFieldProps<T>>) => React.ReactElement; // forwardRef return is non-generic; cast restores the polymorphic signature
