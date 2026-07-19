import type React from "react";
import type { PropsWithChildren } from "react";
import { css } from "../../../lib/dom";
import { headingStyles } from "./heading.styles";
import { Polymorph, type PolymorphicProps } from "../polymorph/polymorph";

export type HeadingProps<T extends React.ElementType = "h2"> = PolymorphicProps<object, T>;

export const Heading = <T extends React.ElementType = "h2">({ as, ...props }: PropsWithChildren<HeadingProps<T>>) => {
    return (
        <Polymorph {...props} as={as || "h2"} data-component="heading" className={css(headingStyles.className({}), props.className)}>
            {props.children}
        </Polymorph>
    );
};
