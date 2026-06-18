"use client";
import { Slider as Base } from "@base-ui/react/slider";
import { Is } from "sidekicker";
import { css } from "../../lib/dom";
import { Tooltip } from "../floating/tooltip";
import { useEffect, useRef, useState } from "react";
import { uuid } from "../../lib/fns";
import { useLocale } from "../../hooks/use-locale";

type SliderProps = Parameters<typeof Base.Root>[0] & {
    tooltip?: boolean;
};

const Thumb = (props: { tooltip: boolean }) => {
    const [float, setFloat] = useState<number | null>(null);
    const ref = useRef<HTMLDivElement>(null);

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
        <Tooltip title="" ref={ref} as={Base.Thumb} enabled={props.tooltip} className="__form-slider__tw-1 __slider__thumb">
            {float}
        </Tooltip>
    );
};

export const Slider = (props: SliderProps) => {
    const { tooltip, className, defaultValue, value, ...restProps } = props;
    const id = useRef(uuid());
    const array = defaultValue || value || [];
    const locale = useLocale();

    return (
        <Base.Root {...restProps} value={value} locale={locale} defaultValue={defaultValue}>
            <Base.Control className={css("touch-none __form-slider__tw-2", className)}>
                <Base.Track className="__form-slider__tw-3">
                    <Base.Indicator className="__form-slider__tw-4" />
                </Base.Track>
                {Array.isArray(array) ? array.map((_, i) => <Thumb tooltip={tooltip ?? false} key={`${id.current}-${i}`} />) : null}
            </Base.Control>
        </Base.Root>
    );
};
