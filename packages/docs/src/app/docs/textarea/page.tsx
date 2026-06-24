"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import React from "react";
import { Card, Textarea } from "../../../../../lib/src";

export default function TextareaPage() {
    return (
        <DocsLayout title="Textarea" section="form" description="A multi-line text input that automatically adjusts its height.">
            <ComponentDemo
                title="Basic Textarea"
                description="A simple textarea component that expands vertically as text is entered."
                code={`"use client";
import { Textarea } from "@g4rcez/components";

function BasicTextarea() {
  return (
    <Textarea title="Textarea" placeholder="Write something here..." />
  );
}`}
            >
                <Card title="Textarea">
                    <Textarea title="Textarea" placeholder="Write" />
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Field Sizes"
                description="Use size=normal or size=small to match dense or default form layouts."
                code={`import { Textarea } from "@g4rcez/components";

function TextareaSizes() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Textarea size="normal" title="Normal textarea" placeholder="Default field height" />
      <Textarea size="small" title="Small textarea" placeholder="Dense field height" />
    </div>
  );
}`}
            >
                <Card title="Sizes" className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Textarea size="normal" title="Normal textarea" placeholder="Default field height" />
                    <Textarea size="small" title="Small textarea" placeholder="Dense field height" />
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
