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
      <div className="max-w-[var(--content-max-width)] flex flex-col gap-6 mx-auto px-6 lg:px-10 py-8">
        <header className="border-b border-card-border flex flex-col gap-2 pb-4">
          <h1 className="text-3xl font-bold tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {props.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {props.description}
          </p>
          <Tag className="w-fit" size="small">{props.section}</Tag>
        </header>
        <div className="space-y-12">{props.children}</div>
        <footer className="mt-16 pt-8 border-t border-card-border/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Found an issue? Help us improve this page.</p>
            <a
              href="https://github.com/g4rcez/components"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Edit on GitHub →
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};
