"use client";
import { CodeBlock } from "@/components/code-block";
import { HeroComposition } from "@/components/examples/hero-composition";
import { HeroDemo } from "@/components/examples/hero-demo";
import { Footer } from "@/components/footer";
import { sections } from "@/config/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Button, Tab, Tabs } from "@g4rcez/components";
import Link from "next/link";
import { useState } from "react";
import "./landing.css";

const componentGroups = [
    {
        title: "Form controls",
        description: "Inputs, selects, and validation for the details that matter.",
        href: "/docs/input",
        examples: "Input · Select · Checkbox · DatePicker",
    },
    {
        title: "Display components",
        description: "Give information a clear shape, from a single card to a full table.",
        href: "/docs/cards",
        examples: "Card · Table · Tabs · Timeline",
    },
    {
        title: "Floating elements",
        description: "Keep actions and context close with menus, dialogs, and tooltips.",
        href: "/docs/modal",
        examples: "Modal · Dropdown · Menu · Tooltip",
    },
    {
        title: "Theming",
        description: "Tokens and CSS variables that make the library match your product.",
        href: "/docs/setup",
        examples: "Colors · Radius · Spacing · Dark mode",
    },
];

const foundations = [
    { title: "TypeScript native", text: "Typed props, variants, and tokens from the first import." },
    { title: "Keyboard accessible", text: "Roles, focus, and keyboard interaction built into every control." },
    { title: "CSS variable theming", text: "Colors, radius, and spacing come from tokens you can override." },
    { title: "Tree-shakeable imports", text: "Import only the components you use." },
];

const documentedComponents = sections
    .filter((section) => section.title !== "Getting Started")
    .reduce((total, section) => total + section.items.length, 0);

const previewCode = `import { Input, Dropdown, Menu, MenuItem }
  from "@g4rcez/components";

export function CurrencyTools() {
  return (
    <>
      <Input title="Currency" mask="currency"
        currency="USD" locale="en-US" />
      <Dropdown trigger="Click">
        I'm a dropdown component
      </Dropdown>
      <Menu label="Menu">
        <MenuItem title="Item 1">Item 1</MenuItem>
      </Menu>
    </>
  );
}`;

export default function LandingPage() {
    const [windowTab, setWindowTab] = useState("preview");
    return (
        <div className="landing-page">
            <div className="landing-frame">
                <section className="landing-hero" aria-labelledby="landing-title">
                    <Link href="/docs" className="landing-eyebrow">
                        {documentedComponents} documented components
                        <ArrowRightIcon size={14} aria-hidden="true" />
                    </Link>
                    <h1 id="landing-title">
                        Build modern UIs.
                        <br />
                        <span>Make them yours.</span>
                    </h1>
                    <p>
                        Accessible React components. Flexible design tokens. Everything you need to build your next interface, without starting from
                        scratch.
                    </p>
                    <div className="landing-actions">
                        <Button as={Link} href="/docs/get-started" theme="primary">
                            Get started <ArrowRightIcon size={17} aria-hidden="true" />
                        </Button>
                        <Button as={Link} href="/docs" theme="neutral">
                            Explore the components
                        </Button>
                    </div>
                    <div className="landing-install">
                        <CodeBlock code="pnpm add @g4rcez/components" lang="bash" />
                    </div>
                </section>

                <section className="landing-window" aria-labelledby="window-title">
                    <h2 id="window-title" className="sr-only">
                        Live preview and source
                    </h2>
                    <Tabs
                        active={windowTab}
                        onChange={setWindowTab}
                        aria-label="Preview or source"
                        container="landing-window-tabs"
                        className="landing-window-body"
                    >
                        <Tab id="preview" title="Preview">
                            <div className="landing-stage">
                                <HeroDemo />
                                <div className="landing-stage-side">
                                    <HeroComposition />
                                </div>
                            </div>
                        </Tab>
                        <Tab id="code" title="Code">
                            <CodeBlock code={previewCode} />
                        </Tab>
                    </Tabs>
                </section>

                <section className="landing-foundations" aria-labelledby="foundations-title">
                    <div className="landing-section-bar">
                        <h2 id="foundations-title">Built on solid foundations</h2>
                        <Link href="/docs/setup" className="site-text-link">
                            Theme setup <ArrowRightIcon size={15} aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="landing-foundations-grid">
                        {foundations.map((item) => (
                            <div key={item.title} className="landing-foundation">
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="landing-catalog" aria-labelledby="catalog-title">
                    <div className="landing-section-intro">
                        <h2 id="catalog-title">The building blocks. Not the constraints.</h2>
                        <p>From the first input to the final interaction. Start with familiar components, then shape them to fit your product.</p>
                    </div>
                    <div className="landing-catalog-list">
                        {componentGroups.map((group) => (
                            <Link key={group.href} href={group.href} className="landing-catalog-link">
                                <div>
                                    <h3>{group.title}</h3>
                                    <p>{group.description}</p>
                                    <span>{group.examples}</span>
                                </div>
                                <ArrowRightIcon size={22} aria-hidden="true" />
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="landing-closing" aria-labelledby="closing-title">
                    <div>
                        <h2 id="closing-title">
                            Your design language.
                            <br />
                            <span>Down to the token.</span>
                        </h2>
                        <p>Customize colors, spacing, and component styles with CSS variables. Keep the behavior. Make the design your own.</p>
                    </div>
                    <Button as={Link} href="/docs/setup" theme="primary">
                        Explore theming <ArrowRightIcon size={17} aria-hidden="true" />
                    </Button>
                </section>
                <Footer />
            </div>
        </div>
    );
}
