"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useState } from "react";
import { Card, Radiobox } from "../../../../../lib/src";

export default function RadioboxPage() {
  const [selected, setSelected] = useState("monthly");

  return (
    <DocsLayout
      title="Radiobox"
      section="form"
      description="A styled radio input wrapped in a label, composing native radio semantics with accessible disabled and checked states."
    >
      <ComponentDemo
        title="Basic Radio Group"
        description="Group Radiobox components with the same name to form a mutually exclusive selection."
        code={`import { Radiobox } from "@g4rcez/components";

function BasicRadioGroup() {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium mb-2">Notification preference</legend>
      <Radiobox name="notifications" value="email" defaultChecked>Email</Radiobox>
      <Radiobox name="notifications" value="sms">SMS</Radiobox>
      <Radiobox name="notifications" value="push">Push notification</Radiobox>
    </fieldset>
  );
}`}
      >
        <Card title="Basic group">
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium mb-2">
              Notification preference
            </legend>
            <Radiobox name="notifications" value="email" defaultChecked>
              Email
            </Radiobox>
            <Radiobox name="notifications" value="sms">
              SMS
            </Radiobox>
            <Radiobox name="notifications" value="push">
              Push notification
            </Radiobox>
          </fieldset>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Controlled Selection"
        description="Track the selected value with useState and pass checked to each option."
        code={`"use client";
import { useState } from "react";
import { Radiobox } from "@g4rcez/components";

function ControlledRadio() {
  const [selected, setSelected] = useState("monthly");
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium mb-2">
        Billing cycle — selected: {selected}
      </legend>
      {["monthly", "quarterly", "annually"].map((plan) => (
        <Radiobox
          key={plan}
          name="billing"
          value={plan}
          checked={selected === plan}
          onChange={() => setSelected(plan)}
        >
          {plan.charAt(0).toUpperCase() + plan.slice(1)}
        </Radiobox>
      ))}
    </fieldset>
  );
}`}
      >
        <Card title="Controlled">
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium mb-2">
              Billing cycle — selected: {selected}
            </legend>
            {["monthly", "quarterly", "annually"].map((plan) => (
              <Radiobox
                key={plan}
                name="billing"
                value={plan}
                checked={selected === plan}
                onChange={() => setSelected(plan)}
              >
                {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </Radiobox>
            ))}
          </fieldset>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Disabled State"
        description="Pass disabled to prevent interaction. The label cursor changes to not-allowed."
        code={`import { Radiobox } from "@g4rcez/components";

function DisabledRadio() {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium mb-2">Plan tier</legend>
      <Radiobox name="tier" value="free" defaultChecked>Free</Radiobox>
      <Radiobox name="tier" value="pro" disabled>Pro (unavailable)</Radiobox>
      <Radiobox name="tier" value="enterprise" disabled>Enterprise (unavailable)</Radiobox>
    </fieldset>
  );
}`}
      >
        <Card title="Disabled">
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium mb-2">Plan tier</legend>
            <Radiobox name="tier" value="free" defaultChecked>
              Free
            </Radiobox>
            <Radiobox name="tier" value="pro" disabled>
              Pro (unavailable)
            </Radiobox>
            <Radiobox name="tier" value="enterprise" disabled>
              Enterprise (unavailable)
            </Radiobox>
          </fieldset>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
