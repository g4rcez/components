"use client";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export type ToolbarProps = {
    root?: HTMLElement;
};

export const Toolbar = (props: PropsWithChildren<ToolbarProps>) => (
    <motion.div className="sticky bottom-4 flex items-center justify-center rounded-lg border border-card-border bg-background p-4">
        {props.children}
    </motion.div>
);
