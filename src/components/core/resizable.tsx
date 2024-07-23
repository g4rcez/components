"use client";
import { motion } from "framer-motion";
import React from "react";
import useMeasure from "react-use-measure";

export const Resizable = ({ children }: React.PropsWithChildren) => {
    const [ref, bounds] = useMeasure();
    return (
        <motion.div animate={{ height: bounds.height > 0 ? bounds.height : null }}>
            <div ref={ref}>{children}</div>
        </motion.div>
    );
};
