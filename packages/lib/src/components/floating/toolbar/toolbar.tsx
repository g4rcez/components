"use client";
import { type HTMLMotionProps, motion } from "motion/react";
import { forwardRef } from "react";
import { css } from "../../../lib/dom";
import { toolbarStyles } from "./toolbar.styles";

export type ToolbarProps = HTMLMotionProps<"div"> & {
    root?: HTMLElement;
};

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar({ className, children, root: _root, ...props }, ref) {
    return (
        <motion.div {...props} ref={ref} role="toolbar" data-component="toolbar" className={css(toolbarStyles.className({}), className)}>
            {children}
        </motion.div>
    );
});
