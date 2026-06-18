"use client";
import { CheckCircleIcon, InfoIcon, XCircleIcon } from "@phosphor-icons/react";
import React, { forwardRef, Fragment, type PropsWithChildren } from "react";
import { useTranslations } from "../../hooks/use-translations";
import { useTweaks } from "../../hooks/use-tweaks";
import { css } from "../../lib/dom";
import type { Label, Override } from "../../types";
import type { PolymorphicProps } from "../core/polymorph";
import { Tooltip } from "../floating/tooltip";

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
            "__form-input-field__tw-1",
            hideLeft && children === null ? "__form-input-field__tw-2" : "__form-input-field__tw-3",
            className
        )}
    >
        {hideLeft ? null : (
            <span className="__form-input-field__tw-4 __form-input-field__tw-state-1 __form-input-field__tw-state-9">
                <span id={id ? `${id}-label` : undefined}>{title}</span>
                {reportStatus || info ? (
                    <span className="__form-input-field__tw-5">
                        {info ? (
                            <Tooltip
                                as="button"
                                type="button"
                                aria-label={typeof info === "string" ? info : undefined}
                                aria-describedby={typeof info === "string" ? undefined : id ? `tooltip-info-content-${id}` : undefined}
                                title={
                                    <span className="__form-input-field__tw-6">
                                        <span className="__form-input-field__tw-7">
                                            <InfoIcon aria-hidden="true" className="__input-field__feedback-icon" />
                                        </span>
                                    </span>
                                }
                            >
                                <div
                                    id={id ? `tooltip-info-content-${id}` : undefined}
                                    className="__form-input-field__tw-8 __input-field__tooltip-content"
                                >
                                    {info}
                                </div>
                            </Tooltip>
                        ) : null}
                        {reportStatus ? (
                            <span className="__form-input-field__tw-9">
                                <span className="__form-input-field__tw-10 __form-input-field__tw-state-2">
                                    <CheckCircleIcon aria-hidden="true" className="__input-field__status-icon" />
                                </span>
                                <span className="__form-input-field__tw-10 __form-input-field__tw-state-3">
                                    <XCircleIcon aria-hidden="true" className="__input-field__status-icon" />
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
        }: PropsWithChildren<InputFieldProps<T>>,
        ref: React.Ref<HTMLFieldSetElement>
    ) => {
        const tweaks = useTweaks();
        const reportStatusDefault = reportStatus !== undefined ? reportStatus : tweaks.input.iconFeedback;
        const ID = id ?? name;
        const translation = useTranslations();
        const optionalText = _optionalText ?? translation.inputOptionalLabel;
        return (
            <fieldset
                ref={ref}
                form={form}
                disabled={disabled}
                data-error={!!error}
                aria-disabled={disabled}
                data-component={componentName}
                data-interactive={!!interactive}
                className={css("__form-input-field__tw-11 __form-input-field__tw-extra-1", container)}
            >
                <label
                    form={form}
                    htmlFor={ID}
                    className={css("__form-input-field__tw-12 __form-input-field__tw-extra-2 __form-input-field__tw-state-4")}
                >
                    {hiddenLabel ? (
                        <span className="__form-input-field__tw-13">
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
                            {optionalText || rightLabel ? (
                                <Fragment>
                                    {!required ? (
                                        <span
                                            aria-disabled={disabled}
                                            className="__form-input-field__tw-14 __form-input-field__tw-state-5 __input-field__optional-text"
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
                            "__form-input-field__border __form-input-field__tw-15 __form-input-field__tw-extra-3 __form-input-field__tw-state-6 __form-input-field__tw-state-10",
                            labelClassName
                        )}
                    >
                        {left ? <span className="__form-input-field__tw-16 __form-input-field__tw-extra-4">{left}</span> : null}
                        {children}
                        {right ? <span className="__form-input-field__tw-17 __form-input-field__tw-extra-4">{right}</span> : null}
                    </div>
                </label>
                <p
                    id={ID ? `${ID}-error` : undefined}
                    role="alert"
                    className="__form-input-field__tw-18 __form-input-field__tw-state-7 __input-field__error"
                >
                    {error}
                </p>
                <p id={ID ? `${ID}-feedback` : undefined} className="__form-input-field__tw-19 __form-input-field__tw-state-8">
                    {feedback}
                </p>
            </fieldset>
        );
    }
) as unknown as <T extends "input" | "select" | "textarea">(props: PropsWithChildren<InputFieldProps<T>>) => React.ReactElement; // forwardRef return is non-generic; cast restores the polymorphic signature
