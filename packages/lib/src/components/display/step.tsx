"use client";
import { motion, stagger, Transition, useAnimate } from "motion/react";
import React, { ComponentProps, PropsWithChildren, useEffect } from "react";
import { useColorParser } from "../../hooks/use-color-parser";

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

export type StepProps = React.ComponentProps<"button"> & { step: number; currentStep: number; status?: StepStatus };

const variants = { complete: { scale: 1.25 }, active: { scale: 1, transition: { delay: 0, duration: 0.2 } } };

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

export const StepsContainer = (props: PropsWithChildren<{ steps: number; currentStep: number }>) => {
  const [ref, animate] = useAnimate();

  useEffect(() => {
    if (props.currentStep === 0) return;
    const container = ref.current as HTMLDivElement;
    const first = container.querySelectorAll('[data-step]')[0]! as HTMLDivElement;
    const step = container.querySelector(`[data-step="${props.currentStep}"]`)! as HTMLDivElement;
    if (first && step) {
      const diff = step.getBoundingClientRect().left - first.getBoundingClientRect().left;
      animate(
        "div[data-name='progress']",
        { width: `${Math.max(0, diff)}px` },
        {
          type: "spring",
          duration: 0.5,
          delay: stagger(0.075),
        }
      );
    }
  }, [props.currentStep]);

  return (
    <div className="flex relative justify-between" ref={ref}>
      <div className="absolute top-1/2 h-1 w-[calc(100%)] bg-card-border" />
      <div data-name="progress" className="absolute top-1/2 w-0 h-1 transition-all duration-300 ease-out bg-success" />
      {props.children}
    </div>
  );
};

export const Step = ({ step, currentStep, status, ...props }: StepProps) => {
  const parser = useColorParser();
  const innerStatus = getCurrentStatus(step, currentStep, status);

  return (
    <motion.button {...(props as any)} type="button" data-step={step} animate={innerStatus} className="block relative w-auto">
      <motion.div
        variants={variants}
        transition={transitions}
        className={`absolute inset-0 rounded-full ${innerStatus === "error" ? "bg-danger" : ""}`}
      />
      <motion.div
        initial={false}
        transition={{ duration: 0.2 }}
        className="flex relative justify-center items-center w-10 h-10 font-semibold rounded-full"
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
            color: parser("var(--success-foreground)"),
          },
        }}
      >
        <div className="flex justify-center items-center">
          {innerStatus === "complete" ? (
            <CheckIcon className="w-6 h-6 text-primary-foreground" />
          ) : innerStatus === "error" ? (
            <ErrorIcon className="w-6 h-6 text-danger-foreground" />
          ) : (
            <span>{step}</span>
          )}
        </div>
      </motion.div>
    </motion.button>
  );
};
