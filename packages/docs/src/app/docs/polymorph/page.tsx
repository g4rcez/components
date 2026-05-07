"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, Polymorph } from "../../../../../lib/src";

export default function PolymorphPage() {
  return (
    <DocsLayout
      title="Polymorph"
      section="primitives"
      description="A polymorphic wrapper that renders as any HTML element via the `as` prop while forwarding all native props."
    >
      <ComponentDemo
        title="Default Span"
        description="Without an `as` prop, Polymorph renders as a span."
        code={`import { Polymorph } from "@g4rcez/components";

function DefaultSpan() {
  return <Polymorph>I am a span</Polymorph>;
}`}
      >
        <Card title="Default (span)">
          <Polymorph>I am a span</Polymorph>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Custom Element"
        description="Pass `as` to change the rendered element. All native props of the target element are accepted."
        code={`import { Polymorph } from "@g4rcez/components";

function CustomElement() {
  return (
    <div className="flex flex-col gap-4">
      <Polymorph as="h1" className="text-2xl font-bold">Heading 1</Polymorph>
      <Polymorph as="p" className="text-secondary">Paragraph text</Polymorph>
      <Polymorph as="section" className="border border-card-border rounded p-4">
        Section block
      </Polymorph>
    </div>
  );
}`}
      >
        <Card title="As different elements">
          <div className="flex flex-col gap-4">
            <Polymorph as="h1" className="text-2xl font-bold">
              Heading 1
            </Polymorph>
            <Polymorph as="p" className="text-secondary">
              Paragraph text
            </Polymorph>
            <Polymorph
              as="section"
              className="border border-card-border rounded p-4"
            >
              Section block
            </Polymorph>
          </div>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="As Interactive Element"
        description="Polymorph as a button, forwarding all button-specific props including onClick and disabled."
        code={`import { Polymorph } from "@g4rcez/components";

function AsButton() {
  return (
    <div className="flex gap-4">
      <Polymorph
        as="button"
        type="button"
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => alert("Clicked")}
      >
        Click me
      </Polymorph>
      <Polymorph
        as="button"
        type="button"
        disabled
        className="rounded px-4 py-2 bg-muted text-disabled"
      >
        Disabled
      </Polymorph>
    </div>
  );
}`}
      >
        <Card title="As button">
          <div className="flex gap-4">
            <Polymorph
              as="button"
              type="button"
              className="rounded px-4 py-2 bg-primary text-primary-foreground"
              onClick={() => alert("Clicked")}
            >
              Click me
            </Polymorph>
            <Polymorph
              as="button"
              type="button"
              disabled
              className="rounded px-4 py-2 bg-muted text-disabled"
            >
              Disabled
            </Polymorph>
          </div>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
