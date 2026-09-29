import { useEffect, useRef } from "react";
import { Is, onlyNumbers } from "sidekicker";

export const useRemoveScroll = <T extends HTMLElement>(remove: boolean) => {
    const ref = useRef<T | null>(null);

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
