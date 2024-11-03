"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Button, Card } from "../../../../../lib/src";

export default function Buttons() {
  return (
    <DocsLayout
      title="Buttons"
      section="display"
      description="The way to user interact with your actions"
    >
      <Card title="All tag themes" className="flex gap-8">
        <Button>Normal</Button>
        <Button theme="danger">danger</Button>
        <Button theme="info">info</Button>
        <Button theme="neutral">neutral</Button>
        <Button theme="secondary">secondary</Button>
        <Button theme="success">success</Button>
        <Button theme="warn">warn</Button>
      </Card>
    </DocsLayout>
  );
}
