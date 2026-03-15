"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import React from "react";
import { Card, Textarea } from "../../../../../lib/src";

export default function TextareaPage() {
  return (
    <DocsLayout
      title="Textarea"
      section="form"
      description="A multi-line text input that automatically adjusts its height."
    >
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
    </DocsLayout>
  );
}
