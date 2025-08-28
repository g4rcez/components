"use client";
import { Slider as RadixSlider } from "radix-ui";
import { Is } from "sidekicker";
import { css } from "../../lib/dom";
import { Tooltip } from "../floating/tooltip";
import { useEffect, useRef, useState } from "react";
import { uuid } from "../../lib/fns";

type SliderProps = Parameters<typeof RadixSlider.Root>[0] & {
    tooltip?: boolean;
};

const Thumb = (props: { tooltip: boolean }) => {
    const [float, setFloat] = useState<number | null>(null);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const html = ref.current;
        if (html === null) return;
        const initialValue = Number(html.getAttribute("aria-valuenow"));
        if (Is.number(initialValue)) {
            setFloat(initialValue);
        }
        const observer = new MutationObserver((changes) => {
            const span = changes[0].target as HTMLSpanElement;
            const value = Number(span.getAttribute("aria-valuenow"));
            setFloat(Is.number(value) ? value : null);
        });
        observer.observe(html, { attributeFilter: ["aria-valuenow"] });
        return () => observer.disconnect();
    }, []);

    return (
        <Tooltip
            title=""
            ref={ref}
            as={RadixSlider.Thumb}
            enabled={props.tooltip}
            className="block rounded-full bg-input-switch size-5 cursor-grab border-1 border-input-border shadow-shadow-floating active:cursor-grabbing"
        >
            {float}
        </Tooltip>
    );
};

export const Slider = (props: SliderProps) => {
    const { tooltip, className, defaultValue, value, ...restProps } = props;
    const id = useRef(uuid());
    const array = defaultValue || value || [];

    return (
        <RadixSlider.Root
            {...restProps}
            defaultValue={defaultValue}
            value={value}
            className={css("relative flex h-5 w-full touch-none select-none items-center", className)}
        >
            <RadixSlider.Track className="relative h-2 rounded-full grow bg-background">
                <RadixSlider.Range className="absolute h-full rounded-full bg-primary" />
            </RadixSlider.Track>
            {array.map((_, i) => (
                <Thumb tooltip={tooltip ?? false} key={`${id.current}-${i}`} />
            ))}
        </RadixSlider.Root>
    );
};
