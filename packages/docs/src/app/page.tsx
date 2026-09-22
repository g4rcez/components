"use client";

import { CodeBlock } from "@/components/code-block";
import { HeroDemo } from "@/components/examples/hero-demo";
import { FloatingAction } from "@/components/floating-action";
import { Footer } from "@/components/footer";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react";
import Link from "next/link";
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
];

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
    return (
        <div className="landing-page">
            <div className="landing-frame">
                <section className="landing-hero" aria-labelledby="landing-title">
                    <div className="landing-hero-copy">
                        <h1 id="landing-title">
                            Build modern UIs.
                            <br />
                            <span>Make them yours.</span>
                        </h1>
                        <p>
                            Accessible React components. Flexible design tokens. Everything you need to build your next interface, without starting
                            from scratch.
                        </p>
                        <div className="landing-actions">
                            <Link href="/docs/get-started" className="site-button site-button-primary">
                                Get started <ArrowRightIcon size={17} aria-hidden="true" />
                            </Link>
                            <Link href="/docs" className="site-button site-button-secondary">
                                Explore the components
                            </Link>
                        </div>
                    </div>
                    <div className="landing-install">
                        <span className="landing-package">@g4rcez/components</span>
                        <p>Your next interface starts here.</p>
                        <CodeBlock code="pnpm add @g4rcez/components" lang="bash" />
                        <a href="https://github.com/g4rcez/components" target="_blank" rel="noreferrer" className="site-text-link">
                            Open source. Built with React. <ArrowRightIcon size={15} aria-hidden="true" />
                        </a>
                    </div>
                </section>

                <section className="landing-playground" aria-labelledby="playground-title">
                    <div className="landing-section-bar">
                        <h2 id="playground-title">Real components. Ready to compose.</h2>
                        <Link href="/docs/buttons" className="site-text-link">
                            Browse the library <ArrowRightIcon size={15} aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="landing-playground-grid">
                        <div className="landing-preview">
                            <div className="landing-panel-label">
                                <span>Interactive preview</span>
                                <span className="landing-live">
                                    <span aria-hidden="true" />
                                    Live
                                </span>
                            </div>
                            <HeroDemo />
                            <p className="landing-preview-note">Try the currency input, dropdown, and menu.</p>
                        </div>
                        <div className="landing-source">
                            <div className="landing-panel-label">
                                <span>Start with a few components</span>
                                <span>React + TypeScript</span>
                            </div>
                            <CodeBlock code={previewCode} />
                        </div>
                    </div>
                </section>

                <div className="landing-principles" aria-label="Library foundations">
                    {["TypeScript native", "Keyboard accessible", "CSS variable theming", "Tree-shakeable imports"].map((feature) => (
                        <span key={feature}>
                            <CheckIcon size={16} aria-hidden="true" />
                            {feature}
                        </span>
                    ))}
                </div>

                <section className="landing-catalog" aria-labelledby="catalog-title">
                    <div className="landing-section-intro">
                        <h2 id="catalog-title">
                            The building blocks.
                            <br />
                            Not the constraints.
                        </h2>
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
                    <Link href="/docs/setup" className="site-button site-button-primary">
                        Explore theming <ArrowRightIcon size={17} aria-hidden="true" />
                    </Link>
                </section>
                <Footer />
            </div>
            <FloatingAction />
        </div>
    );
}
