import { Is } from "sidekicker"
import { Progress as RadixProgress } from "radix-ui"
import { css } from "../../lib/dom";
import { PropsWithoutRef } from "react";

type ProgressProps = {
  max?: number
  percent?: number;
  container?: string;
  className?: string;
  textClassName?: string;
}

export const Progress = (props: PropsWithoutRef<ProgressProps>) => {
  return (
    <RadixProgress.Root
      max={props.max}
      value={props.percent}
      style={{ transform: "translateZ(0)", }}
      className={css("overflow-hidden relative w-full rounded-full h-6 bg-background", props.container)}
    >
      <RadixProgress.Indicator
        style={{ transform: Is.number(props.percent) ? `translateX(-${100 - props.percent}%)` : undefined }}
        className={css("bg-primary transition-transform ease-in-out size-full duration-500", props.className)}
      />
      {Is.number(props.percent)
        ? <p
          className={css("flex absolute inset-0 justify-center items-center w-full font-semibold tabular-nums text-primary-foreground", props.textClassName)}>
          {props.percent} %
        </p>
        : null}
    </RadixProgress.Root>
  );
}

