"use client";
import { animate, motion, useMotionValue } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { css } from "../../../lib/dom";
import { resizableStyles } from "./resizable.styles";

type Props = React.PropsWithChildren<{
    open?: boolean;
    className?: string;
    destroyOnUnmount?: boolean;
}>;

const DESTROY_DELAY_MS = 600;
const SPRING = {
    mass: 0.5,
    damping: 50,
    stiffness: 500,
    type: "spring" as const,
};

export const Resizable = ({ children, open = true, className, destroyOnUnmount = false }: Props) => {
    const [element, ref] = useState<HTMLDivElement | null>(null);
    const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);
    const [mounted, setMounted] = useState(destroyOnUnmount ? open : true);
    const height = useMotionValue<number>(0);

    useEffect(() => {
        if (!destroyOnUnmount) return;
        if (open) {
            setMounted(true);
            return;
        }
        const id = setTimeout(() => setMounted(false), DESTROY_DELAY_MS);
        return () => clearTimeout(id);
    }, [open, destroyOnUnmount]);

    useEffect(() => {
        if (!element) return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            const nextHeight = entry.contentRect.height;
            setMeasuredHeight((current) => (current === nextHeight ? current : nextHeight));
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [element]);

    useEffect(() => {
        if (measuredHeight === null) return;
        const controls = animate(height, open ? measuredHeight : 0, SPRING);
        return () => controls.stop();
    }, [height, measuredHeight, open]);

    if (!mounted) return null;

    return (
        <motion.div className={css(resizableStyles.className({}), className)} style={{ height: measuredHeight === null ? 0 : height }}>
            <div ref={ref} className={resizableStyles.slots.content}>
                {children}
            </div>
        </motion.div>
    );
};
