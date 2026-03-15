"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import React, { useState } from "react";
import { Alert, Tab, Tabs } from "../../../../../lib/src";

export default function TabsPage() {
  const [state, setState] = useState("second");
  return (
    <DocsLayout
      title="Tabs"
      section="display"
      description="Group related content into tabbed sections."
    >
      <ComponentDemo
        title="Basic Tabs with Alert"
        description="Demonstrates a basic tabs component with multiple tabs, including one that shows an Alert component when active, and a disabled tab."
        code={`"use client";
import { useState } from "react";
import { Alert, Tab, Tabs } from "@g4rcez/components";

function BasicTabs() {
  const [state, setState] = useState("second");
  return (
    <Tabs active={state} onChange={setState}>
      <Tab id="first" title="First tab">
        Element
      </Tab>
      <Tab id="second" title="Second">
        <Alert title="Title" open={state === "second"} theme="info">
          I'm an alert
        </Alert>
      </Tab>
      <Tab id="other" title="Other">
        0192fc45-add4-7552-8e6f-fc06085040d4
      </Tab>
      <Tab id="last" title="Disabled" disabled>
        null
      </Tab>
    </Tabs>
  );
}`}
      >
        <Tabs active={state} onChange={setState}>
          <Tab id="first" title="First tab">
            Element
          </Tab>
          <Tab id="second" title="Second">
            <Alert title="Title" open={state === "second"} theme="info">
              I'm an alert
            </Alert>
          </Tab>
          <Tab id="other" title="Other">
            0192fc45-add4-7552-8e6f-fc06085040d4
          </Tab>
          <Tab id="last" title="Disabled" disabled>
            null
          </Tab>
        </Tabs>
      </ComponentDemo>
    </DocsLayout>
  );
}
