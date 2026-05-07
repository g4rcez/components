import type { PropsWithChildren } from "react";
import React, { type ComponentProps } from "react";
import { css } from "../../lib/dom";
import { Label } from "../../types";

export const Paragraph = (props: ComponentProps<"p">) => <p {...props} className={css("text-base leading-snug", props.className)} />;

export const Description = (props: ComponentProps<"p">) => <p {...props} className={css("mb-kilo text-sm text-secondary", props.className)} />;

export type InfoProps = {
    info?: Label;
    label: Label;
    row?: boolean;
    disabled?: Label;
    className?: string;
    infoDescription?: string;
};

export const Info = (props: React.PropsWithChildren<InfoProps>) => (
    <div className={css(`flex ${props.row ? "flex-row items-center" : "flex-col"} gap-1`, props.className)}>
        <span className="text-sm font-medium tracking-wide">{props.row ? `${props.label}:` : props.label}</span>
        <span className={css(props.disabled ? "text-disabled" : "", props.row ? "w-fit text-base" : "w-full text-lg")}>{props.children}</span>
    </div>
);

export const PageTitle = (props: PropsWithChildren<{ title: string }>) => (
    <div>
        <h2 className="typography text-3xl font-bold tracking-wide">{props.title}</h2>
        <p className="typography text-secondary">{props.children}</p>
    </div>
);

type PageHeaderProps = {
    title: string;
    description: Label;
    containerProps?: React.ComponentProps<"header">;
};

export const PageHeader = (props: PropsWithChildren<PageHeaderProps>) => {
    return (
        <header
            {...props.containerProps}
            className={css("gap-mega flex min-w-full flex-row flex-wrap items-center justify-between", props.containerProps?.className)}
        >
            <PageTitle title={props.title}>{props.description}</PageTitle>
            <div className="gap-kilo flex flex-wrap items-center">{props.children}</div>
        </header>
    );
};
