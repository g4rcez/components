"use client";
import React, { PropsWithChildren, useLayoutEffect, useRef, useState } from "react";
import { useStableRef } from "../../hooks/use-stable-ref";
import { PolymorphicProps } from "./polymorph";

export type RenderOnViewProps<T extends React.ElementType = "div"> = PolymorphicProps<
    {
        onIntersection?: () => void;
    },
    T
>;

function isInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}

export const RenderOnView = ({ children, ...props }: PropsWithChildren<RenderOnViewProps>) => {
    const onIntersect = useStableRef(props.onIntersection);
    const ref = useRef<HTMLDivElement>(null);
    const [shouldRender, setShouldRender] = useState(() => (ref.current === null ? false : isInViewport(ref.current)));

    useLayoutEffect(() => {
        const div = ref.current;
        if (div === null) return;
        const observer = new IntersectionObserver((args) => {
            const first = args[0];
            if (first.isIntersecting) onIntersect.current?.();
            return setShouldRender((prev) => (first.isIntersecting ? true : prev));
        });
        observer.observe(div);
        return () => observer.disconnect();
    }, []);

    return (
        <div {...props} ref={ref}>
            {shouldRender ? children : null}
        </div>
    );
};
