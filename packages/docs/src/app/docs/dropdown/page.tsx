"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useState } from "react";
import { Button, Card, Dropdown } from "../../../../../lib/src";

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
    <Dropdown trigger={<Button>Open dropdown</Button>} title="Options">
      <ul className="flex flex-col gap-2">
        <li><button type="button" className="w-full text-left px-2 py-1 rounded hover:bg-muted">Profile</button></li>
        <li><button type="button" className="w-full text-left px-2 py-1 rounded hover:bg-muted">Settings</button></li>
        <li><button type="button" className="w-full text-left px-2 py-1 rounded hover:bg-muted text-danger">Sign out</button></li>
      </ul>
    </Dropdown>
  );
}`}
            >
                <Card title="Basic">
                    <Dropdown trigger={<Button>Open dropdown</Button>} title="Options">
                        <ul className="flex flex-col gap-2">
                            <li>
                                <button type="button" className="w-full rounded px-2 py-1 text-left hover:bg-muted">
                                    Profile
                                </button>
                            </li>
                            <li>
                                <button type="button" className="w-full rounded px-2 py-1 text-left hover:bg-muted">
                                    Settings
                                </button>
                            </li>
                            <li>
                                <button type="button" className="w-full rounded px-2 py-1 text-left text-danger hover:bg-muted">
                                    Sign out
                                </button>
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
    <Dropdown hover trigger={<Button theme="secondary">Hover me</Button>} title="Quick info">
      <p className="text-sm text-secondary max-w-48">
        This dropdown opens on hover and closes when you move away.
      </p>
    </Dropdown>
  );
}`}
            >
                <Card title="Hover">
                    <Dropdown hover trigger={<Button theme="secondary">Hover me</Button>} title="Quick info">
                        <p className="max-w-48 text-sm text-secondary">This dropdown opens on hover and closes when you move away.</p>
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
                        <Dropdown open={open} onChange={setOpen} trigger={<Button theme="info">Controlled</Button>} title="Controlled panel">
                            <p className="text-sm">Opened from outside: {open ? "yes" : "no"}</p>
                        </Dropdown>
                        <Button theme="muted" onClick={() => setOpen((v) => !v)}>
                            {open ? "Close" : "Open"} externally
                        </Button>
                    </div>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
