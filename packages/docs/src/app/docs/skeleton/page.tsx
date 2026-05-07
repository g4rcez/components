"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card } from "../../../../../lib/src";
import {
  Skeleton,
  SkeletonList,
} from "../../../../../lib/src/components/display/skeleton";

export default function SkeletonPage() {
  return (
    <DocsLayout
      title="Skeleton"
      section="display"
      description="Loading placeholder components that indicate content is being fetched, with proper ARIA attributes for accessibility."
    >
      <ComponentDemo
        title="Basic Skeleton"
        description="A single skeleton block. Customize width and height via className."
        code={`import { Skeleton } from "@g4rcez/components/display/skeleton";

function BasicSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}`}
      >
        <Card title="Basic">
          <div className="flex flex-col gap-4">
            <Skeleton />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Skeleton List"
        description="SkeletonList renders a list of skeleton rows with random widths to simulate real content."
        code={`import { SkeletonList } from "@g4rcez/components/display/skeleton";

function SkeletonListDemo() {
  return (
    <div className="flex flex-col gap-8">
      <SkeletonList rows={3} />
      <SkeletonList rows={6} />
    </div>
  );
}`}
      >
        <Card title="SkeletonList">
          <div className="flex flex-col gap-8">
            <SkeletonList rows={3} />
            <SkeletonList rows={6} />
          </div>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Skeleton as Different Elements"
        description="Use the `as` prop to change the rendered element for semantic correctness."
        code={`import { Skeleton } from "@g4rcez/components/display/skeleton";

function SemanticSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton as="div" className="h-40 w-full rounded-lg" />
      <div className="flex gap-3 items-center">
        <Skeleton as="span" className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
  );
}`}
      >
        <Card title="Semantic elements">
          <div className="flex flex-col gap-4">
            <Skeleton as="div" className="h-40 w-full rounded-lg" />
            <div className="flex gap-3 items-center">
              <Skeleton as="span" className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
