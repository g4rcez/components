"use client";

import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@g4rcez/components";
import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function DocsPage() {
    return (
        <DocsLayout title="Introduction" section="start" description="Accessible, customizable React components. Build your interface, your way.">
            <p className="docs-intro-copy">
                A collection of React components built with TypeScript and CSS design tokens. Explore the examples, find the right building blocks,
                and make them your own.
            </p>

            <div className="docs-start-links">
                <Link href="/docs/get-started">
                    <span>
                        <strong>Get started</strong>
                        <span>Install the library and build your first interface.</span>
                    </span>
                    <ArrowRightIcon size={20} aria-hidden="true" />
                </Link>
                <Link href="/docs/setup">
                    <span>
                        <strong>Make it yours</strong>
                        <span>Set up your theme with colors and design tokens.</span>
                    </span>
                    <ArrowRightIcon size={20} aria-hidden="true" />
                </Link>
            </div>

            <section aria-labelledby="installation-title">
                <h2 id="installation-title">Installation</h2>
                <p>Get started by installing the package using your preferred package manager.</p>
                <CodeBlock code="pnpm install @g4rcez/components" lang="bash" />
                <p className="docs-install-note">
                    Next, follow the <Link href="/docs/get-started">setup guide</Link> for peer dependencies and{" "}
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
                <h2 id="explore-title">Find your next building block</h2>
                <p>Explore components by the job you need them to do.</p>
                <div className="docs-explore-links">
                    <Link href="/docs/input">
                        <strong>Collect input</strong>
                        <span>Forms, fields, and selection controls</span>
                        <ArrowRightIcon size={17} aria-hidden="true" />
                    </Link>
                    <Link href="/docs/table">
                        <strong>Display information</strong>
                        <span>Tables, cards, and data presentation</span>
                        <ArrowRightIcon size={17} aria-hidden="true" />
                    </Link>
                    <Link href="/docs/modal">
                        <strong>Add interaction</strong>
                        <span>Dialogs, menus, and floating elements</span>
                        <ArrowRightIcon size={17} aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </DocsLayout>
    );
}
