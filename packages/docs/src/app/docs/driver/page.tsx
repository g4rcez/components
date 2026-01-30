"use client";
import { DocsLayout } from "@/components/docs-layout";
import { useRef, useState } from "react";
import { Button, Card, Wizard, WizardStep } from "../../../../../lib/src";
import { Tag } from "../../../../../lib/src/components/core/tag";

export default function WizardPage() {
  const [active, setActive] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const steps: WizardStep[] = [
    {
      element: "#step-1",
      title: "First Step (ID Selector)",
      description:
        "This element is selected using a CSS selector string '#step-1'.",
      side: "right",
    },
    {
      element: buttonRef,
      title: (
        <span className="flex gap-2 items-center">
          React Node Title <Tag size="small">New</Tag>
        </span>
      ),
      description: (
        <div className="flex flex-col gap-2">
          <span>This description uses a React Node.</span>
          <span className="text-xs text-info">You can put anything here!</span>
        </div>
      ),
      side: "bottom",
    },
    {
      element: "#step-3",
      title: "Third Step",
      description: "Back to ID selector.",
      side: "top",
      onEnter: () => console.log("Entered step 3"),
    },
  ];

  return (
    <DocsLayout
      title="Driver"
      section="floating"
      description="A component to guide the user's focus across the page."
    >
      <Card title="Driver Demo">
        <Button onClick={() => setActive(true)}>Start Tour</Button>
        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2">
          <div
            id="step-1"
            className="p-8 rounded-lg border border-card-border bg-card-background"
          >
            <h3 className="font-bold">Step 1 Target</h3>
            <p className="text-muted-foreground">ID: #step-1</p>
          </div>
          <div className="p-8 rounded-lg border opacity-50 border-card-border bg-card-background">
            <h3 className="font-bold">Ignored Element</h3>
            <p>This element is not part of the tour.</p>
          </div>
          <div className="flex justify-center items-center p-8 rounded-lg border border-card-border bg-card-background">
            <Button ref={buttonRef}>Step 2 Target (Ref)</Button>
          </div>
          <div
            id="step-3"
            className="p-8 text-right rounded-lg border border-card-border bg-card-background"
          >
            <h3 className="font-bold">Step 3 Target</h3>
            <p className="text-muted-foreground">ID: #step-3</p>
          </div>
        </div>
        <Wizard
          steps={steps}
          active={active}
          onClose={() => setActive(false)}
          onFinish={() => alert("Tour finished!")}
       />
      </Card>
    </DocsLayout>
  );
}
