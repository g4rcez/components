"use client";
import { PropsWithChildren } from "react";
import { type Label, Tag } from "../../../lib/src";

type Props = {
  title: Label;
  section: string;
  description: Label;
  className?: string;
};

export const DocsLayout = (props: PropsWithChildren<Props>) => {
  return (
    <div className="gap-8 w-full min-h-full">
      <div className="flex flex-col gap-6 py-8 px-6 mx-auto lg:px-10 max-w-[var(--content-max-width)]">
        <header className="flex flex-col gap-2 pb-4 border-b border-card-border">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/80">
            {props.title}
          </h1>
          <p className="leading-relaxed">{props.description}</p>
          <Tag className="w-fit" size="small">
            {props.section}
          </Tag>
        </header>
        <div className="space-y-12">{props.children}</div>
        <footer className="pt-8 mt-16 border-t border-card-border/30">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>Found an issue? Help us improve this page.</p>
            <a
              href="https://github.com/g4rcez/components"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors text-primary hover:text-primary/80"
            >
              Edit on GitHub →
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};
