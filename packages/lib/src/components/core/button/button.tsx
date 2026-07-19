import type React from "react";
import { forwardRef, type PropsWithChildren } from "react";
import type { ComponentStyleProps } from "../../../lib/component-styles";
import { css } from "../../../lib/dom";
import type { Label } from "../../../types";
import { buttonStyles } from "./button.styles";
import { Polymorph, type PolymorphicProps } from "../polymorph/polymorph";

type Variants = ComponentStyleProps<typeof buttonStyles>;

export type ButtonProps<T extends React.ElementType = "button"> = PropsWithChildren<
    PolymorphicProps<
        Variants &
            Partial<{
                /** Icon to display in the button */
                icon: Label;
                /** Whether the button is in a loading state */
                loading: boolean;
            }>,
        T
    >
>;

/**
 * A versatile button component with multiple variants, sizes, and states.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variants
 * <Button theme="primary" size="big">Primary Button</Button>
 *
 * // Loading state
 * <Button loading>Saving...</Button>
 *
 * // With icon
 * <Button icon={<Icon name="plus" />}>Add Item</Button>
 *
 * // As different element
 * <Button as="a" href="/link">Link Button</Button>
 * ```
 *
 * @template T - The HTML element type to render as
 * @param props - Button props including theme, size, loading state, etc.
 * @param ref - Forwarded ref to the button element
 * @returns A styled button component
 */
export const Button: <T extends React.ElementType = "button">(_: ButtonProps<T>) => React.ReactNode = forwardRef(function Button(
    { className, icon, loading, theme, type = "button", size, rounded, ...props }: ButtonProps,
    ref: React.Ref<"button">
) {
    const disabled = loading || props.disabled;
    return (
        <Polymorph
            {...props}
            ref={ref}
            type={type}
            disabled={disabled}
            aria-busy={loading}
            data-component="button"
            aria-disabled={disabled}
            as={props.as ?? "button"}
            data-loading={loading ? "true" : undefined}
            onClick={disabled ? undefined : props.onClick}
            className={css(buttonStyles.className({ size, rounded, theme }), className)}
        >
            {icon ? <span className={buttonStyles.slots.icon}>{icon}</span> : null}
            {props.children}
        </Polymorph>
    );
}) as unknown as <T extends React.ElementType = "button">(_: ButtonProps<T>) => React.ReactNode;
