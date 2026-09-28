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
    <AnimatePresence mode="popLayout" propagate>
        {open ? (
            <motion.div
                {...props}
                initial={false}
                aria-hidden={!open}
                transition={transition}
                animate={{ opacity: 1 }}
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
