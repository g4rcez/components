"use client";
import { AnimatePresence, type HTMLMotionProps, motion, type Transition } from "motion/react";
import type { PropsWithChildren } from "react";
import { css } from "../../../lib/dom";
import { Resizable } from "../../core/resizable/resizable";

const transition: Transition = {
    type: "tween",
    duration: 0.35,
    ease: [0.04, 0.62, 0.23, 0.98],
};

type CollapseProps = HTMLMotionProps<"div"> & { open: boolean };

export const Collapse = ({ open, children, className, ...props }: PropsWithChildren<CollapseProps>) => (
    // initial={false} on AnimatePresence keeps content that is open on first render still; later mounts fade in.
    <AnimatePresence mode="popLayout" propagate initial={false}>
        {open ? (
            <motion.div
                {...props}
                initial={{ opacity: 0 }}
                aria-hidden={!open}
                transition={transition}
                animate={{ opacity: 1, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
                data-component="collapse"
                exit={{ opacity: 0, height: 0 }}
                className={css("__collapse", className)}
            >
                <Resizable open={open} destroyOnUnmount>
                    {children}
                </Resizable>
            </motion.div>
        ) : null}
    </AnimatePresence>
);
