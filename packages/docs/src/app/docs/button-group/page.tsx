"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Button, Card } from "../../../../../lib/src";

export default function ButtonGroup() {
  return (
    <DocsLayout
      title="Button Group"
      section="display"
      description="A simple way to implement button groups."
    >
      <ComponentDemo
        title="Basic Button Group"
        description="Demonstrates a basic button group by styling individual buttons to appear merged."
        code={`"use client";
import { Button } from "@g4rcez/components";

function BasicButtonGroup() {
  return (
    <div className="flex">
      <Button theme="muted" className="rounded-l-button" rounded="squared">Merge</Button>
      <Button theme="primary" rounded="squared">Merge</Button>
      <Button theme="muted" className="rounded-r-button" rounded="squared">Button</Button>
    </div>
  );
}`}
      >
        <Card title="Button Group Example" className="flex flex-wrap gap-8">
          <div className="flex">
            <Button theme="muted" className="rounded-l-button" rounded="squared">Merge</Button>
            <Button theme="primary" rounded="squared">Merge</Button>
            <Button theme="muted" className="rounded-r-button" rounded="squared">Button</Button>
          </div>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
