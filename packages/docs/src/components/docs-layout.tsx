"use client";
import { PropsWithChildren, useEffect, useState } from "react";
import { Tag, type Label } from "../../../lib/src";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
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
    const next = currentIndex !== -1 && currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            const headings = Array.from(document.querySelectorAll("h3[id]"));
            setTocItems(
                headings.map((h) => ({
                    id: h.id,
                    text: h.textContent ?? "",
                }))
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
            { threshold: 0.6 }
        );

        headings.forEach((h) => observer.observe(h));
        return () => observer.disconnect();
    }, [tocItems]);

    return (
        <div className="relative flex flex-col gap-16 lg:flex-row">
            <div className="min-w-0 flex-1">
                <header>
                    <div className="mb-4 flex items-center gap-2">
                        <Tag size="small">{props.section}</Tag>
                    </div>
                    <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">{props.title}</h1>
                    <p className="max-w-3xl font-medium leading-relaxed text-muted-foreground">{props.description}</p>
                </header>
                <div className="mb-12 mt-8 h-px bg-gradient-to-r from-primary to-transparent" />
                <div className="prose prose-zinc dark:prose-invert prose-headings:scroll-mt-24 prose-pre:bg-zinc-950 prose-pre:border-none prose-a:no-underline prose-headings:font-extrabold max-w-none">
                    {props.children}
                </div>

                {(prev || next) && (
                    <div className="mt-16 flex items-center justify-between gap-4 border-t border-border/40 pt-8">
                        {prev ? (
                            <Link
                                href={prev.href}
                                className="group flex max-w-[240px] flex-1 flex-col gap-2 rounded-xl border border-border/40 p-4 transition-colors hover:border-primary/40"
                            >
                                <span className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
                                    <ArrowLeftIcon className="size-3" />
                                    Previous
                                </span>
                                <span className="font-bold text-foreground transition-colors group-hover:text-primary">{prev.title}</span>
                            </Link>
                        ) : (
                            <div className="flex-1" />
                        )}
                        {next ? (
                            <Link
                                href={next.href}
                                className="group flex max-w-[240px] flex-1 flex-col items-end gap-2 rounded-xl border border-border/40 p-4 text-right transition-colors hover:border-primary/40"
                            >
                                <span className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
                                    Next
                                    <ArrowRightIcon className="size-3" />
                                </span>
                                <span className="font-bold text-foreground transition-colors group-hover:text-primary">{next.title}</span>
                            </Link>
                        ) : (
                            <div className="flex-1" />
                        )}
                    </div>
                )}

                <footer className="mt-16 border-t border-border/40 pt-8">
                    <div className="flex flex-col items-center justify-between gap-6 py-8 text-xs sm:flex-row">
                        <a className="font-medium text-muted-foreground" href="https://github.com/g4rcez">
                            Refined by g4rcez
                        </a>
                        <a
                            href="https://github.com/g4rcez/components"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-1.5 font-bold text-foreground transition-colors hover:text-primary"
                        >
                            Edit this page on GitHub
                            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </footer>
            </div>

            {tocItems.length > 0 && (
                <aside className="sticky top-[calc(var(--header-height)+40px)] hidden h-fit w-64 shrink-0 self-start xl:block">
                    <div className="space-y-6">
                        <h5 className="text-sm font-medium tracking-wide text-foreground opacity-40">On this page</h5>
                        <nav className="flex flex-col gap-3 border-l border-border/40 pl-4">
                            {tocItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="flex items-center gap-2 text-[13px] no-underline transition-colors"
                                >
                                    <div
                                        className={`h-3 w-0.5 rounded ${
                                            item.id === activeId ? "bg-gradient-to-b from-blue-500 to-sky-400" : "bg-transparent"
                                        }`}
                                    />
                                    <span
                                        className={item.id === activeId ? "font-medium text-blue-400" : "text-muted-foreground hover:text-foreground"}
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
