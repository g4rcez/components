"use client";
import { motion } from "motion/react";
import { PropsWithChildren } from "react";

export type ToolbarProps = {
    root?: HTMLElement;
};

export const Toolbar = (props: PropsWithChildren<ToolbarProps>) => (
    <motion.div className="sticky bottom-toolbar-bottom flex items-center justify-center rounded-toolbar-radius border border-card-border bg-background p-toolbar-p">
        {props.children}
    </motion.div>
);
