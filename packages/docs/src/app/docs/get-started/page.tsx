"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { CodeBlock } from "@/components/code-block";
import { SparkleIcon } from "@phosphor-icons/react";
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
            description="Modern React components for building high-performance web interfaces. Accessible, customizable, and developer-friendly."
        >
            <div className="space-y-12">
                <section id="overview">
                    <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">Overview</h2>
                    <p className="mb-6 text-muted-foreground">
                        Welcome to the documentation! `@g4rcez/components` is a library of high-quality React components designed to help you build
                        beautiful, accessible web applications faster than ever.
                    </p>
                </section>

                <section id="installation">
                    <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">Installation</h2>
                    <p className="mb-6 text-muted-foreground">
                        Install the library and its peer dependencies using your preferred package manager. We recommend `pnpm` for its speed and
                        efficiency.
                    </p>
                    <div className="overflow-hidden rounded-xl border border-border/40 bg-background shadow-sm">
                        <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-4 py-2">
                            <span className="text-xs font-medium tracking-wide text-muted-foreground">Terminal</span>
                        </div>
                        <CodeBlock code="pnpm install @g4rcez/components @phosphor-icons/react motion" lang="bash" />
                    </div>
                </section>

                <section id="examples">
                    <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">Quick Example</h2>
                    <p className="mb-6 text-muted-foreground">
                        Here's a simple example of how to use our components. We'll trigger a notification using the `useNotification` hook.
                    </p>
                    <ComponentDemo
                        title="Interactive Demo"
                        description="Our components use Framer Motion for physically-accurate animations. Try triggering a system notification."
                        code={`import { Button, useNotification } from "@g4rcez/components";

function App() {
  const notification = useNotification();

  return (
    <Button 
      theme="primary" 
      onClick={() => notification("Action successful!", { theme: "success" })}
    >
      Trigger Alert
    </Button>
  );
}`}
                    >
                        <Button
                            size="big"
                            theme="primary"
                            onClick={() => {
                                const c = count.current + 1;
                                count.current = c;
                                notification(`System Check #${c}: All components are performing within optimal parameters.`, {
                                    title: "Status: Active",
                                    theme: "success",
                                    timeout: 5000,
                                });
                            }}
                        >
                            Verify System Status
                        </Button>
                    </ComponentDemo>
                </section>
                <section id="accessibility" className="border-t border-border pt-12">
                    <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground">Why this library?</h2>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
                        {[
                            {
                                title: "TypeScript Native",
                                desc: "Every component is strictly typed with full IntelliSense support and zero 'any' patterns.",
                            },
                            {
                                title: "A11y Compliant",
                                desc: "Strictly adheres to WAI-ARIA patterns using Radix UI and Base UI foundations.",
                            },
                            {
                                title: "Theming System",
                                desc: "Powered by CSS variables and design tokens. Effortless dark mode and customization.",
                            },
                            {
                                title: "Tree Shakable",
                                desc: "Import only what you use. Minimal impact on your bundle size and lighthouse scores.",
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <h4 className="font-semibold text-foreground">{item.title}</h4>
                                <p className="text-[14px] leading-relaxed text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </DocsLayout>
    );
}
