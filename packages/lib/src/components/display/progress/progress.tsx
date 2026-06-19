"use client";
import { Is } from "sidekicker";
import { Progress as RadixProgress } from "@base-ui/react/progress";
import { css } from "../../../lib/dom";
import type { PropsWithoutRef } from "react";
import type { Label } from "../../../types";

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
};

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export const Progress = (props: PropsWithoutRef<ProgressProps>) => {
    const min = props.min ?? 0;
    const max = props.max ?? 100;
    const range = max - min;
    const rawValue = props.value ?? props.percent;
    const hasValue = Is.number(rawValue) && range > 0;
    const percent = hasValue ? clamp(((rawValue! - min) / range) * 100, 0, 100) : null;

    return (
        <RadixProgress.Root
            min={min}
            max={max}
            value={hasValue ? rawValue! : null}
            style={{ transform: "translateZ(0)" }}
            data-component="progress"
            className={css("__progress", props.container)}
        >
            <RadixProgress.Indicator data-slot="indicator" className={css("__progress__indicator", props.className)} />
            {percent !== null ? (
                <p data-slot="label" className={css("__progress__label", props.textClassName)}>
                    {props.label ? props.label : `${Math.round(percent)} %`}
                </p>
            ) : null}
        </RadixProgress.Root>
    );
};
