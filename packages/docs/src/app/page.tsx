import { Brand } from "@/components/brand";
import { Showcase } from "@/components/showcase";
import { ToggleMode } from "@/components/toggle-mode";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

const Grid = () => (
  <svg
    aria-hidden="true"
    className="absolute inset-0 -z-10 bg-black h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
  >
    <defs>
      <pattern
        x="50%"
        y={-1}
        width={200}
        height={200}
        patternUnits="userSpaceOnUse"
        id="grid-ref"
      >
        <path d="M.5 200V.5H200" fill="none" />
      </pattern>
    </defs>
    <svg
      x="50%"
      y={-1}
      className="overflow-visible fill-primary/10 dark:fill-gray-800/20"
    >
      <path
        d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
        strokeWidth={0}
      />
    </svg>
    <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-ref)" />
  </svg>
);

export default function Example() {
  return (
    <Fragment>
      <div className="w-full sticky top-0 dark:bg-black/10 bg-white/10 backdrop-blur-xl">
        <nav className="mx-auto max-w-7xl px-6 lg:flex lg:px-8 py-4 flex justify-between items-center">
          <Brand />
          <ToggleMode />
        </nav>
      </div>
      <Grid />
      <div
        aria-hidden="true"
        className="bg-slate-900/10 bg-blend-overlay absolute container overflow-hidden left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
          className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 flex flex-col lg:flex-row lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <Link href="/docs/changelog" className="inline-flex space-x-6">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6">
                <span>Check the latest version</span>
                <ChevronRightIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-gray-500"
                />
              </span>
            </Link>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-6xl">
            Your next UI library
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/60">
            Battle tested, well designed and awesome DX components using React,
            Tailwind and Framer Motion.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/docs/get-started"
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Get started
            </Link>
            <Link
              href="/docs/intro"
              className="text-sm font-semibold leading-6 text-foreground/70"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <Showcase />
        </div>
      </div>
    </Fragment>
  );
}
