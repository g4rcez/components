"use client";

import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { sections } from "../config/navigation";

type NavigationProps = {
    onNavigateAction?: () => void;
    searchId?: string;
    sectionIdPrefix?: string;
    searchInputRef?: RefObject<HTMLInputElement | null>;
};

export const Navigation = ({
    onNavigateAction,
    searchId = "docs-navigation-search",
    sectionIdPrefix = "docs-nav",
    searchInputRef,
}: NavigationProps) => {
    const path = usePathname();
    const [query, setQuery] = useState("");
    const groupsRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const visibleSections = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase();
        if (!normalizedQuery) return sections;

        return sections
            .map((section) => ({
                ...section,
                items: section.items.filter((item) => `${section.title} ${item.title}`.toLocaleLowerCase().includes(normalizedQuery)),
            }))
            .filter((section) => section.items.length > 0);
    }, [query]);

    useEffect(() => {
        const groups = groupsRef.current;
        if (!groups) return;

        try {
            const savedScrollTop = window.sessionStorage.getItem("docs-navigation-scroll");
            if (savedScrollTop) {
                groups.scrollTop = Number(savedScrollTop);
            }
        } catch {
            // Storage is optional. Navigation still works when it is unavailable.
        }
    }, []);

    const saveScrollPosition = () => {
        const groups = groupsRef.current;
        if (!groups) return;

        try {
            window.sessionStorage.setItem("docs-navigation-scroll", String(groups.scrollTop));
        } catch {
            // Storage is optional. Navigation still works when it is unavailable.
        }
    };

    const clearSearch = () => {
        setQuery("");
        (searchInputRef ?? searchRef).current?.focus();
    };

    return (
        <nav className="docs-nav" aria-label="Documentation navigation">
            <div className="docs-nav-search">
                <label className="sr-only" htmlFor={searchId}>
                    Search documentation
                </label>
                <MagnifyingGlassIcon className="docs-nav-search-icon" size={17} aria-hidden="true" />
                <input
                    ref={searchInputRef ?? searchRef}
                    id={searchId}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search docs"
                    autoComplete="off"
                    spellCheck={false}
                />
                {query ? (
                    <button type="button" className="docs-nav-clear" aria-label="Clear documentation search" onClick={clearSearch}>
                        <XIcon size={15} aria-hidden="true" />
                    </button>
                ) : (
                    <kbd className="docs-nav-shortcut">/</kbd>
                )}
            </div>

            <div ref={groupsRef} className="docs-nav-groups" onScroll={saveScrollPosition}>
                {visibleSections.length > 0 ? (
                    visibleSections.map((section) => {
                        const sectionId = `${sectionIdPrefix}-${section.title.toLocaleLowerCase().replace(/\s+/g, "-")}`;

                        return (
                            <section key={section.title} className="docs-nav-section" aria-labelledby={sectionId}>
                                <h2 id={sectionId} className="docs-nav-section-title">
                                    {section.title}
                                </h2>
                                <ul className="docs-nav-list">
                                    {section.items.map((item) => {
                                        const isActive = path === item.href || (item.href !== "/docs" && path.startsWith(`${item.href}/`));
                                        const Icon = item.icon;

                                        return (
                                            <li key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    aria-current={isActive ? "page" : undefined}
                                                    className={`docs-nav-link${isActive ? " docs-nav-link-active" : ""}`}
                                                    onClick={onNavigateAction}
                                                >
                                                    {Icon ? (
                                                        <span className="docs-nav-link-icon" aria-hidden="true">
                                                            <Icon className="docs-nav-link-icon-glyph" />
                                                        </span>
                                                    ) : null}
                                                    <span>{item.title}</span>
                                                    {item.badge ? <span className="docs-nav-link-badge">{item.badge}</span> : null}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        );
                    })
                ) : (
                    <p className="docs-nav-empty" role="status">
                        No documentation matches “{query}”.
                    </p>
                )}
            </div>
        </nav>
    );
};
