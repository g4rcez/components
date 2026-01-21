"use client";
import { DocsLayout } from "@/components/docs-layout";
import React, { useState } from "react";
import { Button, Card, Steps, Step } from "../../../../../lib/src";

export default function StepperPage() {
  const [step, setStep] = useState(2);
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    setStep(Number(e.currentTarget.dataset.step));

  return (
    <DocsLayout title="Steps" section="display" description="">
      <Card
        title={
          <Steps steps={4} currentStep={step}>
            <Step title="First" onClick={onClick} step={1} currentStep={step} />
            <Step title="Second" onClick={onClick} step={2} currentStep={step} />
            <Step onClick={onClick} step={3} currentStep={step} />
            <Step onClick={onClick} step={4} currentStep={step} />
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
    </DocsLayout>
  );
}
