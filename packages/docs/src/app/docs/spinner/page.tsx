"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, Spinner, Loading } from "../../../../../lib/src";

export default function SpinnerPage() {
    return (
        <DocsLayout
            title="Spinner"
            section="display"
            description="An animated loading indicator with ARIA live region support. Loading wraps Spinner in a full-height centered container."
        >
            <ComponentDemo
                title="Default Spinner"
                description="Renders a circular spinner with role=status and aria-live=polite for screen readers."
                code={`import { Spinner } from "@g4rcez/components";

function DefaultSpinner() {
  return <Spinner />;
}`}
            >
                <Card title="Default">
                    <Spinner />
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Custom Size"
                description="Override size via className using Tailwind size utilities."
                code={`import { Spinner } from "@g4rcez/components";

function CustomSizes() {
  return (
    <div className="flex items-center gap-8">
      <Spinner className="size-6" />
      <Spinner className="size-10" />
      <Spinner className="size-16" />
    </div>
  );
}`}
            >
                <Card title="Custom sizes">
                    <div className="flex items-center gap-8">
                        <Spinner className="size-6" />
                        <Spinner className="size-10" />
                        <Spinner className="size-16" />
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Loading Component"
                description="Loading centers a Spinner inside a full-height flex container, ideal for page or section loading states."
                code={`import { Loading } from "@g4rcez/components";

function LoadingDemo() {
  return (
    <div className="h-40 border border-card-border rounded-lg">
      <Loading />
    </div>
  );
}`}
            >
                <Card title="Loading">
                    <div className="h-40 rounded-lg border border-card-border">
                        <Loading />
                    </div>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
