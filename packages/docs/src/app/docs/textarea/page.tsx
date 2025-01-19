"use client";
import { DocsLayout } from "@/components/docs-layout";
import React from "react";
import { Card, Textarea } from "../../../../../lib/src";

export default function FormPage() {
  return (
    <DocsLayout
      title="Textarea"
      section="form"
      description="Free text for users, infinity forever."
    >
      <Card title="Textarea">
        <Textarea title="Textarea" placeholder="Write" />
      </Card>
    </DocsLayout>
  );
}
