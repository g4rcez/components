"use client";
import { HeroDemo } from "@/components/examples/hero-demo";
import { FloatingAction } from "@/components/floating-action";
import { Footer } from "@/components/footer";
import { ArrowRightIcon, PaletteIcon, ShieldCheckIcon, LightningIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "../../../lib/src/components/core/button";
import { Tag } from "../../../lib/src/components/core/tag";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/10">
            <section className="relative overflow-hidden bg-gradient-to-b from-background to-background pb-32 pt-24">
                <div className="bg-radial-hero pointer-events-none absolute left-1/2 top-0 h-[800px] w-full -translate-x-1/2 opacity-20" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Tag size="small">
                            Library v2.3.0 is out
                            <ArrowRightIcon className="size-4" />
                        </Tag>
                        <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
                            Build modern UIs <br className="hidden lg:block" />
                            at the speed of{" "}
                            <span className="bg-gradient-to-r from-primary via-info to-info bg-clip-text text-transparent">thought.</span>
                        </h1>
                        <p className="mx-auto mb-12 max-w-3xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl">
                            An enterprise-grade React component library designed for high-performance teams. Accessible, fully customizable, and built
                            with pure HSLA precision.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href="/docs/get-started">
                                <Button
                                    theme="primary"
                                    size="big"
                                    className="h-14 px-10 text-base font-bold shadow-2xl shadow-primary/40 transition-transform hover:scale-105 active:scale-95"
                                >
                                    Get Started
                                </Button>
                            </Link>
                            <a href="https://github.com/g4rcez/components" target="_blank" rel="noreferrer">
                                <Button theme="secondary" size="big" className="h-14 px-10 text-base font-bold transition-all hover:bg-muted">
                                    View on GitHub
                                </Button>
                            </a>
                        </div>
                    </div>
                    <div className="relative mx-auto mt-32 max-w-5xl">
                        <div className="overflow-hidden rounded-2xl border border-primary/10 shadow-2xl ring-1 ring-border/20">
                            <div className="flex items-center border-b border-border/40 bg-muted/30 px-4 py-3">
                                <div className="flex gap-1.5">
                                    <div className="size-3 rounded-full bg-border" />
                                    <div className="size-3 rounded-full bg-border" />
                                    <div className="size-3 rounded-full bg-border" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-background to-card-background p-12">
                                <HeroDemo />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="relative border-t border-border/40 bg-background/50 py-32 backdrop-blur-sm">
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: <LightningIcon className="size-6 text-primary" />,
                                title: "Optimized Performance",
                                description: "Zero unnecessary dependencies. Tree-shakeable by default for minimal bundle impact.",
                            },
                            {
                                icon: <ShieldCheckIcon className="size-6 text-primary" />,
                                title: "WCAG Compliant",
                                description: "Strictly adheres to accessibility standards with proper ARIA and keyboard support.",
                            },
                            {
                                icon: <PaletteIcon className="size-6 text-primary" />,
                                title: "Atomic Customization",
                                description: "Every component is built with design tokens, enabling deep customization via CSS variables.",
                            },
                        ].map((feature, i) => (
                            <div key={i} className="flex flex-col items-start gap-5">
                                <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3.5">{feature.icon}</div>
                                <h3 className="text-xl font-bold tracking-tight text-foreground">{feature.title}</h3>
                                <p className="font-medium leading-relaxed text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="relative overflow-hidden border-t border-border/40 py-32 text-center">
                <div className="bg-radial-hero absolute inset-0 opacity-10" />
                <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h2 className="mb-8 text-4xl font-extrabold tracking-tight sm:text-6xl">Ready to transform your UI?</h2>
                    <p className="mb-12 text-xl font-medium text-muted-foreground">
                        Start building with the library that puts developer experience first.
                    </p>
                    <Link href="/docs/get-started">
                        <Button
                            theme="primary"
                            size="big"
                            className="h-14 px-12 text-base font-bold shadow-2xl shadow-primary/20 transition-transform hover:scale-105"
                        >
                            Start Building Now
                        </Button>
                    </Link>
                </div>
            </section>
            <Footer />
            <FloatingAction />
        </div>
    );
}
