"use client";
import React, { type PropsWithChildren, useLayoutEffect, useRef, useState } from "react";
import { useStableRef } from "../../../hooks/use-stable-ref";
import type { PolymorphicProps } from "../polymorph/polymorph";

export type RenderOnViewProps<T extends React.ElementType = "div"> = PolymorphicProps<
    {
        onIntersection?: () => void;
    },
    T
>;

export const RenderOnView = <T extends React.ElementType = "div">({
    as,
    children,
    onIntersection,
    ...props
}: PropsWithChildren<RenderOnViewProps<T>>) => {
    const onIntersect = useStableRef(onIntersection);
    const ref = useRef<HTMLElement | null>(null);
    const [shouldRender, setShouldRender] = useState(false);

    useLayoutEffect(() => {
        const element = ref.current;
        if (element === null) return;
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (!first) return;
            if (first.isIntersecting) {
                onIntersect.current?.();
                setShouldRender(true);
            }
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [onIntersect]);

    const Element = as ?? "div";
    return React.createElement(Element, { ...props, ref }, shouldRender ? children : null);
};
