"use client";
import { CheckCircle, XCircle } from "lucide-react";
import React, { Fragment, PropsWithChildren } from "react";
import { PolymorphicProps } from "~/components/core/polymorph";
import { css } from "~/lib/dom";
import { Label } from "~/types";

export type FeedbackProps = React.PropsWithChildren<
    Partial<{
        title: string | React.ReactElement | React.ReactNode;
        hideLeft?: boolean;
        className?: string;
        placeholder: string;
        reportStatus: boolean;
    }>
>;
export const InputFeedback = ({ reportStatus, hideLeft = false, className, children, title }: FeedbackProps) => (
    <div className={css("w-full justify-between", hideLeft && children === null ? "hidden" : "flex", className)}>
        {hideLeft ? null : (
            <span className="flex items-center gap-1 group-hover:text-primary group-focus-within:text-primary transition-colors group-error:text-danger">
                {title}
                {reportStatus ? (
                    <span className="flex aspect-square h-4 w-4 items-center justify-center">
                        <CheckCircle
                            className="hidden aspect-square h-3 w-3 opacity-0 transition-opacity group-assert:block group-assert:text-success group-assert:opacity-100"
                            aria-hidden="true"
                            size={16}
                            strokeWidth={1}
                            absoluteStrokeWidth
                        />
                        <XCircle
                            className="hidden aspect-square h-3 w-3 opacity-0 transition-opacity group-error:block group-error:opacity-100"
                            aria-hidden="true"
                            size={16}
                            strokeWidth={1}
                            absoluteStrokeWidth
                        />
                    </span>
                ) : null}
            </span>
        )}
        {children}
    </div>
);

export type InputFieldProps<T extends "input" | "select"> = PolymorphicProps<
    Partial<{
        error?: string;
        hideLeft: boolean;
        container: string;
        left: Label;
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
    optionalText = "Opcional",
    left,
    rightLabel,
    container,
    right,
    children,
    error,
    form,
    id,
    name,
    title,
    placeholder,
    hideLeft,
    required,
}: PropsWithChildren<InputFieldProps<T>>) => {
    const ID = id ?? name;
    return (
        <fieldset data-error={!!error} form={form} className={css("group inline-block w-full", container)}>
            <label
                form={form}
                htmlFor={ID}
                className="inline-flex w-full cursor-text flex-row flex-wrap justify-between gap-1 text-sm transition-colors empty:hidden group-error:text-danger group-hover:border-primary"
            >
                {!hideLeft && !rightLabel ? (
                    <InputFeedback hideLeft={hideLeft} reportStatus title={title} placeholder={placeholder}>
                        {optionalText || rightLabel ? (
                            <Fragment>
                                {!required ? <span className="text-opacity-70">{optionalText}</span> : null}
                                {rightLabel ? <Fragment>{rightLabel}</Fragment> : null}
                            </Fragment>
                        ) : null}
                    </InputFeedback>
                ) : null}
                <div className="group flex w-full flex-row flex-nowrap items-center gap-x-2 gap-y-1 rounded-md border border-input-border bg-transparent transition-colors group-focus-within:border-primary group-hover:border-primary group-error:border-danger">
                    {left ? <span className="flex flex-nowrap gap-1 whitespace-nowrap pl-2">{left}</span> : null}
                    {children}
                    {right ? <span className="flex flex-nowrap gap-2 whitespace-nowrap pr-1">{right}</span> : null}
                </div>
            </label>
            <p className="mt-1 text-xs group-error:block group-error:text-danger">{error}</p>
        </fieldset>
    );
};
