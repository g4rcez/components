"use client";
import { GithubIcon } from "@/components/icons/github";
import { ToggleMode } from "@/components/toggle-mode";
import { Button, Modal, Tag } from "@g4rcez/components";
import { ListIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "./brand/logo";
import { Navigation } from "./navigation";
import { DocsSearch } from "./search/docs-search";

/** Other parts of the site (the landing page showcase) ask the header to open the search through this event. */
export const OPEN_SEARCH_EVENT = "docs:open-search";

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const drawerFocusRef = useRef<HTMLButtonElement>(null);
    const pathname = usePathname();
    const isGuide = ["/docs", "/docs/get-started", "/docs/setup"].includes(pathname);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target;
            const isTyping = target instanceof HTMLElement && (target.isContentEditable || target.matches("input, textarea, select"));
            if (event.key === "/" && !isTyping && !event.altKey && !event.metaKey && !event.ctrlKey) {
                event.preventDefault();
                setMenuOpen(false);
                setSearchOpen(true);
            }
        };
        const onRequest = () => setSearchOpen(true);
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener(OPEN_SEARCH_EVENT, onRequest);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener(OPEN_SEARCH_EVENT, onRequest);
        };
    }, []);

    return (
        <header className="docs-header">
            <div className="docs-header-inner">
                <div className="docs-header-leading">
                    <Button
                        type="button"
                        size="icon"
                        theme="ghost-neutral"
                        className="docs-icon-button docs-menu-button"
                        aria-label="Open documentation navigation"
                        aria-controls="mobile-docs-navigation"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(true)}
                    >
                        <ListIcon size={21} aria-hidden="true" />
                    </Button>
                    <Link href="/" className="docs-brand" aria-label="Components home">
                        <Wordmark />
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
                    <Button
                        type="button"
                        size="small"
                        theme="ghost-neutral"
                        className="docs-search-trigger"
                        aria-label="Search documentation"
                        onClick={() => setSearchOpen(true)}
                    >
                        <MagnifyingGlassIcon size={17} aria-hidden="true" />
                        <span>Search documentation...</span>
                        <kbd aria-hidden="true">⌘ K</kbd>
                    </Button>
                    <Tag appearance="soft" theme="neutral" size="tiny" className="docs-version">
                        v7
                    </Tag>
                    <Button
                        as="a"
                        href="https://github.com/g4rcez/components"
                        target="_blank"
                        rel="noreferrer"
                        size="icon"
                        theme="ghost-neutral"
                        className="docs-icon-button docs-header-github"
                        aria-label="View components on GitHub"
                    >
                        <GithubIcon className="docs-github-icon" aria-hidden="true" />
                    </Button>
                    <ToggleMode />
                </div>
            </div>
            <DocsSearch open={searchOpen} onChange={setSearchOpen} />
            <Modal
                closable
                open={menuOpen}
                title="Documentation"
                type="drawer"
                position="left"
                forceType
                resizer={false}
                initialFocus={drawerFocusRef}
                overlayClickClose
                onChange={setMenuOpen}
                className="docs-mobile-modal"
                bodyClassName="docs-mobile-modal-body"
            >
                <Button
                    ref={drawerFocusRef}
                    type="button"
                    size="small"
                    theme="neutral"
                    className="docs-mobile-search"
                    onClick={() => {
                        setMenuOpen(false);
                        setSearchOpen(true);
                    }}
                >
                    <MagnifyingGlassIcon size={17} aria-hidden="true" />
                    Search documentation
                </Button>
                <div id="mobile-docs-navigation" className="docs-mobile-navigation">
                    <Navigation onNavigateAction={() => setMenuOpen(false)} sectionIdPrefix="mobile-docs-nav" />
                </div>
            </Modal>
        </header>
    );
};
