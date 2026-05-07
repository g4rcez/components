"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useState } from "react";
import { Card, Switch } from "../../../../../lib/src";

export default function SwitchPage() {
  const [notifications, setNotifications] = useState(false);
  const [marketing, setMarketing] = useState(true);

  return (
    <DocsLayout
      title="Switch"
      section="form"
      description="An accessible toggle switch backed by a hidden checkbox, with animated thumb and keyboard support."
    >
      <ComponentDemo
        title="Basic Switch"
        description="Renders a toggle with a label. The child content becomes the visible label text."
        code={`import { Switch } from "@g4rcez/components";

function BasicSwitch() {
  return (
    <div className="flex flex-col gap-4">
      <Switch name="auto-save">Enable auto-save</Switch>
      <Switch name="dark-mode" defaultChecked>Dark mode</Switch>
    </div>
  );
}`}
      >
        <Card title="Basic">
          <div className="flex flex-col gap-4">
            <Switch name="auto-save">Enable auto-save</Switch>
            <Switch name="dark-mode" defaultChecked>
              Dark mode
            </Switch>
          </div>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Controlled Switch"
        description="Use onCheck to receive the next boolean value and drive state externally."
        code={`"use client";
import { useState } from "react";
import { Switch } from "@g4rcez/components";

function ControlledSwitch() {
  const [notifications, setNotifications] = useState(false);
  const [marketing, setMarketing] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      <Switch
        name="notifications"
        checked={notifications}
        onCheck={setNotifications}
      >
        Email notifications — {notifications ? "on" : "off"}
      </Switch>
      <Switch
        name="marketing"
        checked={marketing}
        onCheck={setMarketing}
      >
        Marketing emails — {marketing ? "on" : "off"}
      </Switch>
    </div>
  );
}`}
      >
        <Card title="Controlled">
          <div className="flex flex-col gap-4">
            <Switch
              name="notifications"
              checked={notifications}
              onCheck={setNotifications}
            >
              Email notifications — {notifications ? "on" : "off"}
            </Switch>
            <Switch name="marketing" checked={marketing} onCheck={setMarketing}>
              Marketing emails — {marketing ? "on" : "off"}
            </Switch>
          </div>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Disabled and Error States"
        description="disabled prevents interaction. error renders a message below the switch."
        code={`import { Switch } from "@g4rcez/components";

function DisabledAndError() {
  return (
    <div className="flex flex-col gap-4">
      <Switch name="locked" disabled defaultChecked>
        Feature locked (enabled)
      </Switch>
      <Switch name="broken" error="This setting cannot be changed right now.">
        Experimental feature
      </Switch>
    </div>
  );
}`}
      >
        <Card title="Disabled & error">
          <div className="flex flex-col gap-4">
            <Switch name="locked" disabled defaultChecked>
              Feature locked (enabled)
            </Switch>
            <Switch
              name="broken"
              error="This setting cannot be changed right now."
            >
              Experimental feature
            </Switch>
          </div>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
