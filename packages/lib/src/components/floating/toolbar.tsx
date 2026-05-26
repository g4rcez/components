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
            className={css(
                "sticky bottom-toolbar-bottom flex items-center justify-center rounded-toolbar-radius border border-card-border bg-background p-toolbar-p",
                className
            )}
        >
            {children}
        </motion.div>
    );
});
