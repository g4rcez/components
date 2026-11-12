"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useState } from "react";
import { Button, Card, Tooltip } from "@g4rcez/components";

const stage = "flex flex-row flex-wrap items-center justify-center gap-6 px-4 py-14";

const Controlled = () => {
    const [open, setOpen] = useState(true);
    return (
        <div className="flex items-center gap-4">
            <Tooltip as={Button} theme="info" open={open} onChange={setOpen} focus={false} hover={false} placement="top" title="Build status">
                All 214 checks passed
            </Tooltip>
            <Button theme="muted" onClick={() => setOpen((value) => !value)}>
                {open ? "Hide tooltip" : "Show tooltip"}
            </Button>
        </div>
    );
};

export default function TooltipPage() {
    return (
        <DocsLayout
            title="Tooltip"
            description="Short contextual hints on hover, focus or click. The arrow that points at the trigger is optional."
            section="floating"
        >
            <ComponentDemo
                title="Triggers"
                description="A tooltip opens on hover and on keyboard focus. hover={false} and focus={false} turn either off, popover makes a click toggle it, and enabled={false} switches it off entirely."
                code={`"use client";
import { Button, Card, Tooltip } from "@g4rcez/components";

function Triggers() {
  return (
    <Card className="flex flex-wrap items-center justify-center gap-6 px-4 py-14">
      <Tooltip as={Button} title="Hover me">
        Formats the file with Prettier
      </Tooltip>
      <Tooltip as={Button} hover={false} title="Tab to me">
        Only shows on keyboard focus
      </Tooltip>
      <Tooltip as={Button} popover hover={false} focus={false} title="Click me">
        Click again to dismiss
      </Tooltip>
      <Tooltip as={Button} enabled={false} disabled title="Disabled">
        Never shown
      </Tooltip>
    </Card>
  );
}`}
            >
                <Card className={stage}>
                    <Tooltip as={Button} title="Hover me">
                        Formats the file with Prettier
                    </Tooltip>
                    <Tooltip as={Button} hover={false} title="Tab to me">
                        Only shows on keyboard focus
                    </Tooltip>
                    <Tooltip as={Button} popover hover={false} focus={false} title="Click me">
                        Click again to dismiss
                    </Tooltip>
                    <Tooltip as={Button} enabled={false} disabled title="Disabled">
                        Never shown
                    </Tooltip>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Optional arrow"
                description="A plain tooltip has no arrow. Pass arrow to draw a pointer at the trigger, or arrow={false} to remove the one a popover has by default."
                code={`"use client";
import { Button, Card, Tooltip } from "@g4rcez/components";

function ArrowTooltips() {
  return (
    <Card className="flex flex-wrap items-center justify-center gap-6 px-4 py-14">
      <Tooltip as={Button} theme="muted" placement="top" title="No arrow">
        The default
      </Tooltip>
      <Tooltip as={Button} theme="muted" placement="top" arrow title="With arrow">
        Points at the trigger
      </Tooltip>
      <Tooltip as={Button} theme="muted" placement="top" popover hover={false} focus={false} title="Popover">
        A popover has an arrow by default
      </Tooltip>
      <Tooltip as={Button} theme="muted" placement="top" popover arrow={false} hover={false} focus={false} title="Popover, no arrow">
        arrow={false} removes it
      </Tooltip>
    </Card>
  );
}`}
            >
                <Card className={stage}>
                    <Tooltip as={Button} theme="muted" placement="top" title="No arrow">
                        The default
                    </Tooltip>
                    <Tooltip as={Button} theme="muted" placement="top" arrow title="With arrow">
                        Points at the trigger
                    </Tooltip>
                    <Tooltip as={Button} theme="muted" placement="top" popover hover={false} focus={false} title="Popover">
                        A popover has an arrow by default
                    </Tooltip>
                    <Tooltip as={Button} theme="muted" placement="top" popover arrow={false} hover={false} focus={false} title="Popover, no arrow">
                        arrow={"{false}"} removes it
                    </Tooltip>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Placement"
                description="placement fixes the side. Without it the tooltip opens on top and flips to the opposite side when it would leave the viewport."
                code={`"use client";
import { Button, Card, Tooltip } from "@g4rcez/components";

function Placements() {
  return (
    <Card className="flex flex-wrap items-center justify-center gap-6 px-4 py-14">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} as={Button} theme="muted" arrow placement={side} title={side}>
          Opens on the {side}
        </Tooltip>
      ))}
    </Card>
  );
}`}
            >
                <Card className={stage}>
                    {(["top", "right", "bottom", "left"] as const).map((side) => (
                        <Tooltip key={side} as={Button} theme="muted" arrow placement={side} title={side}>
                            Opens on the {side}
                        </Tooltip>
                    ))}
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Follow the cursor"
                description="followCursor keeps the tooltip next to the pointer while it moves over the trigger."
                code={`"use client";
import { Button, Card, Tooltip } from "@g4rcez/components";

function FollowCursor() {
  return (
    <Card className="flex justify-center px-4 py-14">
      <Tooltip as={Button} theme="muted" followCursor title="Hover and move">
        Follows the pointer
      </Tooltip>
    </Card>
  );
}`}
            >
                <Card className={stage}>
                    <Tooltip as={Button} theme="muted" followCursor title="Hover and move">
                        Follows the pointer
                    </Tooltip>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Controlled"
                description="Pass open and onChange to own the state, for example to show a tooltip after an action."
                code={`"use client";
import { useState } from "react";
import { Button, Tooltip } from "@g4rcez/components";

function Controlled() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex items-center gap-4">
      <Tooltip as={Button} theme="info" open={open} onChange={setOpen} focus={false} hover={false} placement="top" title="Build status">
        All 214 checks passed
      </Tooltip>
      <Button theme="muted" onClick={() => setOpen((value) => !value)}>
        {open ? "Hide tooltip" : "Show tooltip"}
      </Button>
    </div>
  );
}`}
            >
                <Card className={stage}>
                    <Controlled />
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Icon hints"
                description="asChild uses the title element as the trigger, with no wrapper. closeOnClick closes the tooltip on click until the pointer leaves. touch={false} ignores touch pointers. delay sets the hover open delay in ms."
                code={`"use client";
import { Button, Card, Tooltip } from "@g4rcez/components";

function IconHints() {
  return (
    <Card className="flex flex-wrap items-center justify-center gap-6 px-4 py-14">
      <Tooltip asChild closeOnClick touch={false} delay={300} placement="top" title={<Button theme="muted">Copy</Button>}>
        Copy to clipboard
      </Tooltip>
      <Tooltip asChild touch={false} placement="right" title={<Button theme="muted">Right side</Button>}>
        Opens to the right of the trigger
      </Tooltip>
    </Card>
  );
}`}
            >
                <Card className={stage}>
                    <Tooltip asChild closeOnClick touch={false} delay={300} placement="top" title={<Button theme="muted">Copy</Button>}>
                        Copy to clipboard
                    </Tooltip>
                    <Tooltip asChild touch={false} placement="right" title={<Button theme="muted">Right side</Button>}>
                        Opens to the right of the trigger
                    </Tooltip>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
