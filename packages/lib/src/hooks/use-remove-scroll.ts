import { useEffect, useRef } from "react";

export const useRemoveScroll = <T extends HTMLElement>(remove: boolean) => {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (!remove) return;
        const el = ref.current;
        if (!el) return;
        const controller = new AbortController();
        const onWheel = (e: WheelEvent) => {
            const atLimit = el.scrollHeight <= el.clientHeight;
            if (atLimit) e.preventDefault();
        };
        el.addEventListener("wheel", onWheel, { signal: controller.signal, passive: false });
        return () => controller.abort();
    }, [remove]);

    return ref;
};
