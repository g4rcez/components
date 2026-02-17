"use client";
import { DocsLayout } from "@/components/docs-layout";
import { useRef } from "react";
import { Button } from "../../../../../lib/src";
import { useNotification } from "../../../../../lib/src/components/display/notifications";

export default function GetStartedPage() {
  const notification = useNotification();
  const count = useRef(0);

  return (
    <DocsLayout
      title="Getting Started"
      section="Introduction"
      description="Learn how to install and use our modern React component library in your projects."
    >
      <section className="space-y-8">
        <div className="p-6 bg-gradient-to-r rounded-xl border from-primary/5 to-primary/10 border-primary/20">
          <h2 className="mb-3 text-xl font-semibold text-primary">
            Welcome to UI Components
          </h2>
          <p className="leading-relaxed">
            A modern, accessible, and customizable React component library built
            with TypeScript and Tailwind CSS. Get started in minutes with our
            comprehensive set of components.
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Installation</h2>
            <div className="p-6 rounded-lg border bg-card-background border-card-border">
              <p className="mb-4">
                Install the package using your preferred package manager:
              </p>
              <pre className="p-4 font-mono rounded-lg border border-card-border bg-card-background">
                <code>pnpm install @g4rcez/components</code>
              </pre>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-lg border bg-card-background border-card-border">
              <h3 className="flex gap-2 items-center mb-3 font-semibold">
                <span className="text-2xl">🚀</span>
                Quick Start
              </h3>
              <p className="mb-4 text-sm">
                Import components and start building beautiful UIs immediately.
              </p>
              <Button
                onClick={() => {
                  const prev = count.current;
                  const c = prev + 1;
                  count.current = c;
                  notification(
                    `Notification ${c}. Lorem ipsum dolor sit amet, consectetur adipisici.`,
                    { title: "Success", theme: "success" },
                  );
                }}
                className="w-full"
              >
                Try Notification
              </Button>
            </div>
            <div className="p-6 rounded-lg border bg-card-background border-card-border">
              <h3 className="flex gap-2 items-center mb-3 font-semibold">
                <span className="text-2xl">⚡</span>
                Zero Config
              </h3>
              <p className="text-sm">
                No complex setup required. Components work out of the box with
                sensible defaults and beautiful styling.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Key Features</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "TypeScript First",
                  desc: "Built with TypeScript for better developer experience",
                  icon: "📝",
                },
                {
                  title: "Accessible",
                  desc: "WCAG compliant components with keyboard navigation",
                  icon: "♿",
                },
                {
                  title: "Customizable",
                  desc: "Easy theming with CSS variables and Tailwind",
                  icon: "🎨",
                },
                {
                  title: "Modern Design",
                  desc: "Beautiful default styling that works everywhere",
                  icon: "✨",
                },
                {
                  title: "Tree Shakable",
                  desc: "Import only what you need for optimal bundle size",
                  icon: "🌳",
                },
                {
                  title: "Well Documented",
                  desc: "Comprehensive docs with examples and API reference",
                  icon: "📚",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-lg border transition-shadow hover:shadow-sm bg-card-background border-card-border"
                >
                  <div className="flex gap-2 items-center mb-2">
                    <span className="text-lg">{feature.icon}</span>
                    <h4 className="font-medium">{feature.title}</h4>
                  </div>
                  <p className="text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
