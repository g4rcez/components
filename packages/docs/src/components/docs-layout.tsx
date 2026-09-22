"use client";

import { ArrowLeftIcon, ArrowRightIcon, CaretDownIcon, CheckIcon, WarningCircleIcon } from "@phosphor-icons/react";
import type { Label } from "@g4rcez/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PropsWithChildren, type ReactNode, useEffect, useRef, useState } from "react";
import { sections } from "../config/navigation";

type TocItem = {
    id: string;
    text: string;
    level: 2 | 3;
};

type Props = {
    title: Label;
    section: string;
    description: Label;
    className?: string;
    useWhen?: ReactNode;
    avoidWhen?: ReactNode;
    accessibility?: ReactNode;
    packageName?: string;
};

const sectionLabels: Record<string, string> = {
    display: "Display Components",
    floating: "Floating Elements",
    form: "Form Controls",
    primitives: "Primitives",
    start: "Getting Started",
    utilities: "Utilities",
};

const slugify = (value: string) =>
    value
        .toLocaleLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");

const DocsTableOfContents = ({ items, activeId, compact = false }: { items: TocItem[]; activeId: string; compact?: boolean }) => {
    if (items.length === 0) return null;

    const links = (
        <nav className="docs-toc-list" aria-label="Page sections">
            {items.map((item) => (
                <Link
                    key={item.id}
                    href={`#${item.id}`}
                    aria-current={item.id === activeId ? "location" : undefined}
                    className={`docs-toc-link docs-toc-link-level-${item.level}${item.id === activeId ? " docs-toc-link-active" : ""}`}
                >
                    {item.text}
                </Link>
            ))}
        </nav>
    );

    if (compact) {
        return (
            <details className="docs-toc docs-toc-compact">
                <summary>
                    On this page <CaretDownIcon size={15} aria-hidden="true" />
                </summary>
                {links}
            </details>
        );
    }

    return (
        <aside className="docs-toc docs-toc-desktop" aria-label="On this page">
            <h2 className="docs-toc-title">On this page</h2>
            {links}
        </aside>
    );
};

const UsageSummary = ({ title, useWhen, avoidWhen }: { title: string; useWhen?: ReactNode; avoidWhen?: ReactNode }) => (
    <section id="usage-guidance" className="docs-usage" aria-labelledby="usage-guidance-title">
        <h2 id="usage-guidance-title" className="docs-section-title">
            When to use {title}
        </h2>
        <div className="docs-guidance-grid">
            <div className="docs-guidance docs-guidance-use">
                <div className="docs-guidance-heading">
                    <span className="docs-guidance-mark" aria-hidden="true">
                        <CheckIcon size={14} />
                    </span>
                    <h3>Use when</h3>
                </div>
                <p>{useWhen ?? `You need the documented ${title} interaction or presentation in a product workflow.`}</p>
            </div>
            <div className="docs-guidance docs-guidance-avoid">
                <div className="docs-guidance-heading">
                    <span className="docs-guidance-mark" aria-hidden="true">
                        <WarningCircleIcon size={14} />
                    </span>
                    <h3>Avoid when</h3>
                </div>
                <p>{avoidWhen ?? `A native HTML element already provides the ${title} behavior you need.`}</p>
            </div>
        </div>
    </section>
);

const AccessibilityNotes = ({ title, children }: { title: string; children?: ReactNode }) => (
    <section id="accessibility-notes" className="docs-accessibility" aria-labelledby="accessibility-notes-title">
        <h2 id="accessibility-notes-title" className="docs-section-title">
            Accessibility
        </h2>
        <p>
            {children ??
                `Keep the ${title} labeled and use its documented keyboard interaction. The component preserves visible focus and communicates state without relying on color alone.`}
        </p>
        <ul>
            <li>Keep keyboard focus visible and follow the documented key commands.</li>
            <li>Provide an accessible name and connect descriptions or errors to the control.</li>
        </ul>
    </section>
);

