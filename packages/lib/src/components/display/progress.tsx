import { Is } from "sidekicker";
import { Progress as RadixProgress } from "@base-ui/react/progress";
import { css } from "../../lib/dom";
import { PropsWithoutRef } from "react";
import { Label } from "../../types";

type ProgressProps = {
    max?: number;
    label?: Label;
    percent?: number;
    container?: string;
    className?: string;
    textClassName?: string;
};

export const Progress = (props: PropsWithoutRef<ProgressProps>) => {
    return (
        <RadixProgress.Root
            max={props.max}
            value={props.percent ?? null}
            style={{ transform: "translateZ(0)" }}
            className={css("relative h-6 w-full overflow-hidden rounded-full bg-background", props.container)}
        >
            <RadixProgress.Indicator
                style={{ transform: Is.number(props.percent) ? `translateX(-${100 - props.percent}%)` : undefined }}
                className={css("size-full bg-primary transition-transform duration-500 ease-in-out", props.className)}
            />
            {Is.number(props.percent) ? (
                <p
                    className={css(
                        "absolute inset-0 flex w-full items-center justify-center font-semibold tabular-nums text-primary-foreground",
                        props.textClassName
                    )}
                >
                    {props.label ? props.label : `${props.percent} %`}
                </p>
            ) : null}
        </RadixProgress.Root>
    );
};
