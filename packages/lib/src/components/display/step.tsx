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

const getCurrentStatus = (props: StepProps): StepStatus => {
  if (props.status === "error") return "error";
  if (props.currentStep === props.step) return "active";
  if (props.currentStep < props.step) return "inactive";
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
    <div className="relative flex justify-between" ref={ref}>
      <div className="absolute top-1/2 h-1 w-[calc(100%)] bg-card-border" />
      <div data-name="progress" className="absolute top-1/2 h-1 w-0 bg-success transition-all duration-300 ease-out" />
      {props.children}
    </div>
  );
};

export const Step = (props: StepProps) => {
  const parser = useColorParser();
  const status = getCurrentStatus(props);

  return (
    <motion.button {...(props as any)} type="button" data-step={props.step} animate={status} className="relative block w-auto">
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
            color: parser("var(--success-foreground)"),
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
    </motion.button>
  );
};
