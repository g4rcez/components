"use client";

import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { CodeBlock } from "@/components/code-block";
import { sections } from "@/config/navigation";
import { Button } from "@g4rcez/components";
import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react";
import Link from "next/link";

const libraryDescriptions: Record<string, string> = {
    Primitives: "Typography, layout, and composition building blocks.",
    "Display Components": "Cards, tables, calendars, and other ways to present information.",
    "Floating Elements": "Modals, menus, dropdowns, and tooltips that sit above the page.",
    "Form Controls": "Inputs, selects, pickers, and validation.",
};

const library = sections.filter((section) => section.title in libraryDescriptions);

export default function DocsPage() {
    return (
        <DocsLayout title="Introduction" section="start" description="Accessible, customizable React components. Build your interface, your way.">
            <p className="docs-intro-copy">
                A collection of React components built with TypeScript and CSS design tokens. Explore the examples, find the right building blocks,
                and make them your own.
            </p>

            <nav className="docs-hub" aria-label="Start here">
                <Link href="/docs/get-started" className="docs-hub-cell">
                    <span className="docs-hub-head">
                        <strong>Get started</strong>
                        <ArrowRightIcon size={16} aria-hidden="true" />
                    </span>
                    <span className="docs-hub-text">Install the library and build your first interface.</span>
                </Link>
                <Link href="/docs/setup" className="docs-hub-cell">
                    <span className="docs-hub-head">
                        <strong>Make it yours</strong>
                        <ArrowRightIcon size={16} aria-hidden="true" />
                    </span>
                    <span className="docs-hub-text">Set up your theme with colors and design tokens.</span>
                </Link>
            </nav>

            <section aria-labelledby="installation-title">
                <h2 id="installation-title">Installation</h2>
                <p>Get started by installing the package using your preferred package manager.</p>
                <CodeBlock code="pnpm add @g4rcez/components" lang="bash" />
                <p className="docs-install-note">
                    Next, follow the <Link href="/docs/get-started">setup guide</Link> to import the CSS and use your first component, then the{" "}
                    <Link href="/docs/setup">theme configuration</Link>.
                </p>
            </section>

            <section aria-labelledby="first-component-title">
                <h2 id="first-component-title">Your first component</h2>
                <ComponentDemo
                    title="Basic Usage Example"
                    description="Import a component and make it part of your interface."
                    code={`"use client";
import { Button } from "@g4rcez/components";
import { SparkleIcon } from "@phosphor-icons/react";

function BasicUsage() {
  return (
    <Button theme="primary">
      <SparkleIcon className="size-4" />
      Hello, Component!
    </Button>
  );
}`}
                >
                    <Button theme="primary">
                        <SparkleIcon className="size-4" aria-hidden="true" />
                        Hello, Component!
                    </Button>
                </ComponentDemo>
            </section>

            <section aria-labelledby="explore-title">
                <h2 id="explore-title">Browse the library</h2>
                <p>Every component has live examples, usage guidance, and accessibility notes.</p>
                <nav className="docs-hub" aria-label="Component groups">
                    {library.map((section) => (
                        <Link key={section.title} href={section.items[0].href} className="docs-hub-cell">
                            <span className="docs-hub-head">
                                <strong>{section.title}</strong>
                                <ArrowRightIcon size={16} aria-hidden="true" />
                            </span>
                            <span className="docs-hub-text">{libraryDescriptions[section.title]}</span>
                            <span className="docs-hub-meta">
                                {section.items.length} components ·{" "}
                                {section.items
                                    .slice(0, 4)
                                    .map((item) => item.title)
                                    .join(", ")}
                            </span>
                        </Link>
                    ))}
                </nav>
            </section>
        </DocsLayout>
    );
}
