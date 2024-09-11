"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
export const Resizable = ({ children }) => {
    const [ref, bounds] = useMeasure();
    return (_jsx(motion.div, { animate: { height: bounds.height > 0 ? bounds.height : "auto" }, children: _jsx("div", { ref: ref, children: children }) }));
};
