"use client";
import { Card, StatsCard } from "../../../../../lib/src";

export default function StatsCardPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <StatsCard title="Users" value="500" />
      <StatsCard loading title="Users" value="500" />
      <Card title="OK">Content</Card>
      <Card as="a" title="Loading" loading>
        Content
      </Card>
    </div>
  );
}
