"use client";
import { type HTMLMotionProps, motion, type Transition } from "motion/react";
import { type PropsWithChildren } from "react";
import { css } from "../../../lib/dom";
import { Resizable } from "../../core/resizable/resizable";

const transition: Transition = {
    type: "tween",
    duration: 0.35,
    ease: [0.04, 0.62, 0.23, 0.98],
};

type CollapseProps = HTMLMotionProps<"section"> & { open: boolean };

export const Collapse = (props: PropsWithChildren<CollapseProps>) => (
    <motion.div
        {...(props as unknown as HTMLMotionProps<"div">)}
        initial={false}
        transition={transition}
        aria-hidden={!props.open}
        data-component="collapse"
        animate={{ opacity: props.open ? 1 : 0 }}
        className={css("__collapse", props.className)}
    >
        <Resizable open={props.open} destroyOnUnmount>
            {props.children}
        </Resizable>
    </motion.div>
);
