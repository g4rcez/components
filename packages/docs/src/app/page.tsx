"use client";
import { HeroDemo } from "@/components/examples/hero-demo";
import { FloatingAction } from "@/components/floating-action";
import { Footer } from "@/components/footer";
import {
  ArrowRightIcon,
  PaletteIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../../lib/src/components/core/button";
import { Tag } from "../../../lib/src/components/core/tag";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/10">
      <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-b from-background to-background">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-radial-hero opacity-20 pointer-events-none" />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="text-center">
            <Tag size="small">
              Library v2.3.0 is out
              <ArrowRightIcon className="size-4" />
            </Tag>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground mb-8">
              Build modern UIs <br className="hidden lg:block" />
              at the speed of{" "}
              <span className="bg-gradient-to-r from-primary via-info to-info bg-clip-text text-transparent">
                thought.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
              An enterprise-grade React component library designed for
              high-performance teams. Accessible, fully customizable, and built
              with pure HSLA precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs/get-started">
                <Button
                  theme="primary"
                  size="big"
                  className="h-14 px-10 text-base font-bold shadow-2xl shadow-primary/40 transition-transform hover:scale-105 active:scale-95"
                >
                  Get Started
                </Button>
              </Link>
              <a
                href="https://github.com/g4rcez/components"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  theme="secondary"
                  size="big"
                  className="h-14 px-10 text-base font-bold transition-all hover:bg-muted"
                >
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
          <div className="mt-32 relative max-w-5xl mx-auto">
            <div className="rounded-2xl border border-primary/10 shadow-2xl overflow-hidden ring-1 ring-border/20">
              <div className="flex items-center px-4 py-3 border-b border-border/40 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-border" />
                  <div className="size-3 rounded-full bg-border" />
                  <div className="size-3 rounded-full bg-border" />
                </div>
              </div>
              <div className="p-12 bg-gradient-to-br from-background to-card-background">
                <HeroDemo />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-32 border-t border-border/40 bg-background/50 backdrop-blur-sm relative">
        <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <ZapIcon className="size-6 text-primary" />,
                title: "Optimized Performance",
                description:
                  "Zero unnecessary dependencies. Tree-shakeable by default for minimal bundle impact.",
              },
              {
                icon: <ShieldCheckIcon className="size-6 text-primary" />,
                title: "WCAG Compliant",
                description:
                  "Strictly adheres to accessibility standards with proper ARIA and keyboard support.",
              },
              {
                icon: <PaletteIcon className="size-6 text-primary" />,
                title: "Atomic Customization",
                description:
                  "Every component is built with design tokens, enabling deep customization via CSS variables.",
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-start gap-5">
                <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-32 text-center relative overflow-hidden border-t border-border/40">
        <div className="absolute inset-0 bg-radial-hero opacity-10" />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-8">
            Ready to transform your UI?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 font-medium">
            Start building with the library that puts developer experience
            first.
          </p>
          <Link href="/docs/get-started">
            <Button
              theme="primary"
              size="big"
              className="h-14 px-12 text-base font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
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
