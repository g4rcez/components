"use client";
import { HTMLMotionProps, motion, Transition } from "motion/react";
import React, { ComponentProps, createContext, Fragment, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { useColorParser } from "../../../hooks/use-color-parser";
import { Label } from "../../../types";

const PROGRESS_BAR_DURATION = 0.3;

const transition: Transition = {
    duration: PROGRESS_BAR_DURATION,
    type: "tween",
    ease: "easeInOut",
};

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

export const useStepContext = () => useContext(StepContext);

export const Step = ({ step, currentStep, status, title, titleClassName, ...props }: StepProps) => {
    const parser = useColorParser();
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

    const _widthPerStep = context?.steps ? 100 / context?.steps : undefined;

    return (
        <Fragment>
            <div className={`__display-step__slot-1 ${innerStatus === "active" || innerStatus === "complete" ? "__display-step__slot-2" : ""}`} />
            <motion.button
                {...(props as unknown as HTMLMotionProps<"button">)}
                type="button"
                aria-current={innerStatus === "active" ? "step" : undefined}
                data-step={step}
                animate={innerStatus}
                className="__display-step__slot-3"
            >
                <motion.div
                    variants={variants}
                    transition={transitions}
                    className={`__display-step__slot-4 ${innerStatus === "error" ? "__display-step__slot-5" : ""}`}
                />
                <motion.div
                    initial={false}
                    animate={innerStatus}
                    transition={transition}
                    className="__display-step__slot-6"
                    variants={{
                        error: {
                            color: parser("var(--danger-foreground)"),
                            borderColor: parser("var(--danger-hover)"),
                            backgroundColor: parser("var(--danger-DEFAULT)"),
                        },
                        inactive: {
                            transition,
                            color: parser("var(--disabled)"),
                            borderColor: parser("var(--card-border)"),
                            backgroundColor: parser("var(--background)"),
                        },
                        active: {
                            transition,
                            color: parser("var(--primary-foreground)"),
                            borderColor: parser("var(--primary-DEFAULT)"),
                            backgroundColor: parser("var(--primary-DEFAULT)"),
                        },
                        complete: {
                            transition,
                            color: parser("var(--success-foreground)"),
                            borderColor: parser("var(--success-DEFAULT)"),
                            backgroundColor: parser("var(--success-DEFAULT)"),
                        },
                    }}
                >
                    <div className="__display-step__slot-7">
                        {innerStatus === "complete" ? (
                            <CheckIcon className="__display-step__slot-8" />
                        ) : innerStatus === "error" ? (
                            <ErrorIcon className="__display-step__slot-9" />
                        ) : (
                            <Fragment>
                                <span>{step}</span>
                            </Fragment>
                        )}
                    </div>
                </motion.div>
                <div className="__display-step__slot-10 __display-step__slot-extra-1">
                    <h3 className={`__display-step__slot-11 ${titleClassName}`}>{title}</h3>
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
            <div className="__display-step__slot-12 __display-step__slot-extra-2">{props.children}</div>
        </StepContext.Provider>
    );
};
