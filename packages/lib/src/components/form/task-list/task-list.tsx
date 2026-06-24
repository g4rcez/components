"use client";
import { stagger, useAnimate } from "motion/react";
import { type ComponentProps, type PropsWithChildren, useEffect } from "react";
import { css } from "../../../lib/dom";
import { taskListStyles } from "./task-list.styles";

export const TaskList = ({ className, ...props }: PropsWithChildren<ComponentProps<"fieldset">>) => {
    const [ref, animate] = useAnimate();

    useEffect(() => {
        const container = ref.current as HTMLFieldSetElement | null;
        if (!container) return;
        const handler = (e: Event) => {
            const input = e.target as HTMLInputElement;
            const items = Array.from(container.querySelectorAll("input[data-task=true]")) as HTMLInputElement[];
            const allTaskChecked = items.every((el) => el.checked);
            const index = items.indexOf(input);
            if (allTaskChecked && index !== -1) {
                animate(
                    "input",
                    { scale: [1, 1.35, 1], rotate: [0, 20, -20, 0] },
                    {
                        duration: 0.5,
                        delay: stagger(0.075, { from: index }),
                    }
                );
            }
        };
        container.addEventListener("change", handler);
        return () => container.removeEventListener("change", handler);
    }, [ref, animate]);

    return <fieldset {...props} className={css(taskListStyles.className(), className)} data-component="task-list" ref={ref} />;
};
