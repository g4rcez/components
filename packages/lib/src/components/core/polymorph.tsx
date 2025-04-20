import type React from "react";
import { forwardRef } from "react";
import { Merge, Override } from "../../types";

type TransformProps<E extends React.ElementType = React.ElementType> = Merge<
    {
        as?: E;
    } & React.ComponentPropsWithRef<E>
>;

export type PolymorphicProps<P extends object, E extends React.ElementType> = Merge<Override<TransformProps<E>, P>>;

const defaultElement = "span";

export const Polymorph: <E extends React.ElementType = React.ElementType>(props: TransformProps<E>) => React.ReactNode = forwardRef(
    function InnerPolymorph(props: TransformProps, ref: React.Ref<Element>) {
        const Element = props.as || defaultElement;
        return <Element ref={ref} {...props} as={undefined} />;
    }
) as any;
