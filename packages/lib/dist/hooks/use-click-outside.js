import { useEffect } from "react";
export const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target))
                return;
            handler(event);
        };
        const params = { passive: true };
        document.addEventListener("mousedown", listener, params);
        document.addEventListener("touchstart", listener, params);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
};
