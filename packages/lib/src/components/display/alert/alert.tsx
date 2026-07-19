"use client";
import { CheckCircleIcon, InfoIcon, WarningIcon, XIcon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import type React from "react";
import { forwardRef } from "react";
import { useTranslations } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";
import type { CvaVariants } from "../../../types";
import { Polymorph, type PolymorphicProps } from "../../core/polymorph/polymorph";
import { Collapse } from "../collapse/collapse";

const themeVariants = {
    theme: {
        primary: "__alert--theme-primary",
        danger: "__alert--theme-danger",
        info: "__alert--theme-info",
        success: "__alert--theme-success",
        secondary: "__alert--theme-secondary",
        warn: "__alert--theme-warn",
        muted: "__alert--theme-muted",
        neutral: "__alert--theme-neutral",
    },
};

const alertVariants = cva("__alert", {
    variants: themeVariants,
    defaultVariants: { theme: "neutral" },
});

export type AlertProps<T extends React.ElementType = "div"> = PolymorphicProps<
    CvaVariants<typeof themeVariants> &
        Partial<{
            open?: boolean;
            container: string;
            Icon: React.ReactElement;
            onClose: (nextState: boolean) => void;
        }>,
    T
>;

export const Alert: <T extends React.ElementType = "div">(props: AlertProps<T>) => React.ReactNode = forwardRef(function Alert(
    { className, theme, Icon, onClose, open = true, ...props }: AlertProps,
    ref: React.Ref<"div">
) {
    const t = useTranslations();
    const close = () => onClose?.(false);
    const liveRole = theme === "danger" || theme === "warn" ? "alert" : "status";

    return (
        <div
            data-open={!!open}
            aria-hidden={!open}
            data-component="alert"
            className={css("__alert__container", open ? "__alert__container--open" : "__alert__container--closed")}
        >
            <Collapse open={!!open}>
                <Polymorph
                    {...props}
                    ref={ref}
                    role={liveRole}
                    data-theme={theme}
                    as={props.as || "div"}
                    className={css(alertVariants({ theme }), className)}
                >
                    <div className="__alert__content">
                        {onClose !== undefined ? (
                            <button type="button" onClick={close} aria-label={t.closeButton} className="__alert__close-button">
                                <XIcon aria-hidden="true" className="__alert__close-icon" />
                            </button>
                        ) : null}
                        <div className="__alert__header">
                            {!Icon && theme === "success" ? <CheckCircleIcon aria-hidden="true" className="__alert__icon" /> : null}
                            {!Icon && theme === "info" ? <InfoIcon aria-hidden="true" className="__alert__icon" /> : null}
                            {!Icon && theme === "danger" ? <WarningIcon aria-hidden="true" className="__alert__icon" /> : null}
                            {Icon}
                            {props.title ? <h4 className="__alert__title">{props.title}</h4> : <div className="__alert__body">{props.children}</div>}
                        </div>
                        {props.title ? <div className="__alert__body">{props.children}</div> : null}
                    </div>
                </Polymorph>
            </Collapse>
        </div>
    );
}) as never;
