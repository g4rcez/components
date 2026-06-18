import type { PropsWithChildren } from "react";
import React, { type ComponentProps } from "react";
import { css } from "../../lib/dom";
import { Label } from "../../types";

export const Paragraph = (props: ComponentProps<"p">) => <p {...props} className={css("__core-typography__tw-1", props.className)} />;

export const Description = (props: ComponentProps<"p">) => <p {...props} className={css("__core-typography__tw-2", props.className)} />;

export type InfoProps = {
    info?: Label;
    label: Label;
    row?: boolean;
    disabled?: Label;
    className?: string;
    infoDescription?: string;
};

export const Info = (props: React.PropsWithChildren<InfoProps>) => (
    <div
        className={css(
            `__core-typography__tw-3 ${props.row ? "__core-typography__tw-5 __core-typography__tw-extra-1" : "__core-typography__tw-extra-2"} __core-typography__tw-4`,
            props.className
        )}
    >
        <span className="__core-typography__tw-6">{props.row ? `${props.label}:` : props.label}</span>
        <span className={css(props.disabled ? "__core-typography__tw-7" : "", props.row ? "__core-typography__tw-8" : "__core-typography__tw-9")}>
            {props.children}
        </span>
    </div>
);

export const PageTitle = (props: PropsWithChildren<{ title: string }>) => (
    <div>
        <h2 className="typography __core-typography__tw-10">{props.title}</h2>
        <p className="typography __core-typography__tw-11">{props.children}</p>
    </div>
);

type PageHeaderProps = {
    title: string;
    description: Label;
    containerProps?: React.ComponentProps<"header">;
};

export const PageHeader = (props: PropsWithChildren<PageHeaderProps>) => {
    return (
        <header {...props.containerProps} className={css("__core-typography__tw-12 __core-typography__tw-extra-3", props.containerProps?.className)}>
            <PageTitle title={props.title}>{props.description}</PageTitle>
            <div className="__core-typography__tw-13 __core-typography__tw-extra-4">{props.children}</div>
        </header>
    );
};
