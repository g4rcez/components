import type React from "react";
import { forwardRef } from "react";
import type { ComponentStyleProps } from "../../../lib/component-styles";
import { css } from "../../../lib/dom";
import type { Label } from "../../../types";
import { Polymorph, type PolymorphicProps } from "../polymorph/polymorph";
import { tagStyles } from "./tag.styles";

type Variants = ComponentStyleProps<typeof tagStyles>;

type Themes = NonNullable<Variants["theme"]>;

const indicatorThemeClass = (theme: Themes) => {
    if (theme === "custom") return undefined;
    if (theme === "disabled" || theme === "loading") return `${tagStyles.slots.indicator}--theme-muted`;
    return `${tagStyles.slots.indicator}--theme-${theme}`;
};

export type TagProps<T extends React.ElementType = "span"> = PolymorphicProps<
    Variants & Partial<{ icon: Label; loading: boolean; indicator: Themes | true }>,
    T
>;

export const Tag: <T extends React.ElementType = "span">(_: TagProps<T>) => React.ReactNode = forwardRef(function Tag<
    T extends React.ElementType = "span",
>({ className, indicator = undefined, icon, loading, theme, size, ...props }: TagProps<T>, ref: React.Ref<HTMLElement>) {
    const resolvedTheme = loading ? "loading" : theme;
    const resolvedIndicatorTheme = (indicator === true ? (theme ?? "primary") : indicator) as Themes | undefined;

    return (
        <Polymorph
            {...props}
            ref={ref}
            data-theme={theme}
            data-loading={loading ? true : undefined}
            data-component="tag"
            as={props.as ?? "span"}
            className={css(tagStyles.className({ size, theme: resolvedTheme }), className)}
        >
            {resolvedIndicatorTheme ? (
                <span aria-hidden="true" className={css(tagStyles.slots.indicator, indicatorThemeClass(resolvedIndicatorTheme))} />
            ) : null}
            {icon}
            {props.children}
        </Polymorph>
    );
}) as unknown as <T extends React.ElementType = "span">(_: TagProps<T>) => React.ReactNode;
