import React, { PropsWithChildren } from "react";
import { css } from "../../lib/dom";
import { Label, Override } from "../../types";
import { Polymorph } from "../core/polymorph";

export type CardProps = Override<
    React.ComponentProps<"div">,
    {
        title?: Label;
        container?: string;
        header?: React.ReactElement | null;
    }
>;

export const Card = ({ children, title, container = "", header = null, className = "", ...props }: PropsWithChildren<CardProps>) => (
    <Polymorph
        {...props}
        as="div"
        className={css("rounded-card flex flex-col gap-4 bg-card-background py-4 pb-8 border-card-border border shadow", container)}
    >
        {title ? <header className="w-full px-8 pb-4 mb-2 border-b border-card-border font-medium text-xl">{title}</header> : header}
        <div className={`min-w-full px-8 ${className}`}>{children}</div>
    </Polymorph>
);
