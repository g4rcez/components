"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Button, Card, Tooltip } from "../../../../../lib/src";

export default function TooltipPage() {
  return (
    <DocsLayout title="Tooltip" description="" section="floating">
      <Card>
        <Tooltip as={Button} title="Hover me">Mouse follows you</Tooltip>
      </Card>
    </DocsLayout>
  );
}
