"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, StatsCard } from "../../../../../lib/src";

export default function CardsPage() {
  return (
    <DocsLayout title="Cards" section="display" description="Flexible containers for organizing content.">
      <ComponentDemo
        title="Basic Cards"
        description="Demonstrates a simple Card with a title and content, and a Card used as a link with a loading state."
        code={`"use client";
import { Card } from "@g4rcez/components";

function BasicCards() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <Card title="Simple Card">Content</Card>
      <Card as="a" title="Card as Link (Loading)" loading>
        Content
      </Card>
    </div>
  );
}`}
      >
        <div className="flex flex-col gap-8 w-full">
          <Card title="OK">Content</Card>
          <Card as="a" title="Loading" loading>
            Content
          </Card>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Stats Card"
        description="Displays key statistics with an optional loading state."
        code={`"use client";
import { StatsCard } from "@g4rcez/components";

function StatsCardDemo() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <StatsCard title="Users" value="500" />
      <StatsCard loading title="Users" value="500" />
    </div>
  );
}`}
      >
        <div className="flex flex-col gap-8 w-full">
          <StatsCard title="Users" value="500" />
          <StatsCard loading title="Users" value="500" />
        </div>
      </ComponentDemo>
    </DocsLayout>
  );
}
