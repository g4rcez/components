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
        const html = document.documentElement;
        if (removeStyle === "overflow-hidden") {
            if (remove) {
                prev.current = document.documentElement.style.overflowY;
                html.style.overflowY = "hidden";
                if (isCoarseDevice || isMobile()) return;
                html.style.padding = hasVerticalScroll(html) ? "0 15px 0 0" : "";
            } else {
                html.style.padding = "";
                document.documentElement.style.overflowY = prev.current;
            }
        }
    }, [remove, isCoarseDevice, removeStyle]);

    useEffect(() => {
        if (!remove) return;
        const controller = new AbortController();
        const html = document.documentElement;
        const removeScroll = (e: Event) => {
            const el = ref.current;
            if (el) {
                if (el.contains(e.target as HTMLElement)) {
                    const rect = el.getBoundingClientRect();
                    const realHeight = el.style.height ? Number(onlyNumbers(el.style.height)) : null;
                    const scrollable = Is.number(realHeight) ? realHeight : rect.height;
                    const hasScroll = el.scrollHeight <= scrollable;
                    if (scrollable === el.scrollHeight) return remove ? e.preventDefault() : undefined;
                    if (hasScroll) return;
                    return remove ? e.preventDefault() : undefined;
                }
            }
            if (e.currentTarget === document.documentElement) {
                return remove ? e.preventDefault() : undefined;
            }
            return remove ? e.preventDefault() : undefined;
        };
        html.addEventListener("wheel", removeScroll, { signal: controller.signal, passive: false });
        html.addEventListener("scroll", removeScroll, { signal: controller.signal, passive: false });
        return () => {
            controller.abort();
        };
    }, [remove]);

    return ref;
};
