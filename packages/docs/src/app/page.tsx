"use client";
import { FeatureShowcase } from "@/components/examples/feature-showcase";
import { HeroDemo } from "@/components/examples/hero-demo";
import { FloatingAction } from "@/components/floating-action";
import { Footer } from "@/components/footer";
import {
  ArrowRightIcon,
  CheckIcon,
  CodeIcon,
  PaletteIcon,
  RocketIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Button } from "../../../lib/src/components/core/button";
import { Card } from "../../../lib/src/components/display/card";
import { Tab, Tabs } from "../../../lib/src/components/display/tabs";
import { Modal } from "../../../lib/src/components/floating/modal";

const CODE = `import { Button, Card, Input } from "@g4rcez/components";

export default function App() {
  return (
    <Card title="Welcome">
      <div className="space-y-4">
        <Input placeholder="Enter your email" />
        <Button theme="primary" size="big">
          Get Started
        </Button>
      </div>
    </Card>
  );
}`;

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("components");

  const features = [
    {
      icon: <ZapIcon className="w-6 h-6" />,
      title: "Lightning Fast",
      description:
        "Built with performance in mind. Tree-shakeable components with minimal bundle impact.",
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "Accessible by Default",
      description:
        "WCAG compliant components with proper ARIA attributes and keyboard navigation.",
    },
    {
      icon: <PaletteIcon className="w-6 h-6" />,
      title: "Fully Customizable",
      description:
        "Comprehensive theming system with CSS variables and Tailwind CSS integration.",
    },
    {
      icon: <CodeIcon className="w-6 h-6" />,
      title: "TypeScript First",
      description:
        "Complete type safety with excellent IntelliSense support and polymorphic components.",
    },
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: "Modern Stack",
      description:
        "React 18+, Tailwind CSS v4, Framer Motion, and the latest web standards.",
    },
    {
      icon: <RocketIcon className="w-6 h-6" />,
      title: "Production Ready",
      description:
        "Battle-tested components used in production applications with comprehensive testing.",
    },
  ];

  return (
    <Fragment>
      <section className="overflow-hidden relative">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 opacity-40">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 sm:pt-24 lg:px-8">
          <div className="text-center">
            <div className="inline-flex gap-2 items-center py-2 px-4 mb-8 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:text-blue-300 dark:bg-blue-900/30">
              <SparklesIcon className="w-4 h-4" />
              With AI support in docs.
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Build faster with{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-primary">
                beautiful components
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-foreground/80">
              A comprehensive React component library built with TypeScript,
              Tailwind CSS, and modern web technologies. Create stunning user
              interfaces with accessible, customizable, and performant
              components.
            </p>
            <div className="flex flex-col gap-4 justify-center items-center mb-16 sm:flex-row">
              <Link href="/docs/get-started">
                <Button
                  size="big"
                  theme="primary"
                  className="py-4 px-8 text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl group"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button
                size="big"
                theme="neutral"
                onClick={() => setModalOpen(true)}
                className="py-4 px-8 text-lg font-semibold"
              >
                View Components
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Everything you need to build modern UIs
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              From simple buttons to complex data tables, we've got you covered
              with a comprehensive set of components.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="transition-shadow duration-200 hover:shadow-lg"
                title={
                  <Fragment>
                    <div className="flex gap-4 items-center">
                      <div className="p-2 rounded-lg text-primary-foreground bg-primary">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                    </div>
                  </Fragment>
                }
              >
                <p className="text-pretty">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              See it in action
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              Interact with our components and see how they work in real
              applications.
            </p>
          </div>
          <div className="mx-auto max-w-6xl">
            <Tabs active={activeTab} onChange={setActiveTab}>
              <Tab id="components" title="Components">
                <div className="mt-8">
                  <HeroDemo />
                </div>
              </Tab>
              <Tab id="theming" title="Theming">
                <div className="mt-8">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                      <h4 className="mb-4 font-semibold">Solid theme</h4>
                      <div className="flex gap-4">
                        <Button theme="primary">Primary Button</Button>
                        <Button theme="secondary">Secondary Button</Button>
                        <Button theme="success">Success Button</Button>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-4 font-semibold">Ghost theme</h4>
                      <div className="flex gap-4">
                        <Button theme="ghost-primary">Ghost Primary</Button>
                        <Button theme="ghost-danger">Ghost Danger</Button>
                        <Button theme="neutral">Neutral</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab id="layouts" title="Real Examples">
                <div className="mt-8">
                  <FeatureShowcase />
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Simple to use, powerful to customize
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Get started in minutes with our intuitive API and comprehensive
              documentation.
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <Card className="overflow-hidden p-8 text-white bg-gray-900">
              <pre className="overflow-x-auto text-sm">
                <code className="text-gray-300">{CODE}</code>
              </pre>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-20 bg-linear-to-r from-slate-600 to-slate-800">
        <div className="px-4 mx-auto max-w-4xl text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ready to build something amazing?
          </h2>
          <p className="mb-8 text-xl">
            Join with developers who are already building with our components.
          </p>
          <div className="flex flex-col gap-4 justify-center sm:flex-row">
            <Link href="/docs/get-started">
              <Button
                size="big"
                theme="secondary"
                className="font-semibold shadow-lg"
              >
                Start Building
              </Button>
            </Link>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/g4rcez/components"
            >
              <Button size="big" theme="primary" className="font-semibold">
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>
      <Modal
        open={modalOpen}
        onChange={setModalOpen}
        title="Component Showcase"
        type="dialog"
        className="max-w-4xl"
      >
        <div className="space-y-6">
          <p>
            Explore our comprehensive collection of components designed for
            modern web applications.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-3 font-semibold">Core Components</h4>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2 items-center">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>Button with multiple variants</span>
                </div>
                <div className="flex gap-2 items-center">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>Polymorphic components</span>
                </div>
                <div className="flex gap-2 items-center">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>Tags and labels</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-semibold">Form Components</h4>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2 items-center">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>Input with masking support</span>
                </div>
                <div className="flex gap-2 items-center">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>Select and Autocomplete</span>
                </div>
                <div className="flex gap-2 items-center">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>Checkbox and Switch</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t">
            <Link href="/docs">
              <Button theme="primary" className="w-full">
                Explore All Components
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
      <Footer />
      <FloatingAction />
    </Fragment>
  );
}
