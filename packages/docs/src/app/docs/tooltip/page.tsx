"use client";
import { DocsLayout } from "@/components/docs-layout";
import { useState } from "react";
import { Button, Card, negate, Tooltip } from "../../../../../lib/src";

const Click = () => {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen(negate);
  return (
    <div className="flex gap-2 items-center border border-card-border px-4 w-fit">
      <Tooltip
        as={Button}
        open={open}
        focus={false}
        hover={false}
        title="Controlled"
      >
        <div className="flex flex-col gap-4">Controlled</div>
      </Tooltip>
      <Button onClick={toggle} theme="muted">
        {open ? "Close" : "Open"}
      </Button>
    </div>
  );
};

export default function TooltipPage() {
  return (
    <DocsLayout title="Tooltip" description="" section="floating">
      <Card className="flex flex-row flex-wrap gap-4">
        <Tooltip as={Button} title="Hover me" followCursor>
          Mouse follows you
        </Tooltip>
        <Tooltip
          hover={false}
          popover={true}
          as={Button}
          title="Only click"
          followCursor
        >
          Mouse follows you
        </Tooltip>
        <Tooltip
          enabled={false}
          as={Button}
          disabled
          title="Disabled"
          followCursor
        >
          Mouse follows you
        </Tooltip>
        <Click />
      </Card>
    </DocsLayout>
  );
}
