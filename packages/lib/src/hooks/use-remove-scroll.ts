import { useEffect, useRef } from "react";
import { hasVerticalScroll } from "../lib/dom";
import { isSsr } from "../lib/fns";

export const useRemoveScroll = (remove: boolean) => {
    const prev = useRef(isSsr() ? "" : document.documentElement.style.overflowY);
    useEffect(() => {
        const html = document.documentElement;
        if (remove) {
            prev.current = document.documentElement.style.overflowY;
            html.style.overflowY = "hidden";
            html.style.padding = hasVerticalScroll(html) ? "0 15px 0 0" : "";
        } else {
            html.style.padding = "";
            document.documentElement.style.overflowY = prev.current;
        }
    }, [remove]);

    useEffect(() => {
        if (!remove) return;
        const controller = new AbortController();
        const html = document.documentElement;
        const removeScroll = (e: Event) => (e.target === html && remove ? e.preventDefault() : undefined);
        html.addEventListener("wheel", removeScroll, { signal: controller.signal, passive: false });
        html.addEventListener("scroll", removeScroll, { signal: controller.signal, passive: false });
        return () => {
            controller.abort();
        };
    }, [remove]);
};
