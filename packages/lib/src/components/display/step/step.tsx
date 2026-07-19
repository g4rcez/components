"use client";
import { type HTMLMotionProps, motion, type Transition } from "motion/react";
import React, { type ComponentProps, createContext, Fragment, type PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { css } from "../../../lib/dom";
import type { Label } from "../../../types";
import { stepStyles } from "./step.styles";

const PROGRESS_BAR_DURATION = 0.3;

type StepContextValue = {
    currentStep: number;
    previousStep: number;
    progressBarDuration: number;
    steps: number;
};

const StepContext = createContext<StepContextValue | null>(null);

const iconTransitions: Transition = {
    delay: 0.2,
    duration: 0.3,
    type: "tween",
    ease: "easeOut",
};

const states = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
};

const ErrorIcon = (props: ComponentProps<"svg">) => (
    <svg
        {...props}
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <motion.path className="currentColor" initial={states.initial} animate={states.animate} transition={iconTransitions} d="M18 6 6 18" />
        <motion.path className="currentColor" initial={states.initial} animate={states.animate} transition={iconTransitions} d="m6 6 12 12" />
    </svg>
);

const CheckIcon = (props: ComponentProps<"svg">) => (
    <svg {...props} aria-hidden="true" focusable="false" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <motion.path
            d="M5 13l4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={states.animate}
            initial={states.initial}
            transition={iconTransitions}
        />
    </svg>
);

type StepStatus = "active" | "inactive" | "complete" | "error";

export type StepProps = React.ComponentProps<"button"> & {
    step: number;
    title?: Label;
    currentStep: number;
    status?: StepStatus;
    titleClassName?: string;
};

const variants = {
    complete: { scale: 1.25 },
    active: { scale: 1, transition: { delay: 0, duration: 0.3 } },
};

const transitions: Transition = {
    duration: 0.6,
    delay: 0.2,
    type: "tween",
    ease: "circOut",
};

const getCurrentStatus = (step: StepProps["step"], currentStep: StepProps["currentStep"], status: StepProps["status"]): StepStatus => {
    if (status === "error") return "error";
    if (currentStep === step) return "active";
    if (currentStep < step) return "inactive";
    return "complete";
};

const calculateStepDelay = (step: number, currentStep: number, previousStep: number, duration: number): number => {
    if (currentStep === previousStep) return 0;
    const isForward = currentStep > previousStep;
    if (isForward) {
        if (step <= previousStep || step > currentStep) return 0;
        return ((step - previousStep) / (currentStep - previousStep)) * duration;
    }
    if (step <= currentStep || step > previousStep) return 0;
    return ((previousStep - step) / (previousStep - currentStep)) * duration;
};

const slotModifier = (slot: string, modifier: string) => `${slot}--${modifier}`;

export const useStepContext = () => useContext(StepContext);

export const Step = ({ step, currentStep, status, title, titleClassName, className, ...props }: StepProps) => {
    const context = useStepContext();
    const [visualCurrentStep, setVisualCurrentStep] = useState(currentStep);

    useEffect(() => {
        if (!context) {
            setVisualCurrentStep(currentStep);
            return;
        }
        const delay = calculateStepDelay(step, context.currentStep, context.previousStep, context.progressBarDuration);

        if (delay === 0) {
            setVisualCurrentStep(currentStep);
            return;
        }

        const timer = setTimeout(() => {
            setVisualCurrentStep(currentStep);
        }, delay * 1000);
        return () => clearTimeout(timer);
    }, [currentStep, context, step]);

    const innerStatus = getCurrentStatus(step, visualCurrentStep, status);
    const connectorComplete = innerStatus === "active" || innerStatus === "complete";

    return (
        <Fragment>
            <div className={css(stepStyles.slots.connector, connectorComplete && slotModifier(stepStyles.slots.connector, "complete"))} />
            <motion.button
                {...(props as unknown as HTMLMotionProps<"button">)}
                type="button"
                aria-current={innerStatus === "active" ? "step" : undefined}
                data-step={step}
                data-status={innerStatus}
                animate={innerStatus}
                className={css(stepStyles.slots.item, className)}
            >
                <motion.div
                    variants={variants}
                    transition={transitions}
                    className={css(stepStyles.slots.halo, innerStatus === "error" && slotModifier(stepStyles.slots.halo, "error"))}
                />
                <motion.div className={css(stepStyles.slots.marker, slotModifier(stepStyles.slots.marker, `status-${innerStatus}`))}>
                    <div className={stepStyles.slots["marker-content"]}>
                        {innerStatus === "complete" ? (
                            <CheckIcon className={stepStyles.slots["status-icon"]} />
                        ) : innerStatus === "error" ? (
                            <ErrorIcon className={stepStyles.slots["status-icon"]} />
                        ) : (
                            <Fragment>
                                <span>{step}</span>
                            </Fragment>
                        )}
                    </div>
                </motion.div>
                <div className={stepStyles.slots.label}>
                    <h3 className={css(stepStyles.slots.title, titleClassName)}>{title}</h3>
                </div>
            </motion.button>
        </Fragment>
    );
};

export const Steps = (props: PropsWithChildren<{ steps: number; currentStep: number }>) => {
    const previousStepRef = useRef(props.currentStep);
    const [previousStep, setPreviousStep] = useState(props.currentStep);

    useEffect(() => {
        previousStepRef.current = previousStep;
        const timer = setTimeout(() => {
            setPreviousStep(props.currentStep);
        }, PROGRESS_BAR_DURATION * 1000);
        return () => clearTimeout(timer);
    }, [props.currentStep, previousStep]);

    const contextValue: StepContextValue = {
        currentStep: props.currentStep,
        previousStep: previousStepRef.current,
        progressBarDuration: PROGRESS_BAR_DURATION,
        steps: React.Children.count(props.children),
    };

    return (
        <StepContext.Provider value={contextValue}>
            <div className={stepStyles.className()}>{props.children}</div>
        </StepContext.Provider>
    );
};
