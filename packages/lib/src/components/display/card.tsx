import React, { PropsWithChildren } from "react";
import { css } from "../../lib/dom";
import { Label, Override } from "../../types";
import { Polymorph, PolymorphicProps } from "../core/polymorph";

export type CardProps = PolymorphicProps<
    Override<
        React.ComponentProps<"div">,
        {
            title?: Label;
            container?: string;
            header?: React.ReactElement | null;
        }
    >,
    "div"
>;

export const Card = ({ children, title, as = "div", container = "", header = null, className = "", ...props }: PropsWithChildren<CardProps>) => (
    <Polymorph
        {...props}
        as={as}
        className={css("flex flex-col gap-4 rounded-card border border-card-border bg-card-background py-4 pb-8 shadow", container)}
    >
        {title ? <header className="mb-2 w-full border-b border-card-border px-8 pb-4 text-xl font-medium">{title}</header> : header}
        <div className={css("min-w-full px-8", className)}>{children}</div>
    </Polymorph>
);
