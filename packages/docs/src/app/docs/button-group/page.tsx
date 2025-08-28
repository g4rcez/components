"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Button, Card } from "../../../../../lib/src";

export default function ButtonGroup() {
  return (
    <DocsLayout
      title="Button group"
      section="display"
      description="A simple way to implement button group"
    >
      <div className="flex flex-col gap-8">
        <Card title="All button themes" className="flex flex-wrap gap-8">
          <div>
            <Button theme="muted" className="rounded-l-button" rounded="squared">Merge</Button>
            <Button theme="primary" rounded="squared">Merge</Button>
            <Button theme="muted" className="rounded-r-button" rounded="squared">Button</Button>
          </div>
        </Card>
      </div>
    </DocsLayout>
  );
}
