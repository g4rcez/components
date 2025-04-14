"use client";
import { DocsLayout } from "@/components/docs-layout";
import { HelpCircleIcon } from "lucide-react";
import { Button, Card, Expand, Tag } from "../../../../../lib/src";

export default function ExpandPage() {
  return (
    <DocsLayout
      title="Expand"
      section="Floating"
      description="Click to expand button."
    >
      <Card title="Simple with popover">
        <Expand
          theme="raw"
          trigger={
            <span className="flex gap-2 items-center">
              Need help <HelpCircleIcon size={14} />
            </span>
          }
        >
          <div className="flex-col shadow-lg border border-card-border gap-4 w-[200px] rounded-lg bg-card-background p-8 flex items-center justify-center">
            Cras mattis iudicium purus sit amet fermentum. Curabitur blandit
            tempus ardua ridiculus sed magna.
            <Tag>Tags</Tag>
            <Tag indicator="success" theme="neutral">
              Tags
            </Tag>
          </div>
        </Expand>
      </Card>
    </DocsLayout>
  );
}
