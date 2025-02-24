"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLMotionProps, motion } from "framer-motion";
import { CheckCircleIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import React, { forwardRef, PropsWithChildren, useState } from "react";
import { css } from "../../lib/dom";
import { Polymorph, PolymorphicProps } from "../core/polymorph";

const variants = {
    true: { opacity: 1, height: "auto" },
    false: { opacity: [0.7, 0.3, 0], height: 0 },
};

const transition = {
    type: "tween",
    duration: 0.7,
    ease: [0.04, 0.62, 0.23, 0.98],
};

type CollapseProps = HTMLMotionProps<"section"> & { open: boolean };

export const Collapse = (props: PropsWithChildren<CollapseProps>) => (
    <motion.div
        {...props}
        layout
        layoutRoot
        layoutScroll
        initial={false}
        variants={variants}
        exit={variants.false}
        transition={transition}
        aria-hidden={!props.open}
        data-component="collapse"
        animate={props.open.toString()}
        className={css("aria-hidden:pointer-events-none", props.className)}
    >
        {props.children}
    </motion.div>
);

const alertVariants = cva("p-4 w-full block border relative rounded-lg text-sm", {
    variants: {
        theme: {
            primary: "bg-alert-primary-bg text-alert-primary-text border-alert-primary-border",
            danger: "bg-alert-danger-bg text-alert-danger-text border-alert-danger-border",
            info: "bg-alert-info-bg text-alert-info-text border-alert-info-border",
            success: "bg-alert-success-bg text-alert-success-text border-alert-success-border",
            secondary: "bg-alert-secondary-bg text-alert-secondary-text border-alert-secondary-border",
            warn: "bg-alert-warn-bg text-alert-warn-text border-alert-warn-border",
            neutral: "bg-transparent border border-card-border text-alert-primary-text",
        },
    },
    defaultVariants: { theme: "neutral" },
});

export type AlertProps<T extends React.ElementType = "div"> = PolymorphicProps<
    VariantProps<typeof alertVariants> &
        Partial<{
            Icon: React.ReactElement;
            container: string;
            open?: boolean;
            onClose: (nextState: boolean) => void;
        }>,
    T
>;

export const Alert: <T extends React.ElementType = "div">(props: AlertProps<T>) => any = forwardRef(function Alert(
    { className, theme, Icon, onClose, open = true, ...props }: AlertProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const close = () => onClose?.(false);

    return (
        <div
            data-open={!!open}
            aria-hidden={!open}
            data-component="alert"
            className={css("isolate w-full", open ? "pointer-events-auto" : "pointer-events-none")}
        >
            <Collapse data-open={!!open} open={!!open}>
                <Polymorph
                    {...props}
                    ref={ref}
                    role="alert"
                    data-theme={theme}
                    as={props.as ?? "div"}
                    className={css(alertVariants({ theme }), className)}
                >
                    <h4 className="mb-2 flex items-center gap-2">
                        {!Icon && theme === "success" ? <CheckCircleIcon size={20} /> : null}
                        {!Icon && theme === "info" ? <InfoIcon size={20} /> : null}
                        {!Icon && theme === "danger" ? <TriangleAlertIcon size={20} /> : null}
                        {Icon}
                        <span className="tracking-3 text-balance text-lg font-semibold">{props.title}</span>
                    </h4>
                    {props.children}
                    {onClose !== undefined ? (
                        <button
                            type="button"
                            onClick={close}
                            className="absolute right-3 top-3 text-foreground transition-colors duration-300 ease-in-out hover:text-danger"
                        >
                            <XIcon size={20} />
                        </button>
                    ) : null}
                </Polymorph>
            </Collapse>
        </div>
    );
}) as never;

