import type { ComponentProps, PropsWithChildren } from "react";
import type React from "react";
import { css } from "../../../lib/dom";
import type { Label } from "../../../types";
import { typographyStyles } from "./typography.styles";

export const Paragraph = (props: ComponentProps<"p">) => (
    <p {...props} className={css(typographyStyles.className({}), typographyStyles.slots.paragraph, props.className)} />
);

export const Description = (props: ComponentProps<"p">) => (
    <p {...props} className={css(typographyStyles.className({}), typographyStyles.slots.description, props.className)} />
);

export type InfoProps = {
    info?: Label;
    label: Label;
    row?: boolean;
    disabled?: Label;
    className?: string;
    infoDescription?: string;
};

export const Info = (props: React.PropsWithChildren<InfoProps>) => {
    const infoClassName = typographyStyles.slots.info;
    const valueClassName = typographyStyles.slots["info-value"];

    return (
        <div
            className={css(
                typographyStyles.className({}),
                infoClassName,
                props.row ? `${infoClassName}--row` : `${infoClassName}--column`,
                props.className
            )}
        >
            <span className={typographyStyles.slots["info-label"]}>{props.row ? `${props.label}:` : props.label}</span>
            <span
                className={css(
                    valueClassName,
                    props.disabled ? `${valueClassName}--disabled` : undefined,
                    props.row ? `${valueClassName}--row` : `${valueClassName}--column`
                )}
            >
                {props.children}
            </span>
        </div>
    );
};

export const PageTitle = (props: PropsWithChildren<{ title: string }>) => (
    <div className={typographyStyles.className({})}>
        <h2 className={typographyStyles.slots["page-title"]}>{props.title}</h2>
        <p className={typographyStyles.slots["page-description"]}>{props.children}</p>
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
            className={css(typographyStyles.className({}), typographyStyles.slots["page-header"], props.containerProps?.className)}
        >
            <PageTitle title={props.title}>{props.description}</PageTitle>
            <div className={typographyStyles.slots["page-header-actions"]}>{props.children}</div>
        </header>
    );
};
