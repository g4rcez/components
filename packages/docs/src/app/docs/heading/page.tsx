"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card } from "../../../../../lib/src";
import { Heading } from "../../../../../lib/src/components/core/heading";

export default function HeadingPage() {
    return (
        <DocsLayout title="Heading" section="primitives" description="A semantic heading element rendered as h2 via the Polymorph primitive.">
            <ComponentDemo
                title="Basic Heading"
                description="Renders children inside an h2 element."
                code={`import { Heading } from "@g4rcez/components/core/heading";

function BasicHeading() {
  return <Heading>Welcome to the docs</Heading>;
}`}
            >
                <Card title="Basic">
                    <Heading>Welcome to the docs</Heading>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Heading in Context"
                description="Heading used alongside descriptive text to form a content block."
                code={`import { Heading } from "@g4rcez/components/core/heading";

function HeadingInContext() {
  return (
    <div className="flex flex-col gap-2">
      <Heading>Getting Started</Heading>
      <p className="text-secondary text-sm">
        Follow these steps to set up your project.
      </p>
    </div>
  );
}`}
            >
                <Card title="With context">
                    <div className="flex flex-col gap-2">
                        <Heading>Getting Started</Heading>
                        <p className="text-sm text-secondary">Follow these steps to set up your project.</p>
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Multiple Headings"
                description="Multiple headings forming a document outline."
                code={`import { Heading } from "@g4rcez/components/core/heading";

function MultipleHeadings() {
  return (
    <div className="flex flex-col gap-4">
      <Heading>Section One</Heading>
      <Heading>Section Two</Heading>
      <Heading>Section Three</Heading>
    </div>
  );
}`}
            >
                <Card title="Multiple">
                    <div className="flex flex-col gap-4">
                        <Heading>Section One</Heading>
                        <Heading>Section Two</Heading>
                        <Heading>Section Three</Heading>
                    </div>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
