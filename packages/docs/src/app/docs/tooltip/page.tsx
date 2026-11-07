"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useState } from "react";
import { Button, Card, negate, Tooltip } from "@g4rcez/components";

const Click = () => {
    const [open, setOpen] = useState(true);
    const toggle = () => setOpen(negate);
    return (
        <div className="flex w-fit items-center gap-2 border border-card-border px-4">
            <Tooltip as={Button} open={open} focus={false} hover={false} title="Controlled">
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
        <DocsLayout title="Tooltip" description="Displays contextual information on hover, focus, or click." section="floating">
            <ComponentDemo
                title="Basic Tooltips and Interactions"
                description="Demonstrates tooltips with various triggers (hover, click, disabled) and cursor-following behavior."
                code={`"use client";
import { useState } from "react";
import { Button, Card, negate, Tooltip } from "@g4rcez/components";

function BasicTooltips() {
  const ClickControlled = () => {
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

  return (
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
      <ClickControlled />
    </Card>
  );
}`}
            >
                <Card className="flex flex-row flex-wrap gap-4">
                    <Tooltip as={Button} title="Hover me" followCursor>
                        Mouse follows you
                    </Tooltip>
                    <Tooltip hover={false} popover={true} as={Button} title="Only click" followCursor>
                        Mouse follows you
                    </Tooltip>
                    <Tooltip enabled={false} as={Button} disabled title="Disabled" followCursor>
                        Mouse follows you
                    </Tooltip>
                    <Click />
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Icon Hints"
                description="asChild uses the title element as the trigger, with no wrapper. placement fixes the side. closeOnClick closes the tooltip on click until the pointer leaves. touch={false} ignores touch pointers. arrow={false} removes the arrow. delay sets the hover open delay in ms."
                code={`"use client";
import { Button, Tooltip } from "@g4rcez/components";

function IconHints() {
  return (
    <div className="flex flex-wrap gap-4">
      <Tooltip asChild closeOnClick touch={false} arrow={false} delay={300} placement="top" title={<Button theme="muted">Copy</Button>}>
        Copy to clipboard
      </Tooltip>
      <Tooltip asChild touch={false} arrow={false} placement="right" title={<Button theme="muted">Right side</Button>}>
        Opens to the right of the trigger
      </Tooltip>
    </div>
  );
}`}
            >
                <Card className="flex flex-row flex-wrap gap-4">
                    <Tooltip asChild closeOnClick touch={false} arrow={false} delay={300} placement="top" title={<Button theme="muted">Copy</Button>}>
                        Copy to clipboard
                    </Tooltip>
                    <Tooltip asChild touch={false} arrow={false} placement="right" title={<Button theme="muted">Right side</Button>}>
                        Opens to the right of the trigger
                    </Tooltip>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
