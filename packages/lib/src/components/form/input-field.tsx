"use client";
import { CheckCircle, InfoIcon, XCircle } from "lucide-react";
import React, { Fragment, PropsWithChildren } from "react";
import { useTranslations } from "../../hooks/use-translate-context";
import { css } from "../../lib/dom";
import { Label } from "../../types";
import { PolymorphicProps } from "../core/polymorph";
import { Tooltip } from "../floating/tooltip";

export type FeedbackProps = React.PropsWithChildren<
    Partial<{
        info: Label;
        title: Label;
        hideLeft?: boolean;
        className?: string;
        placeholder: string;
        reportStatus: boolean;
    }>
>;

export const InputFeedback = ({ reportStatus, hideLeft = false, className, info, children, title }: FeedbackProps) => (
    <div className={css("w-full justify-between", hideLeft && children === null ? "hidden" : "flex", className)}>
        {hideLeft ? null : (
            <span className="flex items-center gap-1 group-hover:text-primary group-focus-within:text-primary transition-colors group-error:text-danger">
                {title}
                {reportStatus || info ? (
                    <span className="flex gap-1 items-center justify-center">
                        {info ? (
                            <Tooltip
                                title={
                                    <span>
                                        <span className="sr-only">{info}</span>
                                        <InfoIcon
                                            className="aspect-square size-3"
                                            aria-hidden="true"
                                            size={16}
                                            strokeWidth={1}
                                            absoluteStrokeWidth
                                        />
                                    </span>
                                }
                            >
                                {info}
                            </Tooltip>
                        ) : null}
                        {reportStatus ? (
                            <Fragment>
                                <CheckCircle
                                    className="hidden aspect-square size-3 opacity-0 transition-opacity group-assert:block group-assert:text-success group-assert:opacity-100"
                                    aria-hidden="true"
                                    size={16}
                                    strokeWidth={1}
                                    absoluteStrokeWidth
                                />
                                <XCircle
                                    className="hidden aspect-square size-3 opacity-0 transition-opacity group-error:block group-error:opacity-100"
                                    aria-hidden="true"
                                    size={16}
                                    strokeWidth={1}
                                    absoluteStrokeWidth
                                />
                            </Fragment>
                        ) : null}
                    </span>
                ) : null}
            </span>
        )}
        {children}
    </div>
);

export type InputFieldProps<T extends "input" | "select"> = PolymorphicProps<
    Partial<{
        info: Label;
        labelClassName: string;
        error: string;
        hideLeft: boolean;
        interactive: boolean;
        container: string;
        left: Label;
        feedback: Label;
        optionalText: string;
        right: Label;
        rightLabel: Label;
        id: string;
        name: string;
        placeholder: string;
    }>,
    T
>;

export const InputField = <T extends "input" | "select">({
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
    placeholder,
    hideLeft,
    required,
}: PropsWithChildren<InputFieldProps<T>>) => {
    const ID = id ?? name;
    const translation = useTranslations();
    const optionalText = _optionalText ?? translation.inputOptionalLabel;
    return (
        <fieldset form={form} data-error={!!error} data-interactive={!!interactive} className={css("group inline-flex gap-1.5 w-full", container)}>
            <label
                form={form}
                htmlFor={ID}
                className="inline-flex w-full cursor-text flex-row flex-wrap justify-between gap-1 text-sm transition-colors empty:hidden group-error:text-danger group-hover:border-primary"
            >
                {!hideLeft && !rightLabel ? (
                    <InputFeedback info={info} hideLeft={hideLeft} reportStatus title={title} placeholder={placeholder}>
                        {optionalText || rightLabel ? (
                            <Fragment>
                                {!required ? <span className="text-opacity-70">{optionalText}</span> : null}
                                {rightLabel ? <Fragment>{rightLabel}</Fragment> : null}
                            </Fragment>
                        ) : null}
                    </InputFeedback>
                ) : null}
                <div
                    className={`relative group flex w-full flex-row flex-nowrap items-center gap-x-2 gap-y-1 rounded-md border border-input-border bg-transparent transition-colors group-focus-within:border-primary group-hover:border-primary group-error:border-danger ${labelClassName}
                    focus:ring-2 focus:ring-inset focus:ring-primary
                    `}
                >
                    {left ? <span className="absolute left-0 flex flex-nowrap gap-1 whitespace-nowrap pl-2">{left}</span> : null}
                    {children}
                    {right ? <span className="absolute right-0 flex flex-nowrap gap-2 whitespace-nowrap pr-1">{right}</span> : null}
                </div>
            </label>
            <p className="group-error:block empty:hidden group-error:text-danger hidden text-xs group-has-[input:not(:focus):invalid[data-initialized=true]]:block">
                {error}
            </p>
            <p className="text-xs group-assert:block group-error:hidden empty:mt-0 empty:hidden group-has-[input:not(:focus):valid[data-initialized=true]]:block">{feedback}</p>
        </fieldset>
    );
};
