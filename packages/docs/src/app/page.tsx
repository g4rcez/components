import { Fragment } from "react";
import { Button } from "../../../lib/src/components/core/button";
import Link from "next/link";
import { ModalExample } from "@/components/examples/modal";
import { AlertExample } from "@/components/examples/alert";

export default function Example() {
  return (
    <Fragment>
      <header className="relative gap-4 py-16 px-10 flex justify-center flex-col">
        <div className="absolute -z-10 inset-0 h-full bg-gradient-to-tr from-background via-background to-primary/10 w-full" />
        <h2 className="text-foreground text-3xl font-bold tracking-wide leading-relaxed">
          Your next UI library
        </h2>
        <p className="text-base text-pretty text-foreground max-w-xl">
          <b>React + Tailwind + Framer Motion = Design System</b>. With battle
          tested, a11y focus and great DX, you can use for many usecases.
        </p>
        <nav className="flex flex-row gap-2">
          <Link href="/docs">
            <Button size="small" theme="muted">
              Intro
            </Button>
          </Link>
          <Link href="/docs/get-started">
            <Button size="small">Get started</Button>
          </Link>
        </nav>
      </header>
      <section className="px-10">
        <h3 className="border-b border-card-border font-semibold text-xl pb-4">
          Components
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-8 gap-8">
          <ModalExample />
          <AlertExample />
        </div>
      </section>
    </Fragment>
  );
}
