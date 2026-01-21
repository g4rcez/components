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
    <Tooltip
      title=""
      ref={ref}
      as={Base.Thumb}
      enabled={props.tooltip}
      className="block rounded-full focus-within:border-primary focus-within::scale-105 bg-input-switch size-5 cursor-grab border-2 border-input-border shadow-shadow-floating focus-within:outline active:cursor-grabbing"
    >
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
    <Base.Root
      {...restProps}
      value={value}
      locale={locale}
      defaultValue={defaultValue}
    >
      <Base.Control className={css("relative flex h-5 w-full touch-none select-none items-center", className)}>
        <Base.Track className="relative h-2 rounded-full grow bg-background">
          <Base.Indicator className="absolute h-full rounded-full bg-primary" />
        </Base.Track>
        {Array.isArray(array) ? array.map((_, i) => (
          <Thumb tooltip={tooltip ?? false} key={`${id.current}-${i}`} />
        )) : null}
      </Base.Control>
    </Base.Root>
  );
};
