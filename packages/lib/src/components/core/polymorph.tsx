import React, { ComponentProps, ElementRef, ElementType, forwardRef, PropsWithChildren } from "react";
import { Override } from "../../types";

type Polymorphism<T extends ElementType> = PropsWithChildren<{
    as?: T;
}>;

type Props<T extends ElementType = ElementType> = Polymorphism<T> & React.ComponentPropsWithRef<T>;

export type PolymorphicProps<P extends {}, T extends ElementType = ElementType> = Override<Props<T>, P>;

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

