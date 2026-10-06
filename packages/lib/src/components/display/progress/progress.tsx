"use client";
import { Is } from "sidekicker";
import { Progress as RadixProgress } from "@base-ui/react/progress";
import { css } from "../../../lib/dom";
import { useId, type PropsWithoutRef } from "react";
import type { Label } from "../../../types";
import { progressStyles } from "./progress.styles";

type ProgressProps = {
    min?: number;
    max?: number;
    value?: number;
    /** @deprecated use value */
    percent?: number;
    label?: Label;
    className?: string;
    container?: string;
    textClassName?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
};

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export const Progress = (props: PropsWithoutRef<ProgressProps>) => {
    const min = props.min ?? 0;
    const max = props.max ?? 100;
    const range = max - min;
    const rawValue = props.value ?? props.percent;
    const numericValue = Is.number(rawValue) ? rawValue : undefined;
    const hasValue = numericValue !== undefined && range > 0;
    const normalizedValue = hasValue ? clamp(numericValue, min, max) : null;
    const percent = normalizedValue === null ? null : clamp(((normalizedValue - min) / range) * 100, 0, 100);
    const hasLabel = Boolean(props.label) && (typeof props.label !== "string" || props.label.trim().length > 0) && percent !== null;
    const labelId = useId();

    return (
        <RadixProgress.Root
            min={min}
            max={max}
            value={normalizedValue}
            style={{ transform: "translateZ(0)" }}
            data-component="progress"
            className={css(progressStyles.className({}), props.container)}
            aria-label={hasLabel ? undefined : props["aria-label"]}
            aria-labelledby={hasLabel ? labelId : props["aria-labelledby"]}
        >
            <RadixProgress.Indicator data-slot="indicator" className={css(progressStyles.slots.indicator, props.className)} />
            {percent !== null ? (
                <p id={hasLabel ? labelId : undefined} data-slot="label" className={css(progressStyles.slots.label, props.textClassName)}>
                    {hasLabel ? props.label : `${Math.round(percent)} %`}
                </p>
            ) : null}
        </RadixProgress.Root>
    );
};
