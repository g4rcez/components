"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Button, Card, Tooltip } from "../../../../../lib/src";

export default function TooltipPage() {
  return (
    <DocsLayout title="Tooltip" description="" section="floating">
      <Card className="flex gap-4">
        <Tooltip as={Button} title="Hover me">
          Mouse follows you
        </Tooltip>
        <Tooltip hover={false} popover={true} as={Button} title="Only click">
          Mouse follows you
        </Tooltip>
        <Tooltip enabled={false} as={Button} disabled title="Disabled">
          Mouse follows you
        </Tooltip>
      </Card>
    </DocsLayout>
  );
}
