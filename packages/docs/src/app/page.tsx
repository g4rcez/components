"use client";
import { CodeBlock } from "@/components/code-block";
import { Footer } from "@/components/footer";
import { Showcase } from "@/components/showcase/showcase";
import { sections } from "@/config/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Button, Tab, Tabs, Tag } from "@g4rcez/components";
import Link from "next/link";
import { useState } from "react";
import "./landing.css";

const installs = [
    { id: "pnpm", command: "pnpm add @g4rcez/components" },
    { id: "npm", command: "npm install @g4rcez/components" },
    { id: "yarn", command: "yarn add @g4rcez/components" },
];

const foundations = [
    ["TypeScript native", "Typed props, variants and tokens end to end."],
    ["Keyboard accessible", "Roles, focus and key commands documented per component."],
    ["Themed by tokens", "One set of CSS variables drives every surface, light and dark."],
    ["Tree-shakeable", "Import a component, and only its styles come with it."],
];

export default function Home() {
    const [manager, setManager] = useState("pnpm");
    const count = sections.filter((section) => section.title !== "Getting Started").reduce((total, section) => total + section.items.length, 0);

    return (
        <div className="landing-page">
            <title>components: React components with the details already done</title>
            <section className="landing-hero" aria-labelledby="landing-title">
                <Tag appearance="soft" theme="primary" size="tiny">
                    {count} components · v7
                </Tag>
                <h1 id="landing-title" className="landing-title">
                    React components with the details already done.
                </h1>
                <p className="landing-lede">
                    Accessible, themeable and motion-aware, from a single button to a swipeable deck. Every component is documented with live
                    examples, an API reference and its keyboard behavior.
                </p>
                <div className="landing-actions">
                    <Button as={Link} href="/docs/get-started" theme="primary" size="big">
                        Get started
                        <ArrowRightIcon size={16} aria-hidden="true" />
                    </Button>
                    <Button as={Link} href="/docs" theme="neutral" size="big">
                        Browse components
                    </Button>
                </div>
                <div className="landing-install">
                    <Tabs active={manager} onChange={setManager} aria-label="Package manager" container="landing-install-tabs">
                        {installs.map((install) => (
                            <Tab key={install.id} id={install.id} title={install.id}>
                                <CodeBlock code={install.command} lang="bash" />
                            </Tab>
                        ))}
                    </Tabs>
                </div>
            </section>

            <section className="landing-section" aria-labelledby="landing-showcase-title">
                <h2 id="landing-showcase-title" className="landing-section-title">
                    Built with the library, running live
                </h2>
                <p className="landing-section-lede">Everything below is the real components. Press, drag and type.</p>
                <Showcase />
            </section>

            <section className="landing-section" aria-labelledby="landing-foundations-title">
                <h2 id="landing-foundations-title" className="landing-section-title">
                    Foundations
                </h2>
                <dl className="landing-foundations">
                    {foundations.map(([title, text]) => (
                        <div key={title}>
                            <dt>{title}</dt>
                            <dd>{text}</dd>
                        </div>
                    ))}
                </dl>
            </section>
            <Footer />
        </div>
    );
}
