import React, { ComponentProps, ElementRef, ElementType, forwardRef, PropsWithChildren } from "react";
import { Override } from "../../types";

type Polymorphism<T extends ElementType> = PropsWithChildren<{
    as?: T;
}>;

type Props<T extends ElementType = ElementType> = Polymorphism<T> & Omit<React.ComponentPropsWithRef<T>, keyof Polymorphism<T>>;

export type PolymorphicProps<P extends {}, T extends ElementType = ElementType> = Override<Props<T>, P> & Polymorphism<T>;

export const Polymorph: <T extends ElementType>(p: PolymorphicProps<ComponentProps<T>, T>) => React.ReactElement = forwardRef(function Polymorph<
    T extends ElementType,
>({ as, children, ...props }: PolymorphicProps<{}, T>, ref: React.ForwardedRef<ElementRef<T>>) {
    const Component = (as as any) || "span";
    return (
        <Component ref={ref} {...props}>
            {children}
        </Component>
    );
}) as any;
