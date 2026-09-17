import { useEffect, useRef } from "react";
import { Is, onlyNumbers } from "sidekicker";
import { hasVerticalScroll } from "../lib/dom";
import { isMobile } from "../lib/fns";
import { useIsCoarseDevice } from "./use-is-coarse-device";

type ScrollRemoveStyle = "overflow-hidden" | "block-only";
type ScrollStyleSnapshot = Pick<CSSStyleDeclaration, "overflowY" | "padding" | "paddingRight">;

let scrollLockCount = 0;
let scrollLockSnapshot: ScrollStyleSnapshot | null = null;

const acquireScrollLock = (isCoarseDevice: boolean) => {
    const root = document.documentElement;
    if (scrollLockCount === 0) {
        scrollLockSnapshot = {
            overflowY: root.style.overflowY,
            padding: root.style.padding,
            paddingRight: root.style.paddingRight,
        };
        root.style.overflowY = "hidden";
        if (!isCoarseDevice && !isMobile()) {
            root.style.padding = hasVerticalScroll(root) ? "0 15px 0 0" : "";
        }
    }
    scrollLockCount += 1;
    let released = false;

    return () => {
        if (released) return;
        released = true;
        scrollLockCount -= 1;
        if (scrollLockCount > 0 || scrollLockSnapshot === null) return;
        root.style.overflowY = scrollLockSnapshot.overflowY;
        root.style.padding = scrollLockSnapshot.padding;
        root.style.paddingRight = scrollLockSnapshot.paddingRight;
        scrollLockSnapshot = null;
    };
};

export const useRemoveScroll = <T extends HTMLElement>(remove: boolean, removeStyle: ScrollRemoveStyle = "overflow-hidden") => {
    const ref = useRef<T | null>(null);
    const isCoarseDevice = useIsCoarseDevice();

    useEffect(() => {
        if (!remove || removeStyle !== "overflow-hidden" || ref.current === null) return;
        return acquireScrollLock(isCoarseDevice);
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
