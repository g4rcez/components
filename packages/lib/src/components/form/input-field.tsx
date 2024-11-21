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
            <span className="flex items-center gap-1 transition-colors group-focus-within:text-primary group-hover:text-primary group-error:text-danger">
                {title}
                {reportStatus || info ? (
                    <span className="flex items-center justify-center gap-1">
                        {info ? (
                            <Tooltip
                                title={
                                    <span className="cursor-help">
                                        <span className="sr-only">{info}</span>
                                        <InfoIcon className="aspect-square size-3" aria-hidden="true" size={16} strokeWidth={1} absoluteStrokeWidth />
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
        <fieldset
            form={form}
            data-error={!!error}
            data-interactive={!!interactive}
            className={css("group grid min-h-0 min-w-0 grid-cols-1 items-baseline", container)}
        >
            <label
                form={form}
                htmlFor={ID}
                className="inline-flex cursor-text flex-row flex-wrap justify-between gap-1 text-sm transition-colors empty:hidden group-error:text-danger"
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
                    className={`group relative flex w-full flex-row flex-nowrap items-center gap-x-2 gap-y-1 rounded-md border border-input-border bg-transparent transition-colors group-hover:border-primary group-error:border-danger ${labelClassName}`}
                >
                    {left ? <span className="flex flex-nowrap gap-1 whitespace-nowrap pl-2">{left}</span> : null}
                    {children}
                    {right ? <span className="flex flex-nowrap gap-2 whitespace-nowrap pr-2">{right}</span> : null}
                </div>
            </label>
            <p className="mt-input-gap hidden flex-shrink-0 flex-grow-0 whitespace-pre-wrap text-wrap text-xs empty:mt-0 empty:hidden group-has-[input:not(:focus):invalid[data-initialized=true]]:inline-block group-error:inline-block group-error:text-danger">
                {error}
            </p>
            <p className="mt-input-gap text-xs empty:mt-0 empty:hidden group-has-[input:not(:focus):valid[data-initialized=true]]:block group-assert:block group-error:hidden">
                {feedback}
            </p>
        </fieldset>
    );
};
