import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { CodeBlock } from "@/components/code-block";
import { Button } from "../../../../lib/src";
import Link from "next/link";
import { SparklesIcon } from "lucide-react";

export default function DocsPage() {
  return (
    <DocsLayout
      title="Introduction"
      section="start"
      description="Learn more about this powerful and beautiful React component library."
    >
      <section className="space-y-8">
        <div className="p-6 bg-gradient-to-r rounded-xl border from-primary/5 to-primary/10 border-primary/20">
          <h2 className="mb-3 text-xl font-semibold text-primary">
            Welcome to the Documentation
          </h2>
          <p className="leading-relaxed">
            This library provides a comprehensive set of accessible, customizable, and performant React components built with TypeScript and Tailwind CSS.
            Explore the examples to see how you can build stunning user interfaces.
          </p>
        </div>
        <ComponentDemo
          title="Installation"
          description="Get started by installing the package using your preferred package manager."
          code={`pnpm install @g4rcez/components`}
        >
          <p className="mb-4">
            Install the package using your preferred package manager:
          </p>
          <CodeBlock code="pnpm install @g4rcez/components" />
        </ComponentDemo>

        <ComponentDemo
          title="Basic Usage Example"
          description="See a simple component in action."
          code={`"use client";
import { Button } from "@g4rcez/components";
import { SparklesIcon } from "lucide-react";

function BasicUsage() {
  return (
    <Button theme="primary">
      <SparklesIcon className="w-4 h-4 mr-2" />
      Hello, Component!
    </Button>
  );
}
`}
        >
          <Button theme="primary">
            <SparklesIcon className="size-4 mr-2" />
            Hello, Component!
          </Button>
        </ComponentDemo>

        <div className="mt-12 text-center">
          <Link href="/docs/get-started">
            <Button size="big" theme="secondary">
              Go to Getting Started →
            </Button>
          </Link>
        </div>
      </section>
    </DocsLayout>
  );
}
