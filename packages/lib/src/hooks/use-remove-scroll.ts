import { useEffect, useRef } from "react";
import { Is, onlyNumbers } from "sidekicker";
import { hasVerticalScroll } from "../lib/dom";
import { isMobile, isSsr } from "../lib/fns";
import { useIsCoarseDevice } from "./use-is-coarse-device";

type ScrollRemoveStyle = "overflow-hidden" | "block-only";

export const useRemoveScroll = <T extends HTMLElement>(remove: boolean, removeStyle: ScrollRemoveStyle = "overflow-hidden") => {
    const ref = useRef<T | null>(null);
    const isCoarseDevice = useIsCoarseDevice();
    const prev = useRef(isSsr() ? "" : document.documentElement.style.overflowY);

    useEffect(() => {
        if (ref.current === null && !remove) return;
        if (removeStyle === "block-only") return;
        if (removeStyle === "overflow-hidden") {
            if (remove) {
                prev.current = document.documentElement.style.overflowY;
                document.documentElement.style.overflowY = "hidden";
                if (isCoarseDevice || isMobile()) return;
                document.documentElement.style.padding = hasVerticalScroll(document.documentElement) ? "0 15px 0 0" : "";
            } else {
                document.documentElement.style.padding = "";
                document.documentElement.style.overflowY = prev.current;
            }
        }
    }, [remove, isCoarseDevice, removeStyle]);

    useEffect(() => {
        if (!remove) return;
        const el = ref.current;
        if (!el) return;
        const controller = new AbortController();
        const onWheel = (e: WheelEvent) => {
            const rect = el.getBoundingClientRect();
            const realHeight = el.style.height ? Number(onlyNumbers(el.style.height)) : null;
            const scrollable = Is.number(realHeight) ? realHeight : rect.height;
            const atLimit = el.scrollHeight <= scrollable;
            if (atLimit) e.preventDefault();
        };
        el.addEventListener("wheel", onWheel, { signal: controller.signal, passive: false });
        return () => controller.abort();
    }, [remove]);

    return ref;
};
