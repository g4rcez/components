"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useRef, useState } from "react";
import { Button, Card, Dropdown, Input } from "@g4rcez/components";

const NoArrowDropdown = () => {
    const searchRef = useRef<HTMLInputElement>(null);
    return (
        <Dropdown
            asChild
            arrow={false}
            offset={4}
            align="start"
            className="w-72"
            aria-label="Search people"
            initialFocus={searchRef}
            trigger={<Button>Search people</Button>}
        >
            <Input ref={searchRef} aria-label="Search" placeholder="Search" />
        </Dropdown>
    );
};

export default function DropdownPage() {
    const [open, setOpen] = useState(false);
    return (
        <DocsLayout
            title="Dropdown"
            section="floating"
            description="A floating panel triggered by a button, with focus management, keyboard dismissal, and optional hover or arrow display."
        >
            <ComponentDemo
                title="Basic Dropdown"
                description="Click the trigger to open a floating panel with a title and content."
                code={`"use client";
import { Button, Dropdown } from "@g4rcez/components";

function BasicDropdown() {
  return (
    <Dropdown asChild trigger={<Button>Open dropdown</Button>} title="Options">
      <ul className="flex flex-col gap-2">
        <li><Button type="button" theme="ghost-neutral" className="w-full justify-start">Profile</Button></li>
        <li><Button type="button" theme="ghost-neutral" className="w-full justify-start">Settings</Button></li>
        <li><Button type="button" theme="ghost-danger" className="w-full justify-start">Sign out</Button></li>
      </ul>
    </Dropdown>
  );
}`}
            >
                <Card title="Basic">
                    <Dropdown asChild trigger={<Button>Open dropdown</Button>} title="Options">
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Button type="button" theme="ghost-neutral" className="w-full justify-start">
                                    Profile
                                </Button>
                            </li>
                            <li>
                                <Button type="button" theme="ghost-neutral" className="w-full justify-start">
                                    Settings
                                </Button>
                            </li>
                            <li>
                                <Button type="button" theme="ghost-danger" className="w-full justify-start">
                                    Sign out
                                </Button>
                            </li>
                        </ul>
                    </Dropdown>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Hover Trigger"
                description="Pass hover to open the dropdown on mouse enter instead of click."
                code={`"use client";
import { Button, Dropdown } from "@g4rcez/components";

function HoverDropdown() {
  return (
    <Dropdown asChild hover trigger={<Button theme="secondary">Hover me</Button>} title="Quick info">
      <p className="text-sm text-secondary max-w-48">
        This dropdown opens on hover and closes when you move away.
      </p>
    </Dropdown>
  );
}`}
            >
                <Card title="Hover">
                    <Dropdown asChild hover trigger={<Button theme="secondary">Hover me</Button>} title="Quick info">
                        <p className="text-secondary max-w-48 text-sm">This dropdown opens on hover and closes when you move away.</p>
                    </Dropdown>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Controlled Open State"
                description="Control open externally via the open and onChange props."
                code={`"use client";
import { useState } from "react";
import { Button, Dropdown } from "@g4rcez/components";

function ControlledDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Dropdown
        asChild
        open={open}
        onChange={setOpen}
        trigger={<Button theme="info">Controlled</Button>}
        title="Controlled panel"
      >
        <p className="text-sm">Opened from outside: {open ? "yes" : "no"}</p>
      </Dropdown>
      <Button theme="muted" onClick={() => setOpen((v) => !v)}>
        {open ? "Close" : "Open"} externally
      </Button>
    </div>
  );
}`}
            >
                <Card title="Controlled">
                    <div className="flex items-center gap-4">
                        <Dropdown asChild open={open} onChange={setOpen} trigger={<Button theme="info">Controlled</Button>} title="Controlled panel">
                            <p className="text-sm">Opened from outside: {open ? "yes" : "no"}</p>
                        </Dropdown>
                        <Button theme="muted" onClick={() => setOpen((v) => !v)}>
                            {open ? "Close" : "Open"} externally
                        </Button>
                    </div>
                </Card>
            </ComponentDemo>
            <ComponentDemo
                title="Placement"
                description="Use side and align to choose where the panel opens. offset sets the gap in pixels."
                code={`"use client";
import { Button, Dropdown } from "@g4rcez/components";

function PlacementDropdown() {
  return (
    <div className="flex flex-wrap gap-4">
      <Dropdown asChild side="bottom" align="start" trigger={<Button>Bottom start</Button>} title="Bottom start">
        <p className="text-sm">Left edges line up.</p>
      </Dropdown>
      <Dropdown asChild side="bottom" align="end" trigger={<Button>Bottom end</Button>} title="Bottom end">
        <p className="text-sm">Right edges line up.</p>
      </Dropdown>
      <Dropdown asChild side="top" trigger={<Button>Top</Button>} title="Top">
        <p className="text-sm">Opens above the trigger.</p>
      </Dropdown>
    </div>
  );
}`}
            >
                <Card title="Placement">
                    <div className="flex flex-wrap gap-4">
                        <Dropdown asChild side="bottom" align="start" trigger={<Button>Bottom start</Button>} title="Bottom start">
                            <p className="text-sm">Left edges line up.</p>
                        </Dropdown>
                        <Dropdown asChild side="bottom" align="end" trigger={<Button>Bottom end</Button>} title="Bottom end">
                            <p className="text-sm">Right edges line up.</p>
                        </Dropdown>
                        <Dropdown asChild side="top" trigger={<Button>Top</Button>} title="Top">
                            <p className="text-sm">Opens above the trigger.</p>
                        </Dropdown>
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Without Arrow And Title"
                description="Pass arrow={false} to remove the arrow. Without title the panel has no header, so pass aria-label. className sets the panel width and layout (w-72, w-auto). The design system CSS has no @layer, so it wins over utility classes: set the panel padding and radius with --var-dropdown-surface-padding and --var-dropdown-surface-radius, not with p-* or rounded-*. initialFocus picks the element that receives focus."
                code={`"use client";
import { useRef } from "react";
import { Button, Dropdown, Input } from "@g4rcez/components";

function SearchDropdown() {
  const searchRef = useRef<HTMLInputElement>(null);
  return (
    <Dropdown
      asChild
      arrow={false}
      offset={4}
      align="start"
      className="w-72"
      aria-label="Search people"
      initialFocus={searchRef}
      trigger={<Button>Search people</Button>}
    >
      <Input ref={searchRef} aria-label="Search" placeholder="Search" />
    </Dropdown>
  );
}`}
            >
                <Card title="No arrow, no title">
                    <NoArrowDropdown />
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
