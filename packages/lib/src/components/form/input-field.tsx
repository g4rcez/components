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
            "__input-field__feedback",
            hideLeft && children === null ? "__input-field__feedback-hidden" : "__input-field__feedback-body",
            className
        )}
    >
        {hideLeft ? null : (
            <span className="__input-field__label-row __input-field__label-active __input-field__label-disabled">
                <span id={id ? `${id}-label` : undefined}>{title}</span>
                {reportStatus || info ? (
                    <span className="__input-field__label-meta">
                        {info ? (
                            <Tooltip
                                as="button"
                                type="button"
                                aria-label={typeof info === "string" ? info : undefined}
                                aria-describedby={typeof info === "string" ? undefined : id ? `tooltip-info-content-${id}` : undefined}
                                title={
                                    <span className="__input-field__tooltip-trigger">
                                        <span className="__input-field__tooltip-icon">
                                            <InfoIcon aria-hidden="true" className="__input-field__feedback-icon" />
                                        </span>
                                    </span>
                                }
                            >
                                <div
                                    id={id ? `tooltip-info-content-${id}` : undefined}
                                    className="__input-field__tooltip-body __input-field__tooltip-content"
                                >
                                    {info}
                                </div>
                            </Tooltip>
                        ) : null}
                        {reportStatus ? (
                            <span className="__input-field__status">
                                <span className="__input-field__status-indicator __input-field__status-success">
                                    <CheckCircleIcon aria-hidden="true" className="__input-field__status-icon" />
                                </span>
                                <span className="__input-field__status-indicator __input-field__status-error">
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
                className={css("__input-field__fieldset __input-field", container)}
            >
                <label form={form} htmlFor={ID} className={css("__input-field__label __input-field__label-layout __input-field__label-state")}>
                    {hiddenLabel ? (
                        <span className="__input-field__sr-only">
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
                                            className="__input-field__optional __input-field__optional-state __input-field__optional-text"
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
                            "__input-field__border __input-field__control __input-field__control-surface __input-field__control-state __input-field__control-disabled",
                            labelClassName
                        )}
                    >
                        {left ? <span className="__input-field__slot-start __input-field__slot">{left}</span> : null}
                        {children}
                        {right ? <span className="__input-field__slot-end __input-field__slot">{right}</span> : null}
                    </div>
                </label>
                <p
                    id={ID ? `${ID}-error` : undefined}
                    role="alert"
                    className="__input-field__error-text __input-field__error-state __input-field__error"
                >
                    {error}
                </p>
                <p id={ID ? `${ID}-feedback` : undefined} className="__input-field__feedback-text __input-field__feedback-state">
                    {feedback}
                </p>
            </fieldset>
        );
    }
) as unknown as <T extends "input" | "select" | "textarea">(props: PropsWithChildren<InputFieldProps<T>>) => React.ReactElement; // forwardRef return is non-generic; cast restores the polymorphic signature
