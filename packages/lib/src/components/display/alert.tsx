"use client";
import { cva } from "class-variance-authority";
import { type HTMLMotionProps, motion, type Transition } from "motion/react";
import { CheckCircleIcon, InfoIcon, WarningIcon, XIcon } from "@phosphor-icons/react";
import type React from "react";
import { forwardRef, type PropsWithChildren } from "react";
import { useTranslations } from "../../hooks/use-translations";
import { css } from "../../lib/dom";
import type { CvaVariants } from "../../types";
import { Polymorph, type PolymorphicProps } from "../core/polymorph";
import { Resizable } from "../core/resizable";

const transition: Transition = {
    type: "tween",
    duration: 0.35,
    ease: [0.04, 0.62, 0.23, 0.98],
};

type CollapseProps = HTMLMotionProps<"section"> & { open: boolean };

export const Collapse = (props: PropsWithChildren<CollapseProps>) => (
    <motion.div
        {...(props as unknown as HTMLMotionProps<"div">)}
        initial={false}
        animate={{ opacity: props.open ? 1 : 0 }}
        transition={transition}
        aria-hidden={!props.open}
        data-component="collapse"
        className={css("__display-alert__collapse", props.className)}
    >
        <Resizable open={props.open} destroyOnUnmount>
            {props.children}
        </Resizable>
    </motion.div>
);

const themeVariants = {
    theme: {
        primary: "__display-alert--theme-primary",
        danger: "__display-alert--theme-danger",
        info: "__display-alert--theme-info",
        success: "__display-alert--theme-success",
        secondary: "__display-alert--theme-secondary",
        warn: "__display-alert--theme-warn",
        muted: "__display-alert--theme-muted",
        neutral: "__display-alert--theme-neutral",
    },
};

const alertVariants = cva("__display-alert__border __display-alert__tw-1", {
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
            className={css("__display-alert__tw-2", open ? "__display-alert__tw-3" : "__display-alert__tw-4")}
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
                    <div className="__display-alert__tw-5 __display-alert__tw-extra-1">
                        {onClose !== undefined ? (
                            <button type="button" onClick={close} aria-label={t.closeButton} className="__display-alert__tw-6">
                                <XIcon aria-hidden="true" className="__alert__close-icon" />
                            </button>
                        ) : null}
                        <div className="__display-alert__tw-7">
                            {!Icon && theme === "success" ? <CheckCircleIcon aria-hidden="true" className="__alert__icon" /> : null}
                            {!Icon && theme === "info" ? <InfoIcon aria-hidden="true" className="__alert__icon" /> : null}
                            {!Icon && theme === "danger" ? <WarningIcon aria-hidden="true" className="__alert__icon" /> : null}
                            {Icon}
                            {props.title ? (
                                <h4 className="__display-alert__tw-8">{props.title}</h4>
                            ) : (
                                <div className="__display-alert__tw-9">{props.children}</div>
                            )}
                        </div>
                        {props.title ? <div className="__display-alert__tw-9">{props.children}</div> : null}
                    </div>
                </Polymorph>
            </Collapse>
        </div>
    );
}) as never;
