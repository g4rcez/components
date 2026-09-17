"use client";
import { CheckCircleIcon, InfoIcon, WarningIcon, XIcon } from "@phosphor-icons/react";
import type React from "react";
import { cloneElement, forwardRef } from "react";
import { useTranslations } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";
import type { ComponentStyleProps } from "../../../lib/component-styles";
import { alertStyles } from "./alert.styles";
import { Polymorph, type PolymorphicProps } from "../../core/polymorph/polymorph";
import { Collapse } from "../collapse/collapse";

export type AlertProps<T extends React.ElementType = "div"> = PolymorphicProps<
    ComponentStyleProps<typeof alertStyles> &
        Partial<{
            open: boolean;
            container: string;
            Icon: React.ReactElement;
            onClose: (nextState: boolean) => void;
        }>,
    T
>;

export const Alert: <T extends React.ElementType = "div">(props: AlertProps<T>) => React.ReactNode = forwardRef(function Alert(
    { className, theme, Icon, onClose, open = true, container, ...props }: AlertProps,
    ref: React.Ref<"div">
) {
    const t = useTranslations();
    const resolvedTheme = theme ?? alertStyles.defaults.theme;
    const close = () => onClose?.(false);
    const liveRole = resolvedTheme === "danger" || resolvedTheme === "warn" ? "alert" : "status";
    const customIcon = Icon
        ? cloneElement(Icon as React.ReactElement<{ className?: string }>, {
              className: css(alertStyles.slots.icon, (Icon.props as { className?: string }).className),
          })
        : null;

    return (
        <div
            data-open={!!open}
            aria-hidden={!open}
            data-component="alert"
            className={css(alertStyles.slots.container, open ? "__alert__container--open" : "__alert__container--closed", container)}
        >
            <Collapse open={!!open} className={alertStyles.slots.collapse}>
                <Polymorph
                    {...props}
                    ref={ref}
                    role={liveRole}
                    data-theme={resolvedTheme}
                    as={props.as || "div"}
                    className={css(alertStyles.className({ theme: resolvedTheme }), className)}
                >
                    <div className={alertStyles.slots.content}>
                        {onClose !== undefined ? (
                            <button type="button" onClick={close} aria-label={t.closeButton} className={alertStyles.slots["close-button"]}>
                                <XIcon aria-hidden="true" className={alertStyles.slots["close-icon"]} />
                            </button>
                        ) : null}
                        <div className={alertStyles.slots.header}>
                            {!Icon && resolvedTheme === "success" ? <CheckCircleIcon aria-hidden="true" className={alertStyles.slots.icon} /> : null}
                            {!Icon && resolvedTheme === "info" ? <InfoIcon aria-hidden="true" className={alertStyles.slots.icon} /> : null}
                            {!Icon && resolvedTheme === "danger" ? <WarningIcon aria-hidden="true" className={alertStyles.slots.icon} /> : null}
                            {customIcon}
                            {props.title ? (
                                <h4 className={alertStyles.slots.title}>{props.title}</h4>
                            ) : (
                                <div className={alertStyles.slots.body}>{props.children}</div>
                            )}
                        </div>
                        {props.title ? <div className={alertStyles.slots.body}>{props.children}</div> : null}
                    </div>
                </Polymorph>
            </Collapse>
        </div>
    );
}) as never;
