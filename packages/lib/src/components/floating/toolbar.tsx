"use client";
import { HTMLMotionProps, motion } from "motion/react";
import { forwardRef } from "react";

import { css } from "../../lib/dom";

export type ToolbarProps = HTMLMotionProps<"div"> & {
    root?: HTMLElement;
};

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar({ className, children, root: _root, ...props }, ref) {
    return (
        <motion.div
            {...props}
            ref={ref}
            role="toolbar"
            data-component="toolbar"
            className={css("__floating-toolbar__border __floating-toolbar__tw-1", className)}
        >
            {children}
        </motion.div>
    );
});
