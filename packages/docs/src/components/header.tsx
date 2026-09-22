"use client";
import { GithubIcon } from "@/components/icons/github";
import { ToggleMode } from "@/components/toggle-mode";
import { Modal } from "@g4rcez/components";
import { ListIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navigation } from "./navigation";

export const Header = () => {
    const [open, setOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const isGuide = ["/docs", "/docs/get-started", "/docs/setup"].includes(pathname);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const focusDocumentationSearch = useCallback(() => {
        const search = document.getElementById("docs-navigation-search");
        if (search && window.matchMedia("(min-width: 960px)").matches) {
            search.focus();
        } else {
            setOpen(true);
        }
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target;
            const isTyping = target instanceof HTMLElement && (target.isContentEditable || target.matches("input, textarea, select"));
            const commandSearch = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
            const slashSearch = event.key === "/" && !isTyping && !event.altKey && !event.metaKey && !event.ctrlKey;
            if (!commandSearch && !slashSearch) return;
            event.preventDefault();
            if (open) searchInputRef.current?.focus();
            else focusDocumentationSearch();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [focusDocumentationSearch, open]);

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
                        <span className="docs-brand-name">components</span>
                    </Link>
                    <nav className="docs-header-nav" aria-label="Primary navigation">
                        <Link href="/docs" aria-current={isGuide ? "page" : undefined}>
                            Docs
                        </Link>
                        <Link href="/docs/buttons" aria-current={pathname.startsWith("/docs/") && !isGuide ? "page" : undefined}>
                            Components
                        </Link>
                    </nav>
                </div>
                <div className="docs-header-actions">
                    <button type="button" className="docs-search-trigger" aria-label="Search documentation" onClick={focusDocumentationSearch}>
                        <MagnifyingGlassIcon size={17} aria-hidden="true" />
                        <span>Search documentation...</span>
                        <kbd aria-hidden="true">⌘ K</kbd>
                    </button>
                    <a
                        href="https://github.com/g4rcez/components"
                        target="_blank"
                        rel="noreferrer"
                        className="docs-icon-button docs-header-github"
                        aria-label="View components on GitHub"
                    >
                        <GithubIcon className="docs-github-icon" aria-hidden="true" />
                    </a>
                    <ToggleMode />
                </div>
            </div>
            <Modal
                closable
                open={open}
                title="Documentation"
                type="drawer"
                position="left"
                forceType
                resizer={false}
                initialFocus={searchInputRef}
                overlayClickClose
                onChange={setOpen}
                className="docs-mobile-modal"
                bodyClassName="docs-mobile-modal-body"
            >
                <div id="mobile-docs-navigation" className="docs-mobile-navigation">
                    <Navigation
                        onNavigateAction={() => setOpen(false)}
                        searchId="docs-mobile-navigation-search"
                        sectionIdPrefix="mobile-docs-nav"
                        searchInputRef={searchInputRef}
                    />
                </div>
            </Modal>
        </header>
    );
};
