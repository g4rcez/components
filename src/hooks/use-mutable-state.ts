import { useEffect, useRef } from "react";

export const useMutableState = <V>(v: V) => {
    const ref = useRef(v);
    useEffect(() => {
        ref.current = v;
    }, [v]);
    return ref;
};
