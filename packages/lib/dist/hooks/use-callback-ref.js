import { useEffect, useRef } from "react";
export const useCallbackRef = (fn) => {
    const ref = useRef(fn);
    useEffect(() => {
        ref.current = fn;
    });
    return ref;
};
