"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { CodeBlock } from "@/components/code-block";
import { useRef } from "react";
import { Button, useNotification } from "@g4rcez/components";

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
                    <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight">Overview</h2>
                    <p className="text-muted-foreground mb-6">
                        Welcome to the documentation! `@g4rcez/components` is a library of high-quality React components designed to help you build
                        beautiful, accessible web applications faster than ever.
                    </p>
                </section>

                <section id="installation">
                    <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight">Installation</h2>
                    <p className="text-muted-foreground mb-6">
                        Install the library with your preferred package manager. It needs React 18 or newer. Icons and animation libraries come with
                        the package, so you do not install them yourself.
                    </p>
                    <div className="border-border/40 bg-background overflow-hidden rounded-xl border">
                        <div className="border-border/40 bg-muted/30 flex items-center justify-between border-b px-4 py-2">
                            <span className="text-muted-foreground text-xs font-medium tracking-wide">Terminal</span>
                        </div>
                        <CodeBlock code="pnpm add @g4rcez/components" lang="bash" />
                    </div>
                    <p className="text-muted-foreground mb-6 mt-6">
                        Then import the CSS in your app stylesheet. `foundation.css` comes first, followed by the CSS of each component you use. Run
                        `npx csscomponents --css src/app.css` to add these imports for you.
                    </p>
                    <div className="border-border/40 bg-background overflow-hidden rounded-xl border">
                        <div className="border-border/40 bg-muted/30 flex items-center justify-between border-b px-4 py-2">
                            <span className="text-muted-foreground text-xs font-medium tracking-wide">app.css</span>
                        </div>
                        <CodeBlock code={`@import "@g4rcez/components/foundation.css";\n@import "@g4rcez/components/button.css";`} lang="css" />
                    </div>
                </section>

                <section id="examples">
                    <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight">Quick Example</h2>
                    <p className="text-muted-foreground mb-6">
                        Here's a simple example of how to use our components. We'll trigger a notification using the `useNotification` hook.
                    </p>
                    <ComponentDemo
                        title="Interactive Demo"
                        description="Our components use Motion for physically-accurate animations. Try triggering a system notification."
                        onReset={() => {
                            count.current = 0;
                        }}
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
                <section id="accessibility" className="border-border border-t pt-12">
                    <h2 className="text-foreground mb-8 text-2xl font-bold tracking-tight">Why this library?</h2>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
                        {[
                            {
                                title: "TypeScript Native",
                                desc: "Every component is strictly typed with full IntelliSense support and zero 'any' patterns.",
                            },
                            {
                                title: "A11y Compliant",
                                desc: "Follows WAI-ARIA patterns, built on Base UI primitives.",
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
                                <h4 className="text-foreground font-semibold">{item.title}</h4>
                                <p className="text-muted-foreground text-[14px] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </DocsLayout>
    );
}
