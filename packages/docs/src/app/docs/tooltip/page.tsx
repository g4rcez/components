"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Button, Card, Tooltip } from "../../../../../lib/src";

export default function TooltipPage() {
  return (
    <DocsLayout title="Tooltip" description="" section="floating">
      <Card className="flex gap-4">
        <Tooltip as={Button} title="Hover me" followCursor>
          Mouse follows you
        </Tooltip>
        <Tooltip hover={false} popover={true} as={Button} title="Only click" followCursor>
          Mouse follows you
        </Tooltip>
        <Tooltip enabled={false} as={Button} disabled title="Disabled" followCursor>
          Mouse follows you
        </Tooltip>
      </Card>
    </DocsLayout>
  );
}
