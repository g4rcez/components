"use client";
import { DocsLayout } from "@/components/docs-layout";
import React, { useState } from "react";
import { Alert, Button, Tab, Tabs } from "../../../../../lib/src";

export default function FormPage() {
  const [state, setState] = useState("second");
  return (
    <DocsLayout
      title="Tabs"
      section="display"
      description="Group your entities in a tab element."
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
        <Tab id="last" title="Last">
          Curabitur est gravida et libero vitae dictum. Nec dubitamus multa iter
          quae et nos invenerat.
        </Tab>
      </Tabs>
    </DocsLayout>
  );
}
