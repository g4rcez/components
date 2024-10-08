import React, { forwardRef } from "react";
import { Override } from "../../types";

type Polymorphism<T extends React.ElementType> = React.PropsWithChildren<{ as?: T }>;

type Props<T extends React.ElementType = React.ElementType> = Polymorphism<T> & Omit<React.ComponentPropsWithRef<T>, keyof Polymorphism<T>>;

export type PolymorphicProps<P extends {}, T extends React.ElementType = React.ElementType> = Omit<
    T extends string ? Override<React.ComponentProps<T> & Props<T>, P> : Override<Props<T>, P>,
    keyof Polymorphism<T>
> &
    Polymorphism<T>;

export const Polymorph = forwardRef(function Polymorph<T extends React.ElementType>({ as, ...props }: Props<T>, ref: React.ForwardedRef<any>) {
    const Component = as || "span";
    return <Component {...props} ref={ref} />;
});
