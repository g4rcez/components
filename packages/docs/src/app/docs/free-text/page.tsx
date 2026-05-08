"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, Input } from "../../../../../lib/src";
import { createFreeText } from "../../../../../lib/src/components/form/free-text";

const Textarea = createFreeText("textarea", "textarea", {});

export default function FreeTextPage() {
    return (
        <DocsLayout
            title="createFreeText"
            section="form"
            description="A factory that creates labelled text input components (input or textarea) with built-in error, info, left/right slots, and focus management."
        >
            <ComponentDemo
                title="Built-in Input"
                description="The Input component is created with createFreeText. It inherits all InputField features."
                code={`import { Input } from "@g4rcez/components";

function BuiltinInput() {
  return (
    <div className="flex flex-col gap-4">
      <Input name="username" title="Username" placeholder="Enter username" required />
      <Input
        name="email"
        title="Email"
        placeholder="user@example.com"
        info="We will never share your email."
        required
      />
      <Input name="note" title="Note" placeholder="Optional note" />
    </div>
  );
}`}
            >
                <Card title="Built-in Input">
                    <div className="flex flex-col gap-4">
                        <Input name="username" title="Username" placeholder="Enter username" required />
                        <Input name="email" title="Email" placeholder="user@example.com" info="We will never share your email." required />
                        <Input name="note" title="Note" placeholder="Optional note" />
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Custom Textarea via createFreeText"
                description="Pass 'textarea' as the element to get a resizable text area with the same field wrapper."
                code={`import { createFreeText } from "@g4rcez/components";

const Textarea = createFreeText("textarea", "textarea", {});

function TextareaDemo() {
  return (
    <Textarea
      name="description"
      title="Description"
      placeholder="Enter a description..."
      required
    />
  );
}`}
            >
                <Card title="Textarea">
                    <Textarea name="description" title="Description" placeholder="Enter a description..." required />
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Error and Feedback States"
                description="Pass error to show validation feedback and feedback for success hints."
                code={`import { Input } from "@g4rcez/components";

function ErrorStates() {
  return (
    <div className="flex flex-col gap-4">
      <Input
        name="email-error"
        title="Email"
        placeholder="user@example.com"
        error="Invalid email address."
        required
      />
      <Input
        name="code"
        title="Invite code"
        placeholder="XXXX-XXXX"
        feedback="Code accepted!"
        required
      />
    </div>
  );
}`}
            >
                <Card title="Error & feedback">
                    <div className="flex flex-col gap-4">
                        <Input name="email-error" title="Email" placeholder="user@example.com" error="Invalid email address." required />
                        <Input name="code" title="Invite code" placeholder="XXXX-XXXX" feedback="Code accepted!" required />
                    </div>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
