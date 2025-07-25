"use client";
import { PropsWithChildren } from "react";
import { type Label } from "../../../lib/src";

type Props = {
  title: Label;
  section: string;
  description: Label;
  className?: string;
};

export const DocsLayout = (props: PropsWithChildren<Props>) => {
  return (
    <div className="min-h-full">
      <div className="max-w-[var(--content-max-width)] mx-auto px-6 lg:px-10 py-8">
        <header className="mb-8 pb-6 border-b border-card-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
              {props.section}
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {props.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {props.description}
          </p>
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
