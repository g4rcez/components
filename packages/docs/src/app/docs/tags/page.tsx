"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Card, Tag } from "../../../../../lib/src";

export default function TagsPage() {
  return (
    <DocsLayout
      title="Tags"
      section="display"
      description="Chips, tags...you can choose the name"
    >
      <Card title="All tag themes" className="flex gap-8">
        <Tag>Normal</Tag>
        <Tag theme="danger">danger</Tag>
        <Tag theme="info">info</Tag>
        <Tag theme="neutral">neutral</Tag>
        <Tag theme="secondary">secondary</Tag>
        <Tag theme="success">success</Tag>
        <Tag theme="warn">warn</Tag>
      </Card>
    </DocsLayout>
  );
}
