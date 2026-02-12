"use client";
import { CheckCircle, InfoIcon, XCircle } from "lucide-react";
import React, { forwardRef, Fragment, type PropsWithChildren } from "react";
import { useTranslations } from "../../hooks/use-translations";
import { useTweaks } from "../../hooks/use-tweaks";
import { css } from "../../lib/dom";
import { type Label, Override } from "../../types";
import { type PolymorphicProps } from "../core/polymorph";
import { Tooltip } from "../floating/tooltip";

export type FeedbackProps = React.PropsWithChildren<
  Partial<{
    id: string;
    info: Label;
    title: Label;
    hideLeft?: boolean;
    className?: string;
    placeholder: string;
    reportStatus: boolean;
  }>
>;

export const InputFeedback = ({ reportStatus, id, hideLeft = false, className, info, children, title }: FeedbackProps) => (
  <span className={css("max-w-full justify-between w-fit", hideLeft && children === null ? "hidden" : "flex", className)}>
    {hideLeft ? null : (
      <span className="flex flex-1 gap-1 items-center transition-colors group-disabled:text-disabled group-error:text-danger group-hover:text-primary group-focus-within:text-primary">
        {title}
        {reportStatus || info ? (
          <span className="flex gap-1 justify-center items-center">
            {info ? (
              <Tooltip
                as="button"
                type="button"
                aria-label={typeof info === "string" ? info : undefined}
                aria-describedby={typeof info === "string" ? undefined : id ? `tooltip-info-content-${id}` : undefined}
                title={<span className="cursor-help">
                  <InfoIcon className="aspect-square size-3" aria-hidden="true" size={16} strokeWidth={1} absoluteStrokeWidth />
                </span>}
              >
                <div id={id ? `tooltip-info-content-${id}` : undefined} className="w-full max-w-48 whitespace-break-spaces wrap-break-word">{info}</div>
              </Tooltip>
            ) : null}
            {reportStatus ? (
              <span className="flex items-center h-3 min-w-6">
                <CheckCircle
                  className="hidden opacity-0 transition-opacity aspect-square size-3 group-assert:block group-assert:text-success group-assert:opacity-100"
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1}
                  absoluteStrokeWidth />
                <XCircle
                  className="hidden opacity-0 transition-opacity aspect-square size-3 group-error:block group-error:opacity-100"
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1}
                  absoluteStrokeWidth />
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
        loading: boolean;
        componentName: string;
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
    }: PropsWithChildren<InputFieldProps<T>>,
    ref: any
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
        className={css("group flex min-h-0 max-w-full min-w-0 flex-col items-start", container)}
      >
        <label
          form={form}
          htmlFor={ID}
          className="inline-flex relative flex-row flex-wrap gap-1 justify-between w-full max-w-full text-sm transition-colors cursor-text empty:hidden text-field-label group-disabled:cursor-not-allowed group-error:text-danger"
        >
          <InputFeedback info={info} hideLeft={hideLeft} reportStatus={reportStatusDefault} title={title} placeholder={placeholder}>
            {optionalText || rightLabel ? (
              <Fragment>
                {!required ? (
                  <span aria-disabled={disabled} className="text-opacity-70 transition-colors aria-disabled:text-disabled group-hover:text-primary group-focus-within:text-primary">
                    {optionalText}
                  </span>
                ) : null}
                {rightLabel ? <Fragment>{rightLabel}</Fragment> : null}
              </Fragment>
            ) : null}
          </InputFeedback>
          <div
            className={`group relative flex w-full flex-row flex-nowrap items-center gap-x-2 gap-y-1 rounded-md border border-input-border bg-transparent transition-colors group-hover:border-primary group-disabled:border-disabled group-error:border-danger ${labelClassName}`}
          >
            {left ? <span className="flex flex-nowrap gap-1 pl-2 whitespace-nowrap">{left}</span> : null}
            {children}
            {right ? <span className="flex flex-nowrap gap-2 pr-2 whitespace-nowrap">{right}</span> : null}
          </div>
        </label>
        <p className="mt-input-gap hidden whitespace-pre-wrap text-wrap text-xs empty:mt-0 empty:hidden group-has-[input:not(:focus):invalid[data-initialized=true]]:flex group-error:flex group-error:text-danger">
          {error}
        </p>
        <p className="mt-input-gap text-xs empty:mt-0 empty:hidden group-has-[input:not(:focus):valid[data-initialized=true]]:block group-assert:block group-error:hidden">
          {feedback}
        </p>
      </fieldset>
    );
  }
) as any;
