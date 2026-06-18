import type React from "react";
import { forwardRef } from "react";
import { css } from "../../lib/dom";

type PropsOf<T extends React.ElementType> = React.ComponentPropsWithoutRef<T>;

export type PolymorphicProps<Props, T extends React.ElementType> = Props & {
    as?: T;
} & Omit<PropsOf<T>, keyof Props | "as" | "ref"> & {
        ref?: React.ComponentProps<T>["ref"];
    };

export const Polymorph = forwardRef(function InnerPolymorph<P extends React.ElementType = "div">(props: PropsOf<P>, ref: React.ForwardedRef<P>) {
    const Element = props.as || "span";
    const component = typeof props["data-component"] === "string" ? props["data-component"] : undefined;
    const componentClassName = component ? `__${component}` : undefined;
    const className =
        typeof props.className === "string" && componentClassName && props.className.split(/\s+/).includes(componentClassName)
            ? props.className
            : css(componentClassName, props.className);

    return <Element ref={ref} {...props} as={undefined} className={className} />;
});
