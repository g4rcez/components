"use client";
import { PropsWithChildren, useEffect, useState } from "react";
import { Tag, type Label } from "../../../lib/src";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { sections } from "../config/navigation";
import Link from "next/link";

type TocItem = { id: string; text: string };

type Props = {
  title: Label;
  section: string;
  description: Label;
  className?: string;
};

export const DocsLayout = (props: PropsWithChildren<Props>) => {
  const pathname = usePathname();
  const allItems = sections.flatMap((s) => s.items);
  const currentIndex = allItems.findIndex((i) => i.href === pathname);
  const prev = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const next =
    currentIndex !== -1 && currentIndex < allItems.length - 1
      ? allItems[currentIndex + 1]
      : null;

  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const headings = Array.from(document.querySelectorAll("h3[id]"));
      setTocItems(
        headings.map((h) => ({
          id: h.id,
          text: h.textContent ?? "",
        })),
      );
    }, 0);
    return () => clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll("h3[id]"));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { threshold: 0.6 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [tocItems]);

  return (
    <div className="flex flex-col lg:flex-row gap-16 relative">
      <div className="flex-1 min-w-0">
        <header>
          <div className="flex items-center gap-2 mb-4">
            <Tag size="small">{props.section}</Tag>
          </div>
          <h1 className="text-4xl lg:text-5xl mb-2 font-extrabold tracking-tight text-foreground">
            {props.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-3xl font-medium">
            {props.description}
          </p>
        </header>
        <div className="h-px bg-gradient-to-r from-primary to-transparent mt-8 mb-12" />
        <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-pre:bg-zinc-950 prose-pre:border-none prose-a:no-underline prose-headings:font-extrabold">
          {props.children}
        </div>

        {(prev || next) && (
          <div className="mt-16 pt-8 border-t border-border/40 flex items-center justify-between gap-4">
            {prev ? (
              <Link
                href={prev.href}
                className="group flex flex-col gap-2 p-4 rounded-xl border border-border/40 hover:border-primary/40 transition-colors max-w-[240px] flex-1"
              >
                <span className="text-[12px] font-medium text-muted-foreground flex items-center gap-2">
                  <ArrowLeftIcon className="size-3" />
                  Previous
                </span>
                <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {next ? (
              <Link
                href={next.href}
                className="group flex flex-col gap-2 p-4 rounded-xl border border-border/40 hover:border-primary/40 transition-colors max-w-[240px] flex-1 text-right items-end"
              >
                <span className="text-[12px] font-medium text-muted-foreground flex items-center gap-2">
                  Next
                  <ArrowRightIcon className="size-3" />
                </span>
                <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 py-8 text-xs">
            <a
              className="text-muted-foreground font-medium"
              href="https://github.com/g4rcez"
            >
              Refined by g4rcez
            </a>
            <a
              href="https://github.com/g4rcez/components"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
            >
              Edit this page on GitHub
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </footer>
      </div>

      {tocItems.length > 0 && (
        <aside className="hidden xl:block w-64 shrink-0 sticky top-[calc(var(--header-height)+40px)] h-fit self-start">
          <div className="space-y-6">
            <h5 className="text-sm font-medium text-foreground tracking-wide opacity-40">
              On this page
            </h5>
            <nav className="flex flex-col gap-3 border-l border-border/40 pl-4">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(item.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-[13px] transition-colors no-underline flex items-center gap-2"
                >
                  <div
                    className={`w-0.5 h-3 rounded ${
                      item.id === activeId
                        ? "bg-gradient-to-b from-blue-500 to-sky-400"
                        : "bg-transparent"
                    }`}
                  />
                  <span
                    className={
                      item.id === activeId
                        ? "text-blue-400 font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  >
                    {item.text}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
};
