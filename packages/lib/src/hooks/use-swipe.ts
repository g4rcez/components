import React, { useRef } from "react";

type SwipeDirection = "left" | "right";

export function useSwipe(onSwipe: (e: React.TouchEvent, direction: SwipeDirection) => void, threshold: number) {
    const touchStartX = useRef<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => (touchStartX.current = e.touches[0].clientX);

    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX.current;
        if (Math.abs(diff) > threshold) {
            onSwipe(e, diff > 0 ? "right" : "left");
        }
        touchStartX.current = null;
    };
    return { onTouchStart, onTouchEnd };
}
