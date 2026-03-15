"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import React, { useState } from "react";
import { Button, Card, Steps, Step } from "../../../../../lib/src";

export default function StepperPage() {
  const [step, setStep] = useState(2);
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    setStep(Number(e.currentTarget.dataset.step));

  return (
    <DocsLayout
      title="Steps"
      section="display"
      description="Visualizes progress through a multi-step process with an interactive stepper."
    >
      <ComponentDemo
        title="Interactive Stepper"
        description="A multi-step component where users can navigate back and forth. The stepper dynamically updates its active state."
        code={`"use client";
import { useState } from "react";
import { Button, Card, Steps, Step } from "@g4rcez/components";

function InteractiveStepper() {
  const [step, setStep] = useState(2);
  const totalSteps = 4;
  const onClickStep = (e: React.MouseEvent<HTMLButtonElement>) =>
    setStep(Number(e.currentTarget.dataset.step));

  return (
    <Card
      title={
        <Steps steps={totalSteps} currentStep={step}>
          <Step title="First step" onClick={onClickStep} step={1} currentStep={step} />
          <Step
            step={2}
            title="Second"
            onClick={onClickStep}
            currentStep={step}
          />
          <Step title="Third" onClick={onClickStep} step={3} currentStep={step} />
          <Step titleClassName="bg-inherit" title="Giant title to use as last step" onClick={onClickStep} step={4} currentStep={step} />
        </Steps>
      }
    >
      {step <= totalSteps ? (
        <div className="p-32 text-center">Step {step}</div>
      ) : (
        <div className="p-32 text-center">Finish him!</div>
      )}
      <div className="flex flex-row justify-between">
        <Button
          theme="neutral"
          onClick={() => setStep(step < 2 ? step : step - 1)}
        >
          Back
        </Button>
        <Button onClick={() => setStep(step > totalSteps ? step : step + 1)}>
          Continue
        </Button>
      </div>
    </Card>
  );
}`}
      >
        <Card
          title={
            <Steps steps={4} currentStep={step}>
              <Step title="First step" onClick={onClick} step={1} currentStep={step} />
              <Step
                step={2}
                title="Second"
                onClick={onClick}
                currentStep={step}
              />
              <Step title="Third" onClick={onClick} step={3} currentStep={step} />
              <Step titleClassName="bg-inherit" title="Giant title to use as last step" onClick={onClick} step={4} currentStep={step} />
            </Steps>
          }
        >
          {step < 5 ? (
            <div className="p-32 text-center">Step {step}</div>
          ) : (
            <div className="p-32 text-center">Finish him!</div>
          )}
          <div className="flex flex-row justify-between">
            <Button
              theme="neutral"
              onClick={() => setStep(step < 2 ? step : step - 1)}
            >
              Back
            </Button>
            <Button onClick={() => setStep(step > 4 ? step : step + 1)}>
              Continue
            </Button>
          </div>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
