"use client";
import { motion, Transition } from "motion/react";
import React, { ComponentProps, createContext, CSSProperties, Fragment, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { useColorParser } from "../../hooks/use-color-parser";
import { Label } from "../../types";

const PROGRESS_BAR_DURATION = 0.3;

const transition: Transition = { duration: PROGRESS_BAR_DURATION, type: "tween", ease: "easeInOut" };

type StepContextValue = { currentStep: number; previousStep: number; progressBarDuration: number; steps: number };

const StepContext = createContext<StepContextValue | null>(null);

const iconTransitions: Transition = { delay: 0.2, duration: 0.3, type: "tween", ease: "easeOut" };

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
  active: { scale: 1, transition: { delay: 0, duration: 0.3 } }
};

const transitions: Transition = { duration: 0.6, delay: 0.2, type: "tween", ease: "circOut", };

const getCurrentStatus = (step: StepProps["step"], currentStep: StepProps["currentStep"], status: StepProps["status"]): StepStatus => {
  if (status === "error") return "error";
  if (currentStep === step) return "active";
  if (currentStep < step) return "inactive";
  return "complete";
};


const calculateStepDelay = (
  step: number,
  currentStep: number,
  previousStep: number,
  duration: number
): number => {
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
    const delay = calculateStepDelay(
      step,
      context.currentStep,
      context.previousStep,
      context.progressBarDuration
    );

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

  const widthPerStep = context?.steps ? 100 / (context?.steps) : undefined;

  return (
    <Fragment>
      <div className={`h-[2px] w-full xl:block bg-card-border hidden first:hidden ${innerStatus === "active" || innerStatus === "complete" ? "bg-success" : ""}`} />
      <motion.button {...(props as any)} type="button" data-step={step} animate={innerStatus} className="flex relative justify-center items-center w-auto text-center">
        <motion.div
          variants={variants}
          transition={transitions}
          className={`hidden xl:block aspect-square absolute inset-0 rounded-full text-center ${innerStatus === "error" ? "bg-danger" : ""}`}
        />
        <motion.div
          initial={false}
          animate={innerStatus}
          transition={transition}
          className="flex relative justify-center items-center font-semibold rounded-full size-10 aspect-square"
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
          <div className="flex justify-center items-center">
            {innerStatus === "complete" ? (
              <CheckIcon className="size-6 text-primary-foreground" />
            ) : innerStatus === "error" ? (
              <ErrorIcon className="size-6 text-danger-foreground" />
            ) : (
              <Fragment>
                <span>{step}</span>
              </Fragment>
            )}
          </div>
        </motion.div>
        <header className="flex flex-col justify-start items-start px-2">
          <h3 className={`h-full whitespace-nowrap flex items-center ${titleClassName}`}>{title}</h3>
        </header>
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
      <div className="flex relative flex-col gap-4 justify-center items-start w-full lg:flex-row lg:justify-between lg:items-center">
        {props.children}
      </div>
    </StepContext.Provider>
  );
};
