"use client";
import { animate, motion, useMotionValue } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

type Props = React.PropsWithChildren<{
  open?: boolean;
  className?: string;
  destroyOnUnmount?: boolean;
}>;

const DESTROY_DELAY_MS = 600;
const SPRING = {
  type: "spring" as const,
  stiffness: 500,
  damping: 50,
  mass: 0.5,
};

export const Resizable = ({
  children,
  open = true,
  className,
  destroyOnUnmount = false,
}: Props) => {
  const [element, ref] = useState<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(destroyOnUnmount ? open : true);
  const measured = useRef(0);
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
      const h = entry.contentRect.height;
      if (h <= 0) return;
      measured.current = h;
      if (!ready) {
        height.jump(open ? h : 0);
        setReady(true);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, ready, open, height]);

  useEffect(() => {
    if (!ready) return;
    const controls = animate(height, open ? measured.current : 0, SPRING);
    return () => controls.stop();
  }, [open, ready, height]);

  if (!mounted) return null;

  return (
    <motion.div
      className={className}
      style={{ height: ready ? height : open ? "auto" : 0, overflow: "hidden" }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  );
};
