"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, Progress } from "../../../../../lib/src";

export default function ProgressPage() {
  return (
    <DocsLayout
      title="Progress"
      description="Visual feedback for ongoing operations."
      section="display"
    >
      <ComponentDemo
        title="Basic Progress Bar"
        description="A simple progress bar showing 50% completion with custom styling."
        code={`"use client";
import { Progress } from "@g4rcez/components";

function BasicProgressBar() {
  return (
    <Progress value={50} className="bg-gradient-to-r from-primary-hover to-primary" container="h-4 text-sm" />
  );
}`}
      >
        <Card>
          <Progress
            min={0}
            max={100}
            value={50}
            className="bg-gradient-to-r from-primary-hover to-primary"
            container="h-4 text-sm"
          />
        </Card>
      </ComponentDemo>
      <ComponentDemo
        title="Custom Range"
        description="Width is computed from value relative to min/max — here 75 inside [-100, 100] renders at 88%."
        code={`"use client";
import { Progress } from "@g4rcez/components";

function RangedProgressBar() {
  return <Progress min={-100} max={100} value={75} container="h-4 text-sm" />;
}`}
      >
        <Card>
          <Progress min={-100} max={100} value={75} container="h-4 text-sm" />
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
