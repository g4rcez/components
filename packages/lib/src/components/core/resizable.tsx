"use client";
import { motion, useMotionValue } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";
import { isSsr } from "../../lib/fns";

const defaultState = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
};

type State = typeof defaultState;

const useElementRect = <E extends Element = Element>() => {
    const [element, ref] = useState<E | null>(null);
    const motion = useMotionValue(defaultState);

    const observer = useMemo(
        () =>
            isSsr()
                ? null
                : new window.ResizeObserver((entries) => {
                      if (entries[0]) {
                          const rect = entries[0].contentRect;
                          motion.set({
                              x: rect.x,
                              y: rect.y,
                              width: rect.width,
                              height: rect.height,
                              top: rect.top,
                              left: rect.left,
                              bottom: rect.bottom,
                              right: rect.right,
                          });
                      }
                  }),
        []
    );

    useEffect(() => {
        if (!element) return;
        if (observer === null) return;
        observer.observe(element);
        return () => observer.disconnect();
    }, [element]);

    return [ref, motion] as const;
};

export const Resizable = ({ children }: React.PropsWithChildren) => {
    const [ref, bounds] = useElementRect();
    const h = bounds.get().height;
    return (
        <motion.div animate={{ height: h > 0 ? h : "auto" }}>
            <div ref={ref}>{children}</div>
        </motion.div>
    );
};