export const DocsLayout = (props: PropsWithChildren<Props>) => {
    const pathname = usePathname();
    const articleRef = useRef<HTMLElement>(null);
    const allItems = sections.flatMap((section) => section.items);
    const matchesRoute = (href: string) => pathname === href || (href !== "/docs" && pathname.startsWith(`${href}/`));
    const currentIndex = allItems.findIndex((item) => matchesRoute(item.href));
    const currentSection = sections.find((section) => section.items.some((item) => matchesRoute(item.href)));
    const isGuide = currentSection?.title === "Getting Started";
    const relatedItems = currentSection?.items.filter((item) => item.href !== pathname).slice(0, 3) ?? [];
    const previous = currentIndex > 0 ? allItems[currentIndex - 1] : null;
    const next = currentIndex >= 0 && currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState("");
    const title = String(props.title);
    const sectionLabel = sectionLabels[props.section.toLocaleLowerCase()] ?? props.section;

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            const article = articleRef.current;
            if (!article) return;

            const usedIds = new Set<string>();
            const headings = Array.from(article.querySelectorAll<HTMLElement>("h2, h3")).filter((heading) => !heading.closest(".docs-toc"));
            const items = headings.flatMap((heading) => {
                const text = heading.textContent?.trim() ?? "";
                if (!text) return [];

                let id = heading.id || slugify(text) || "section";
                let suffix = 2;
                while (usedIds.has(id)) {
                    id = `${slugify(text) || "section"}-${suffix}`;
                    suffix += 1;
                }

                heading.id = id;
                usedIds.add(id);
                return [{ id, text, level: heading.tagName === "H2" ? (2 as const) : (3 as const) }];
            });

            setTocItems(items);
            setActiveId(items[0]?.id ?? "");
        });

        return () => window.cancelAnimationFrame(frame);
    }, [pathname]);

    useEffect(() => {
        if (tocItems.length === 0) return;

        const headings = tocItems.map((item) => document.getElementById(item.id)).filter((heading): heading is HTMLElement => heading !== null);
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible) setActiveId(visible.target.id);
            },
            { rootMargin: "-96px 0px -58% 0px", threshold: [0, 1] }
        );

        headings.forEach((heading) => observer.observe(heading));
        return () => observer.disconnect();
    }, [tocItems]);

    return (
        <div className="docs-reading-layout">
            <article ref={articleRef} className="docs-article" aria-labelledby="docs-page-title">
                <header className="docs-page-header">
                    <nav className="docs-breadcrumb" aria-label="Breadcrumb">
                        <Link href="/docs">Docs</Link>
                        <span aria-hidden="true">/</span>
                        <span>{sectionLabel}</span>
                    </nav>
                    <h1 id="docs-page-title" className="docs-page-title">
                        {props.title}
                    </h1>
                    <p className="docs-page-summary">{props.description}</p>
                    <div className="docs-page-meta" aria-label="Page metadata">
                        <span>
                            <span className="docs-meta-label">Package</span>
                            <code>{props.packageName ?? "@g4rcez/components"}</code>
                        </span>
                        <span>
                            <span className="docs-meta-label">Section</span>
                            {sectionLabel}
                        </span>
                    </div>
                </header>

                <DocsTableOfContents items={tocItems} activeId={activeId} compact />
                {isGuide ? (
                    <div className={`docs-content ${props.className ?? ""}`}>{props.children}</div>
                ) : (
                    <>
                        <section className="docs-examples" aria-labelledby="docs-examples-title">
                            <h2 id="docs-examples-title" className="docs-section-title">
                                Examples
                            </h2>
                            <div className={`docs-content ${props.className ?? ""}`}>{props.children}</div>
                        </section>
                        <UsageSummary title={title} useWhen={props.useWhen} avoidWhen={props.avoidWhen} />
                        <AccessibilityNotes title={title}>{props.accessibility}</AccessibilityNotes>
                    </>
                )}

                {relatedItems.length > 0 ? (
                    <section id="related-components" className="docs-related" aria-labelledby="related-components-title">
                        <h2 id="related-components-title" className="docs-section-title">
                            {isGuide ? "Continue reading" : "Related components"}
                        </h2>
                        <div className="docs-related-links">
                            {relatedItems.map((item) => (
                                <Link key={item.href} href={item.href} className="docs-related-link">
                                    <span>{item.title}</span>
                                    <ArrowRightIcon size={14} aria-hidden="true" />
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : null}

                {(previous || next) && (
                    <nav className="docs-pager" aria-label="Documentation pagination">
                        {previous ? (
                            <Link href={previous.href} className="docs-pager-link docs-pager-previous">
                                <span className="docs-pager-label">
                                    <ArrowLeftIcon size={14} aria-hidden="true" />
                                    Previous
                                </span>
                                <strong>{previous.title}</strong>
                            </Link>
                        ) : (
                            <span />
                        )}
                        {next ? (
                            <Link href={next.href} className="docs-pager-link docs-pager-next">
                                <span className="docs-pager-label">
                                    Next
                                    <ArrowRightIcon size={14} aria-hidden="true" />
                                </span>
                                <strong>{next.title}</strong>
                            </Link>
                        ) : (
                            <span />
                        )}
                    </nav>
                )}

                <footer className="docs-article-footer">
                    <span>Documentation for @g4rcez/components</span>
                    <Link href="https://github.com/g4rcez/components" target="_blank" rel="noreferrer">
                        View source on GitHub
                        <ArrowRightIcon size={14} aria-hidden="true" />
                    </Link>
                </footer>
            </article>

            <DocsTableOfContents items={tocItems} activeId={activeId} />
        </div>
    );
};
