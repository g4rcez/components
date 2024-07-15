import React, { PropsWithChildren } from "react";
import { css } from "../../lib/dom";
import { Polymorph } from "../core/polymorph";

export type CardProps = React.ComponentProps<"div"> & {
    header?: React.ReactElement;
    container?: string;
};

export const Card = ({ children, container = "", header = null, className = "", ...props }: PropsWithChildren<CardProps>) => (
    <Polymorph
        {...props}
        as="div"
        className={css("rounded-lg flex flex-col gap-4 bg-card-background py-8 border-card-border border shadow", container)}
    >
        {props.title ? <header className="w-full px-8 pb-2 mb-2 border-b border-card-border font-medium text-xl">{props.title}</header> : header}
        <div className={`min-w-full px-8 ${className}`}>{children}</div>
    </Polymorph>
);
