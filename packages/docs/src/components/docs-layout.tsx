"use client";

import { ArrowLeftIcon, ArrowRightIcon, CaretDownIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Button, type Label } from "@g4rcez/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PropsWithChildren, type ReactNode, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { referenceSlugs } from "@/generated/reference";
import { sections } from "../config/navigation";
import { FallbackSections, ReferenceSections } from "./reference/page-sections";
import { useReference } from "./reference/use-reference";

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

/** Old links used ?tab=usage|accessibility. The page is one scroll now, so those land on the section instead. */
const legacyTabTarget: Record<string, string> = { usage: "usage-guidance", accessibility: "accessibility-notes" };

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
                    title={item.text}
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

/** The import statement and a link to the markdown the reference below is generated from. */
const ImportLine = ({ slug }: { slug: string }) => {
    const reference = useReference(slug);
    const [copied, setCopied] = useState(false);
    if (!reference?.import) return null;
    const statement = reference.import.replace(/^import\s+/, "import ");

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(statement);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className="docs-page-import-row">
            <span className="docs-page-import">
                <span className="docs-meta-label">Import</span>
                <code>{statement}</code>
                <Button
                    type="button"
                    size="icon"
                    theme="ghost-neutral"
                    className="docs-icon-button"
                    aria-label={copied ? "Copied import statement" : "Copy import statement"}
                    onClick={copy}
                >
                    {copied ? <CheckIcon size={14} aria-hidden="true" /> : <CopyIcon size={14} aria-hidden="true" />}
                </Button>
            </span>
            <a className="docs-page-source" href={reference.source} target="_blank" rel="noreferrer">
                Reference source
                <ArrowRightIcon size={12} aria-hidden="true" />
            </a>
        </div>
    );
};

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
    const [version, setVersion] = useState(0);
    const title = String(props.title);
    const sectionLabel = sectionLabels[props.section.toLocaleLowerCase()] ?? props.section;
    const slug = pathname.replace(/^\/docs\/?/, "");
    const hasReference = referenceSlugs.includes(slug);

    // The generated sections arrive after first paint, so the outline is rebuilt when they do.
    const sectionsReady = useCallback(() => setVersion((value) => value + 1), []);

    useEffect(() => {
        const url = new URL(window.location.href);
        const tab = url.searchParams.get("tab");
        if (!tab || !(tab in legacyTabTarget)) return;
        url.searchParams.delete("tab");
        url.hash = legacyTabTarget[tab];
        window.history.replaceState(window.history.state, "", url);
        const frame = window.requestAnimationFrame(() => document.getElementById(legacyTabTarget[tab])?.scrollIntoView());
        return () => window.cancelAnimationFrame(frame);
    }, [pathname, version]);

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            const article = articleRef.current;
            if (!article) return;

            const usedIds = new Set<string>();
            const headings = Array.from(article.querySelectorAll<HTMLElement>("h2, h3")).filter(
                (heading) => !heading.closest(".docs-toc") && !heading.closest(".docs-guidance") && !heading.classList.contains("docs-ref-heading")
            );
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
            setActiveId((current) => (items.some((item) => item.id === current) ? current : (items[0]?.id ?? "")));
        });

        return () => window.cancelAnimationFrame(frame);
    }, [pathname, version]);

    useEffect(() => {
        const hash = decodeURIComponent(window.location.hash.slice(1));
        if (!hash) return;
        const frame = window.requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView());
        return () => window.cancelAnimationFrame(frame);
    }, [pathname, version]);

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

    const guidance = { title, useWhen: props.useWhen, avoidWhen: props.avoidWhen, accessibility: props.accessibility };

    return (
        <div className="docs-reading-layout">
            <title>{`${title} — components`}</title>
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
                        {hasReference ? (
                            // The row is always its own line and reserves its height, so the page does not jump when the import arrives.
                            <Suspense fallback={<div className="docs-page-import-row" aria-hidden="true" />}>
                                <ImportLine slug={slug} />
                            </Suspense>
                        ) : null}
                    </div>
                </header>

                <DocsTableOfContents items={tocItems} activeId={activeId} compact />
                {isGuide ? (
                    <div className={`docs-content ${props.className ?? ""}`}>{props.children}</div>
                ) : (
                    <>
                        <section id="examples" className="docs-section docs-examples" aria-labelledby="docs-examples-title">
                            <h2 id="docs-examples-title" className="docs-section-title">
                                Examples
                            </h2>
                            <div className={`docs-content ${props.className ?? ""}`}>{props.children}</div>
                        </section>
                        {hasReference ? (
                            <Suspense fallback={<FallbackSections {...guidance} />}>
                                <ReferenceSections slug={slug} onReady={sectionsReady} {...guidance} />
                            </Suspense>
                        ) : (
                            <FallbackSections {...guidance} />
                        )}
                    </>
                )}

                {relatedItems.length > 0 ? (
                    <section id="related-components" className="docs-section docs-related" aria-labelledby="related-components-title">
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
