"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card } from "../../../../../lib/src";
import { Slot, createSlot } from "../../../../../lib/src/components/core/slot";

const ButtonSlot = createSlot("Button");

export default function SlotPage() {
  return (
    <DocsLayout
      title="Slot"
      section="primitives"
      description="Merges its props onto the single child element, composing event handlers and classNames automatically."
    >
      <ComponentDemo
        title="Basic Prop Merging"
        description="Slot passes its props down to the child element, merging className and event handlers."
        code={`import { Slot } from "@g4rcez/components/core/slot";

function BasicMerging() {
  return (
    <Slot className="font-bold text-primary">
      <span>This text inherits the className from Slot</span>
    </Slot>
  );
}`}
      >
        <Card title="Basic">
          <Slot className="font-bold text-primary">
            <span>This text inherits the className from Slot</span>
          </Slot>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Event Handler Composition"
        description="Both the Slot and child onClick handlers fire when the element is clicked."
        code={`import { Slot } from "@g4rcez/components/core/slot";

function EventComposition() {
  return (
    <Slot onClick={() => console.log("Slot handler")}>
      <button
        type="button"
        onClick={() => console.log("Button handler")}
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
      >
        Click (both handlers fire)
      </button>
    </Slot>
  );
}`}
      >
        <Card title="Event composition">
          <Slot onClick={() => console.log("Slot handler")}>
            <button
              type="button"
              onClick={() => console.log("Button handler")}
              className="rounded px-4 py-2 bg-primary text-primary-foreground"
            >
              Click (both handlers fire)
            </button>
          </Slot>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Custom Slot via createSlot"
        description="createSlot creates a named Slot for use as an asChild pattern in component primitives."
        code={`import { createSlot } from "@g4rcez/components/core/slot";

const ButtonSlot = createSlot("Button");

function CustomSlot() {
  return (
    <ButtonSlot
      className="rounded px-4 py-2 bg-primary text-primary-foreground"
      aria-label="Custom button slot"
    >
      <button type="button">Composed button</button>
    </ButtonSlot>
  );
}`}
      >
        <Card title="createSlot">
          <ButtonSlot
            className="rounded px-4 py-2 bg-primary text-primary-foreground"
            aria-label="Custom button slot"
          >
            <button type="button">Composed button</button>
          </ButtonSlot>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
