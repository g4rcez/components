"use client";
import { Brand } from "@/components/brand";
import { ToggleMode } from "@/components/toggle-mode";
import { type Label } from "@g4rcez/components";
import Link from "next/link";
import { Fragment, PropsWithChildren, useRef } from "react";

type Props = {
  title: Label;
  section: string;
  description: Label;
};

const sections = [
  {
    title: "Floating",
    items: [
      {
        title: "<Dialog />",
        href: "/docs/modal",
      },
      {
        title: "<Drawer />",
        href: "/docs/modal",
      },
    ],
  },
  {
    title: "Form",
    items: [
      {
        title: "<Input />",
        href: "/docs/input",
      },
      {
        title: "useForm",
        href: "/docs/form",
      },
    ],
  },
];

export const DocsLayout = (props: PropsWithChildren<Props>) => {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <Fragment>
      <nav className="[grid-area:header] z-10 mb-6 sticky top-0 h-10 flex items-center bg-neutral-900 text-white">
        <div className="container items-center mx-auto flex justify-between">
          <Brand />
          <ToggleMode />
        </div>
      </nav>
      <div className="container mx-auto w-full">
        <div className="grid docs-container">
          <nav className="[grid-area:sidebar] min-w-48 md:block hidden self-start sticky top-20">
            <ul className="space-y-6">
              {sections.map((section) => (
                <Fragment key={section.title}>
                  <li className="space-y-1 group">
                    <span className="flex items-center gap-1 group-hover:text-primary">
                      <span className="text-lg font-medium">
                        {section.title}
                      </span>
                    </span>
                    <ul className="group-hover:text-primary space-y-1 border-l-2 border-card-border pl-4">
                      {section.items.map((item) => (
                        <li key={`${section.title}-${item.title}`}>
                          <Link
                            href={item.href}
                            className="hover:underline hover:text-primary-hover"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </Fragment>
              ))}
            </ul>
          </nav>
          <main className="[grid-area:main] px-4">
            <header>
              <h1 className="font-extrabold text-5xl leading-none container mx-auto text-balance">
                {props.title}
              </h1>
              <p className="leading-tight mt-2 text-secondary/70 text-balance">
                {props.description}
              </p>
            </header>
            <div ref={ref} className="min-w-full mt-10">
              {props.children}
            </div>
          </main>
          <aside className="[grid-area:index] px-4 min-w-48 md:block hidden self-start sticky top-20">
            Table of content
          </aside>
          <footer className="hidden [grid-area:footer] px-4">footer</footer>
        </div>
      </div>
    </Fragment>
  );
};
