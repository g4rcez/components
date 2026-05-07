"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, Select } from "../../../../../lib/src";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
];

const COUNTRIES = [
  { value: "br", label: "Brazil" },
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
  { value: "jp", label: "Japan" },
];

export default function SelectPage() {
  return (
    <DocsLayout
      title="Select"
      section="form"
      description="A styled native select with label, placeholder, error, and optional left/right slot support."
    >
      <ComponentDemo
        title="Basic Select"
        description="Renders a native select with an animated caret and placeholder option."
        code={`import { Select } from "@g4rcez/components";

function BasicSelect() {
  return (
    <Select
      name="role"
      title="Role"
      placeholder="Choose a role"
      options={[
        { value: "admin", label: "Admin" },
        { value: "member", label: "Member" },
        { value: "viewer", label: "Viewer" },
      ]}
      required
    />
  );
}`}
      >
        <Card title="Basic">
          <Select
            name="role"
            title="Role"
            placeholder="Choose a role"
            options={ROLES}
            required
          />
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="With Error"
        description="Pass error to display validation feedback below the field."
        code={`import { Select } from "@g4rcez/components";

function SelectWithError() {
  return (
    <Select
      name="country"
      title="Country"
      placeholder="Select your country"
      error="Country is required."
      options={[
        { value: "br", label: "Brazil" },
        { value: "us", label: "United States" },
        { value: "de", label: "Germany" },
      ]}
      required
    />
  );
}`}
      >
        <Card title="With error">
          <Select
            name="country"
            title="Country"
            placeholder="Select your country"
            error="Country is required."
            options={COUNTRIES}
            required
          />
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Disabled Select"
        description="A disabled select prevents interaction and shows the disabled cursor."
        code={`import { Select } from "@g4rcez/components";

function DisabledSelect() {
  return (
    <Select
      name="plan"
      title="Plan"
      placeholder="Select a plan"
      disabled
      options={[
        { value: "free", label: "Free" },
        { value: "pro", label: "Pro" },
      ]}
      required
    />
  );
}`}
      >
        <Card title="Disabled">
          <Select
            name="plan"
            title="Plan"
            placeholder="Select a plan"
            disabled
            options={[
              { value: "free", label: "Free" },
              { value: "pro", label: "Pro" },
            ]}
            required
          />
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
