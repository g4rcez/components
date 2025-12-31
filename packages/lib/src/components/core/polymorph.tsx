import type React from "react";
import { forwardRef } from "react";

type PropsOf<T extends React.ElementType> = React.ComponentPropsWithoutRef<T>;

export type PolymorphicProps<Props, T extends React.ElementType> = Props & {
  as?: T;
} & Omit<PropsOf<T>, keyof Props | "as" | "ref"> & {
  ref?: React.ComponentProps<T>["ref"];
};

export const Polymorph = forwardRef(
  function InnerPolymorph<P extends React.ElementType = "div">(props: PropsOf<P>, ref: any) {
    const Element = props.as || "span";
    return <Element ref={ref} {...props} as={undefined} />;
  }
);
