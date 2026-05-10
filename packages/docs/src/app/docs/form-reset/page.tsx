"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useRef } from "react";
import { Button, Card, Input, Select, formReset } from "../../../../../lib/src";

export default function FormResetPage() {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <DocsLayout
            title="formReset"
            section="form"
            description="A utility function that resets INPUT and SELECT fields to their default values and clears the data-initialized state."
        >
            <ComponentDemo
                title="Basic Form Reset"
                description="Call formReset with the form element to reset all inputs and selects without a full page reload."
                code={`"use client";
import { useRef } from "react";
import { Button, Input, formReset } from "@g4rcez/components";

function BasicFormReset() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} className="flex flex-col gap-4">
      <Input name="username" title="Username" placeholder="Enter username" required />
      <Input name="email" title="Email" placeholder="Enter email" required />
      <div className="flex gap-2">
        <Button type="submit" theme="success">Submit</Button>
        <Button
          type="button"
          theme="muted"
          onClick={() => formReset(formRef.current)}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}`}
            >
                <Card title="Basic reset">
                    <form ref={formRef} className="flex flex-col gap-4">
                        <Input name="username" title="Username" placeholder="Enter username" required />
                        <Input name="email" title="Email" placeholder="Enter email" required />
                        <div className="flex gap-2">
                            <Button type="submit" theme="success">
                                Submit
                            </Button>
                            <Button type="button" theme="muted" onClick={() => formReset(formRef.current)}>
                                Reset
                            </Button>
                        </div>
                    </form>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Reset with Select"
                description="formReset also clears SELECT elements back to an empty value."
                code={`"use client";
import { useRef } from "react";
import { Button, Input, Select, formReset } from "@g4rcez/components";

function ResetWithSelect() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} className="flex flex-col gap-4">
      <Input name="name" title="Name" placeholder="Full name" required />
      <Select
        name="role"
        title="Role"
        placeholder="Select a role"
        options={[
          { value: "admin", label: "Admin" },
          { value: "member", label: "Member" },
          { value: "viewer", label: "Viewer" },
        ]}
        required
      />
      <Button
        type="button"
        theme="muted"
        onClick={() => formReset(formRef.current)}
      >
        Clear form
      </Button>
    </form>
  );
}`}
            >
                <Card title="With select">
                    <form className="flex flex-col gap-4">
                        <Input name="name" title="Name" placeholder="Full name" required />
                        <Select
                            name="role"
                            title="Role"
                            placeholder="Select a role"
                            options={[
                                { value: "admin", label: "Admin" },
                                { value: "member", label: "Member" },
                                { value: "viewer", label: "Viewer" },
                            ]}
                            required
                        />
                        <Button type="button" theme="muted" onClick={() => formReset(formRef.current)}>
                            Clear form
                        </Button>
                    </form>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Null-safe Call"
                description="formReset is a no-op when passed null or undefined, making it safe to call unconditionally."
                code={`import { formReset } from "@g4rcez/components";

formReset(null);
formReset(undefined);
`}
            >
                <Card title="Null-safe">
                    <p className="text-sm text-secondary">
                        Calling <code>formReset(null)</code> or <code>formReset(undefined)</code> is safe and performs no operation. Use it without a
                        null check.
                    </p>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
