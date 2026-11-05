"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Button, Card, Slot, createSlot } from "@g4rcez/components";

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
                    <Slot className="text-primary font-bold">
                        <span>This text inherits the className from Slot</span>
                    </Slot>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Event Handler Composition"
                description="Both the Slot and child onClick handlers fire when the element is clicked."
                code={`import { Button, Slot } from "@g4rcez/components";

function EventComposition() {
  return (
    <Slot onClick={() => console.log("Slot handler")}>
      <Button type="button" onClick={() => console.log("Button handler")}>
        Click (both handlers fire)
      </Button>
    </Slot>
  );
}`}
            >
                <Card title="Event composition">
                    <Slot onClick={() => console.log("Slot handler")}>
                        <Button type="button" onClick={() => console.log("Button handler")}>
                            Click (both handlers fire)
                        </Button>
                    </Slot>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Custom Slot via createSlot"
                description="createSlot creates a named Slot for use as an asChild pattern in component primitives."
                code={`import { Button, createSlot } from "@g4rcez/components";

const ButtonSlot = createSlot("Button");

function CustomSlot() {
  return (
    <ButtonSlot aria-label="Custom button slot">
      <Button type="button">Composed button</Button>
    </ButtonSlot>
  );
}`}
            >
                <Card title="createSlot">
                    <ButtonSlot aria-label="Custom button slot">
                        <Button type="button">Composed button</Button>
                    </ButtonSlot>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
