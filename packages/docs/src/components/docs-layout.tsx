"use client";
import { Brand } from "@/components/brand";
import { ToggleMode } from "@/components/toggle-mode";
import Link from "next/link";
import { Fragment, PropsWithChildren, useRef } from "react";
import { css, type Label } from "../../../lib/src";

type Props = {
  title: Label;
  section: string;
  description: Label;
  className?: string;
};

const sections = [
  {
    title: "Display",
    items: [
      { title: "Button", href: "/docs/buttons" },
      { title: "Table", href: "/docs/table" },
      { title: "Tabs", href: "/docs/tabs" },
      { title: "Tag", href: "/docs/tags" },
      { title: "Timeline", href: "/docs/timeline" },
    ],
  },
  {
    title: "Floating",
    items: [
      { title: "Drawer/Dialog", href: "/docs/modal" },
      { title: "Expand", href: "/docs/expand" },
      { title: "Menu", href: "/docs/menu" },
      { title: "Tooltip", href: "/docs/tooltip" },
    ],
  },
  {
    title: "Form",
    items: [
      { title: "Autocomplete", href: "/docs/autocomplete" },
      { title: "Calendar", href: "/docs/calendar" },
      { title: "Checkbox", href: "/docs/checkbox" },
      { title: "Input", href: "/docs/input" },
      { title: "MultiSelect", href: "/docs/multiselect" },
      { title: "Step", href: "/docs/step" },
      { title: "useForm", href: "/docs/form" },
    ],
  },
  {
    title: "Utilities",
    items: [{ title: "RenderOnView", href: "/docs/render-on-view" }],
  },
];

export const DocsLayout = (props: PropsWithChildren<Props>) => {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div className="flex flex-nowrap flex-col flex-grow-0 flex-shrink">
      <nav className="min-w-full isolate sticky z-navbar mb-6 top-0 h-10 flex items-center bg-neutral-900 text-white">
        <div className="container px-4 items-center mx-auto flex justify-between">
          <Brand />
          <ToggleMode />
        </div>
      </nav>
      <div className="container mx-auto w-full">
        <div className="grid grid-cols-12">
          <nav className="lg:block hidden self-start sticky top-20 col-span-2 w-full">
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
          <main className="col-span-12 lg:col-span-8 px-4">
            <header>
              <h1 className="font-extrabold text-5xl leading-none container mx-auto text-balance">
                {props.title}
              </h1>
              <p className="leading-tight mt-2 text-secondary/70 text-balance">
                {props.description}
              </p>
            </header>
            <div
              ref={ref}
              className={css("min-w-full mt-10 pb-8", props.className)}
            >
              {props.children}
            </div>
          </main>
          <aside className="px-4 w-full md:block hidden self-start sticky top-20 col-span-2">
            Table of content
          </aside>
        </div>
      </div>
    </div>
  );
};
