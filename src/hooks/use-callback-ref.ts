import { MutableRefObject, useEffect, useRef } from "react";

type Fn = (...a: any[]) => any;

export const useCallbackRef = <F>(fn?: F): MutableRefObject<F | undefined> => {
    const ref = useRef<F | undefined>(fn);
    useEffect(() => {
        ref.current = fn;
    });
    return ref;
};
