"use client";
import { motion, Transition } from "framer-motion";
import { ComponentProps, PropsWithChildren } from "react";
import { useColorParser } from "../../hooks/use-translate-context";

const iconTransitions = {
    delay: 0.2,
    type: "tween",
    ease: "easeOut",
    duration: 0.3,
};

const states = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
};

const ErrorIcon = (props: ComponentProps<"svg">) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <motion.path className="currentColor" initial={states.initial} animate={states.animate} transition={iconTransitions} d="M18 6 6 18" />
        <motion.path className="currentColor" initial={states.initial} animate={states.animate} transition={iconTransitions} d="m6 6 12 12" />
    </svg>
);

const CheckIcon = (props: ComponentProps<"svg">) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <motion.path
            initial={states.initial}
            animate={states.animate}
            transition={iconTransitions}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
        />
    </svg>
);

type StepStatus = "active" | "inactive" | "complete" | "error";

export type StepProps = { step: number; currentStep: number; status?: StepStatus };

const variants = { complete: { scale: 1.25 }, active: { scale: 1, transition: { delay: 0, duration: 0.2 } } };

const transitions: Transition = {
    duration: 0.6,
    delay: 0.2,
    type: "tween",
    ease: "circOut",
};

const getCurrentStatus = (props: StepProps): StepStatus => {
    if (props.status === "error") return "error";
    if (props.currentStep === props.step) return "active";
    if (props.currentStep < props.step) return "inactive";
    return "complete";
};

export const StepsContainer = (props: PropsWithChildren<{ steps: number; currentStep: number }>) => (
    <div className="relative flex justify-between">
        <div className="absolute top-1/2 h-1 w-[calc(100%)] bg-card-border" />
        {props.children}
    </div>
);

export const Step = (props: StepProps) => {
    const parser = useColorParser();
    const status = getCurrentStatus(props);

    return (
        <motion.div animate={status} className="relative">
            <motion.div
                variants={variants}
                transition={transitions}
                className={`absolute inset-0 rounded-full ${props.status === "error" ? "bg-danger" : ""}`}
            />
            <motion.div
                initial={false}
                variants={{
                    error: {
                        backgroundColor: parser("var(--danger-DEFAULT)"),
                        borderColor: parser("var(--danger-hover)"),
                        color: parser("var(--danger-foreground)"),
                    },
                    inactive: {
                        backgroundColor: parser("var(--background)"),
                        borderColor: parser("var(--card-border)"),
                        color: parser("var(--disabled)"),
                    },
                    active: {
                        backgroundColor: parser("var(--primary-DEFAULT)"),
                        borderColor: parser("var(--primary-DEFAULT)"),
                        color: parser("var(--primary-foreground)"),
                    },
                    complete: {
                        backgroundColor: parser("var(--success-DEFAULT)"),
                        borderColor: parser("var(--success-DEFAULT)"),
                        color: parser("var(--success-DEFAULT)"),
                    },
                }}
                transition={{ duration: 0.2 }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full font-semibold"
            >
                <div className="flex items-center justify-center">
                    {status === "complete" ? (
                        <CheckIcon className="h-6 w-6 text-primary-foreground" />
                    ) : status === "error" ? (
                        <ErrorIcon className="h-6 w-6 text-danger-foreground" />
                    ) : (
                        <span>{props.step}</span>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};
