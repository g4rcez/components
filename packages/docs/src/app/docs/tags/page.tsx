"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, Tag } from "../../../../../lib/src";

export default function TagsPage() {
  return (
    <DocsLayout
      title="Tags"
      section="display"
      description="Chips, labels, or tags – a versatile component for displaying metadata or status."
    >
      <ComponentDemo
        title="Tag Themes"
        description="Demonstrates various tag themes, from primary to muted, for different contexts."
        code={`"use client";
import { Tag } from "@g4rcez/components";

function TagThemes() {
  return (
    <div className="flex flex-wrap gap-8">
      <Tag>Normal</Tag>
      <Tag theme="danger">danger</Tag>
      <Tag theme="info">info</Tag>
      <Tag theme="muted">muted</Tag>
      <Tag theme="neutral">neutral</Tag>
      <Tag theme="secondary">secondary</Tag>
      <Tag theme="success">success</Tag>
      <Tag theme="warn">warn</Tag>
    </div>
  );
}`}
      >
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
      </ComponentDemo>

      <ComponentDemo
        title="Small and Tiny Tags"
        description="Examples of tags in small and tiny sizes, demonstrating different levels of visual prominence."
        code={`"use client";
import { Tag } from "@g4rcez/components";

function SmallAndTinyTags() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-8">
        <Tag size="small">Normal</Tag>
        <Tag size="small" theme="danger">danger</Tag>
        <Tag size="small" theme="info">info</Tag>
        <Tag size="small" theme="neutral">neutral</Tag>
        <Tag size="small" theme="secondary">secondary</Tag>
        <Tag size="small" theme="success">success</Tag>
        <Tag size="small" theme="warn">warn</Tag>
      </div>
      <div className="flex flex-wrap gap-8">
        <Tag theme="primary" size="tiny">Normal</Tag>
        <Tag theme="danger" size="tiny">danger</Tag>
        <Tag theme="info" size="tiny">info</Tag>
        <Tag theme="secondary" size="tiny">secondary</Tag>
        <Tag theme="success" size="tiny">success</Tag>
        <Tag theme="warn" size="tiny">warn</Tag>
      </div>
    </div>
  );
}`}
      >
        <Card title="Small tags" className="flex flex-wrap gap-8">
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
        <Card title="Tiny tags" className="flex flex-wrap gap-8">
          <Tag theme="primary" size="tiny">Normal</Tag>
          <Tag theme="danger" size="tiny">danger</Tag>
          <Tag theme="info" size="tiny">info</Tag>
          <Tag theme="secondary" size="tiny">secondary</Tag>
          <Tag theme="success" size="tiny">success</Tag>
          <Tag theme="warn" size="tiny">warn</Tag>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Tags with Indicators"
        description="Neutral-themed tags enhanced with colored indicators for status or additional visual cues."
        code={`"use client";
import { Tag } from "@g4rcez/components";

function TagsWithIndicators() {
  return (
    <div className="flex flex-wrap gap-8">
      <Tag size="small" theme="neutral">Normal</Tag>
      <Tag size="small" theme="neutral" indicator="danger">danger</Tag>
      <Tag size="small" theme="neutral" indicator="info">info</Tag>
      <Tag size="small" theme="neutral" indicator="secondary">secondary</Tag>
      <Tag size="small" theme="neutral" indicator="success">success</Tag>
      <Tag size="small" theme="neutral" indicator="warn">warn</Tag>
    </div>
  );
}`}
      >
        <Card title="Small tags" className="flex flex-wrap gap-8">
          <Tag size="small" theme="neutral">Normal</Tag>
          <Tag size="small" theme="neutral" indicator="danger">danger</Tag>
          <Tag size="small" theme="neutral" indicator="info">info</Tag>
          <Tag size="small" theme="neutral" indicator="secondary">secondary</Tag>
          <Tag size="small" theme="neutral" indicator="success">success</Tag>
          <Tag size="small" theme="neutral" indicator="warn">warn</Tag>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
