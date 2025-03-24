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
      <div className="flex flex-col gap-8">
        <Card title="All tag themes" className="flex flex-wrap gap-8">
          <Tag>Normal</Tag>
          <Tag theme="danger">danger</Tag>
          <Tag theme="info">info</Tag>
          <Tag theme="muted">muted</Tag>
          <Tag theme="neutral">neutral</Tag>
          <Tag theme="secondary">secondary</Tag>
          <Tag theme="success">success</Tag>
          <Tag theme="warn">warn</Tag>
        </Card>

        <Card title="Small tags" className="flex gap-8">
          <Tag size="small">Normal</Tag>
          <Tag size="small" theme="danger">
            danger
          </Tag>
          <Tag size="small" theme="info">
            info
          </Tag>
          <Tag size="small" theme="neutral">
            neutral
          </Tag>
          <Tag size="small" theme="secondary">
            secondary
          </Tag>
          <Tag size="small" theme="success">
            success
          </Tag>
          <Tag size="small" theme="warn">
            warn
          </Tag>
        </Card>

        <Card title="Small tags" className="flex gap-8">
          <Tag theme="neutral">Normal</Tag>
          <Tag theme="neutral" indicator="danger">danger</Tag>
          <Tag theme="neutral" indicator="info">info</Tag>
          <Tag theme="neutral" indicator="secondary">secondary</Tag>
          <Tag theme="neutral" indicator="success">success</Tag>
          <Tag theme="neutral" indicator="warn">warn</Tag>
        </Card>
      </div>
    </DocsLayout>
  );
}
