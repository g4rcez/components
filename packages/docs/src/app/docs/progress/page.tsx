"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, Progress } from "../../../../../lib/src";

export default function ProgressPage() {
  return (
    <DocsLayout title="Progress" description="Visual feedback for ongoing operations." section="display">
      <ComponentDemo
        title="Basic Progress Bar"
        description="A simple progress bar showing 50% completion with custom styling."
        code={`"use client";
import { Progress } from "@g4rcez/components";

function BasicProgressBar() {
  return (
    <Progress percent={50} className="bg-gradient-to-r from-primary-hover to-primary" container="h-4 text-sm" />
  );
}`}
      >
        <Card>
          <Progress percent={50} className="bg-gradient-to-r from-primary-hover to-primary" container="h-4 text-sm" />
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
