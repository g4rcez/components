"use client";

import { GithubIcon } from "@/components/icons/github";
import { ToggleMode } from "@/components/toggle-mode";
import { ListIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal } from "@g4rcez/components";
import { Navigation } from "./navigation";

export const Header = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                document.getElementById("docs-navigation-search")?.focus();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const focusDocumentationSearch = () => {
        if (window.matchMedia("(max-width: 959px)").matches) {
            setOpen(true);
            window.setTimeout(() => document.getElementById("docs-mobile-navigation-search")?.focus(), 0);
            return;
        }

        document.getElementById("docs-navigation-search")?.focus();
    };

    return (
        <header className="docs-header">
            <div className="docs-header-inner">
                <div className="docs-header-leading">
                    <button
                        type="button"
                        className="docs-icon-button docs-menu-button"
                        aria-label="Open documentation navigation"
                        aria-controls="mobile-docs-navigation"
                        aria-expanded={open}
                        onClick={() => setOpen(true)}
                    >
                        <ListIcon size={21} aria-hidden="true" />
                    </button>
                    <Link href="/" className="docs-brand" aria-label="Components home">
                        <span className="docs-brand-mark" aria-hidden="true">
                            C
                        </span>
                        <span className="docs-brand-name">@g4rcez/components</span>
                        <span className="docs-brand-context">Docs</span>
                    </Link>
                    <nav className="docs-header-nav" aria-label="Primary navigation">
                        <Link href="/docs/get-started" aria-current={pathname.startsWith("/docs") ? "page" : undefined}>
                            Documentation
                        </Link>
                        <Link href="/docs/buttons" aria-current={pathname === "/docs/buttons" ? "page" : undefined}>
                            Components
                        </Link>
                    </nav>
                </div>

                <div className="docs-header-actions">
                    <button type="button" className="docs-search-trigger" onClick={focusDocumentationSearch}>
                        <MagnifyingGlassIcon size={16} aria-hidden="true" />
                        <span>Search docs</span>
                        <kbd>⌘K</kbd>
                    </button>
                    <ToggleMode />
                    <Link
                        href="https://github.com/g4rcez/components"
                        target="_blank"
                        rel="noreferrer"
                        className="docs-icon-button"
                        aria-label="View components on GitHub"
                    >
                        <GithubIcon className="docs-github-icon" aria-hidden="true" />
                    </Link>
                    <span className="docs-version" aria-label="Package version 2.3.0">
                        v2.3.0
                    </span>
                </div>
            </div>

            <Modal closable open={open} title="Documentation navigation" overlayClickClose onChange={setOpen} className="docs-mobile-modal">
                <div id="mobile-docs-navigation" className="docs-mobile-navigation">
                    <Navigation onNavigateAction={() => setOpen(false)} searchId="docs-mobile-navigation-search" sectionIdPrefix="mobile-docs-nav" />
                </div>
            </Modal>
        </header>
    );
};
