"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, InputField } from "../../../../../lib/src";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export default function InputFieldPage() {
  return (
    <DocsLayout
      title="InputField"
      section="form"
      description="The fieldset wrapper used by all form inputs. Composes label, left/right slots, error, feedback, and ARIA attributes."
    >
      <ComponentDemo
        title="Basic InputField"
        description="Wraps a native input with a label, border, and error/feedback support."
        code={`import { InputField } from "@g4rcez/components";

function BasicInputField() {
  return (
    <InputField name="username" title="Username" placeholder="Enter username" required>
      <input
        id="username"
        name="username"
        type="text"
        placeholder="Enter username"
        className="input h-input-height w-full flex-1 rounded-md bg-transparent px-input-x py-input-y text-base text-foreground outline-none"
      />
    </InputField>
  );
}`}
      >
        <Card title="Basic">
          <InputField
            name="username"
            title="Username"
            placeholder="Enter username"
            required
          >
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              className="input h-input-height w-full flex-1 rounded-md bg-transparent px-input-x py-input-y text-base text-foreground outline-none"
            />
          </InputField>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="With Left and Right Slots"
        description="left and right props render content inside the field border, before and after the input."
        code={`import { InputField } from "@g4rcez/components";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

function WithSlots() {
  return (
    <InputField
      name="search"
      title="Search"
      placeholder="Search..."
      left={<MagnifyingGlassIcon size={16} className="text-secondary" />}
      right={<span className="text-xs text-secondary">Ctrl+K</span>}
      required
    >
      <input
        id="search"
        name="search"
        type="search"
        placeholder="Search..."
        className="input h-input-height w-full flex-1 rounded-md bg-transparent px-input-x py-input-y text-base text-foreground outline-none"
      />
    </InputField>
  );
}`}
      >
        <Card title="With slots">
          <InputField
            name="search"
            title="Search"
            placeholder="Search..."
            left={<MagnifyingGlassIcon size={16} className="text-secondary" />}
            right={<span className="text-xs text-secondary">Ctrl+K</span>}
            required
          >
            <input
              id="search"
              name="search"
              type="search"
              placeholder="Search..."
              className="input h-input-height w-full flex-1 rounded-md bg-transparent px-input-x py-input-y text-base text-foreground outline-none"
            />
          </InputField>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Error and Info States"
        description="Pass error to show validation text. Pass info to display a tooltip next to the label."
        code={`import { InputField } from "@g4rcez/components";

function ErrorAndInfo() {
  return (
    <div className="flex flex-col gap-4">
      <InputField
        name="email"
        title="Email"
        error="Please enter a valid email address."
        required
      >
        <input
          id="email"
          name="email"
          type="email"
          className="input h-input-height w-full flex-1 rounded-md bg-transparent px-input-x py-input-y text-base text-foreground outline-none"
        />
      </InputField>
      <InputField
        name="api-key"
        title="API Key"
        info="Generate a key from your account settings."
        required
      >
        <input
          id="api-key"
          name="api-key"
          type="password"
          placeholder="sk-..."
          className="input h-input-height w-full flex-1 rounded-md bg-transparent px-input-x py-input-y text-base text-foreground outline-none"
        />
      </InputField>
    </div>
  );
}`}
      >
        <Card title="Error & info">
          <div className="flex flex-col gap-4">
            <InputField
              name="email"
              title="Email"
              error="Please enter a valid email address."
              required
            >
              <input
                id="email"
                name="email"
                type="email"
                className="input h-input-height w-full flex-1 rounded-md bg-transparent px-input-x py-input-y text-base text-foreground outline-none"
              />
            </InputField>
            <InputField
              name="api-key"
              title="API Key"
              info="Generate a key from your account settings."
              required
            >
              <input
                id="api-key"
                name="api-key"
                type="password"
                placeholder="sk-..."
                className="input h-input-height w-full flex-1 rounded-md bg-transparent px-input-x py-input-y text-base text-foreground outline-none"
              />
            </InputField>
          </div>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
