import type React from "react";
import { forwardRef } from "react";
import { Any, Override } from "../../types";

type TransformProps<E extends React.ElementType = React.ElementType> = {
    as?: E;
};

export type PolymorphicProps<P extends Any, E extends React.ElementType> = Override<
    TransformProps<E> & Omit<React.ComponentProps<E>, keyof TransformProps>,
    P
>;

type InnerPolymorphicProps<E extends React.ElementType> = TransformProps<E> & Omit<React.ComponentProps<E>, keyof TransformProps>;

const defaultElement = "span";

export const Polymorph: <E extends React.ElementType = typeof defaultElement>(props: InnerPolymorphicProps<E>) => React.ReactElement | null =
    forwardRef(function InnerPolymorph(props: TransformProps, ref: React.Ref<Element>) {
        const Element = props.as || defaultElement;
        return <Element ref={ref} {...props} as={undefined} />;
    }) as any;
