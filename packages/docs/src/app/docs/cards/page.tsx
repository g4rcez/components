"use client";
import { Card, StatsCard, type Label } from "../../../../../lib/src";

export default function StatsCardPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <StatsCard title="Users" description="500" />
      <Card title="OK">Content</Card>
      <Card title="Loading" loading>
        Content
      </Card>
    </div>
  );
}
