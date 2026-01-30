"use client";
import { useEffect, useRef } from "react";
import { noop } from "../lib/fns";

export const useResizeObserver = (
  element: HTMLElement | null,
  onResize: (entry: ResizeObserverEntry) => void
) => {
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        onResizeRef.current(entries[0]);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
};
