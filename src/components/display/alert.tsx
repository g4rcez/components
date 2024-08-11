import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircleIcon, CircleAlertIcon, XIcon } from "lucide-react";
import React, { forwardRef } from "react";
import { Polymorph, PolymorphicProps } from "../core/polymorph";
import { HTMLMotionProps, motion } from "framer-motion";
import { PropsWithChildren } from "react";
import { css } from "../../lib/dom";

const variants = {
    true: { opacity: 1, height: "auto" },
    false: { opacity: [0.7, 0.3, 0], height: 0 },
};

const transition = {
    type: "tween",
    duration: 0.7,
    ease: [0.04, 0.62, 0.23, 0.98],
};

type CollapseProps = { open: boolean } & HTMLMotionProps<"section">;

export const Collapse = (props: PropsWithChildren<CollapseProps>) => (
    <motion.section
        {...props}
        layout
        layoutRoot
        layoutScroll
        initial={props.open}
        animate={props.open.toString()}
        aria-hidden={!props.open}
        className={props.className}
        exit={variants.false}
        transition={transition}
        variants={variants}
    >
        {props.children}
    </motion.section>
);

const alertVariants = cva("px-4 py-4 border relative rounded-lg text-sm", {
    variants: {
        theme: {
            neutral: "border-border bg-background",
            danger: "text-danger-contrast bg-danger/10 border-danger/50",
            success: "text-success-contrast bg-success/10 border-success/50",
        },
    },
    defaultVariants: { theme: "neutral" },
});

export type AlertProps<T extends React.ElementType = "div"> = PolymorphicProps<
    VariantProps<typeof alertVariants> &
        Partial<{
            container: string;
            open?: boolean;
            onClose: (nextState: boolean) => void;
        }>,
    T
>;

export const Alert: <T extends React.ElementType = "div">(props: AlertProps<T>) => any = forwardRef(function Alert(
    { className, theme, onClose, open, ...props }: AlertProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    return (
        <div
            data-open={!!open}
            aria-hidden={!open}
            className="data-[open=true]:mb-4 isolate data-[open=true]:pointer-events-auto pointer-events-none"
        >
            <Collapse data-open={!!open} open={!!open}>
                <Polymorph
                    {...props}
                    className={css(alertVariants({ theme }), className)}
                    ref={ref}
                    data-theme={theme}
                    role="alert"
                    as={props.as ?? "div"}
                >
                    <h4 className="mb-2 flex items-center gap-2">
                        {theme === "success" ? <CheckCircleIcon size={20} /> : null}
                        {theme === "danger" ? <CircleAlertIcon size={20} /> : null}
                        <span className="tracking-3 text-balance text-lg font-semibold">{props.title}</span>
                    </h4>
                    {props.children}
                    {open !== undefined ? (
                        <button
                            type="button"
                            onClick={() => onClose?.(false)}
                            className="text-foreground hover:text-danger absolute right-3 top-3 transition-colors duration-300 ease-in-out"
                        >
                            <XIcon size={20} />
                        </button>
                    ) : null}
                </Polymorph>
            </Collapse>
        </div>
    );
}) as never;
