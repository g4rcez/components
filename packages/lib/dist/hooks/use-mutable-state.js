import { useEffect, useRef } from "react";
export const useMutableState = (v) => {
    const ref = useRef(v);
    useEffect(() => {
        ref.current = v;
    }, [v]);
    return ref;
};
