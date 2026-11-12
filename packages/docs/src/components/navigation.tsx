"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Tag } from "@g4rcez/components";
import { sections } from "../config/navigation";

type NavigationProps = {
    onNavigateAction?: () => void;
    sectionIdPrefix?: string;
};

/** The documentation tree: small group headings and plain links. Finding things is the job of the search (Cmd+K). */
export const Navigation = ({ onNavigateAction, sectionIdPrefix = "docs-nav" }: NavigationProps) => {
    const path = usePathname();
    const groupsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const groups = groupsRef.current;
        if (!groups) return;

        try {
            const savedScrollTop = window.sessionStorage.getItem("docs-navigation-scroll");
            if (savedScrollTop) groups.scrollTop = Number(savedScrollTop);
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

    return (
        <nav className="docs-nav" aria-label="Documentation navigation">
            <div ref={groupsRef} className="docs-nav-groups" onScroll={saveScrollPosition}>
                {sections.map((section) => {
                    const sectionId = `${sectionIdPrefix}-${section.title.toLocaleLowerCase().replace(/\s+/g, "-")}`;

                    return (
                        <section key={section.title} className="docs-nav-section" aria-labelledby={sectionId}>
                            <h2 id={sectionId} className="docs-nav-section-title">
                                {section.title}
                            </h2>
                            <ul className="docs-nav-list">
                                {section.items.map((item) => {
                                    const isActive = path === item.href || (item.href !== "/docs" && path.startsWith(`${item.href}/`));

                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                aria-current={isActive ? "page" : undefined}
                                                className="docs-nav-link"
                                                onClick={onNavigateAction}
                                            >
                                                <span>{item.title}</span>
                                                {item.badge ? (
                                                    <Tag appearance="soft" theme="primary" size="tiny">
                                                        {item.badge}
                                                    </Tag>
                                                ) : null}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    );
                })}
            </div>
        </nav>
    );
};
