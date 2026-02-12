"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Card, Progress } from "../../../../../lib/src";

export default function ProgressPage() {
  return (
    <DocsLayout title="Display" description="Waiting..." section="display">
      <Card>
        <Progress percent={50} className="bg-linear-to-r from-primary-hover to-primary" container="h-4 text-sm" />
      </Card>
    </DocsLayout>
  );
}
