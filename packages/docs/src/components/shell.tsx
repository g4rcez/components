"use client";
import { ComponentsProvider, type Tweaks } from "@g4rcez/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Header } from "./header";
import { Navigation } from "./navigation";

const tweaks: Tweaks = {
    input: { iconFeedback: true },
    table: { filters: false, sorters: false, operations: false, sticky: 56 },
};

export const Shell = (props: PropsWithChildren) => {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    return (
        <>
            <Link href="#main-content" className="docs-skip-link">
                Skip to main content
            </Link>
            <div id="root" className="docs-shell">
                <div id="root-floating" />
                <ComponentsProvider tweaks={tweaks} iconWeight="duotone">
                    <Header />
                    {isLandingPage ? (
                        <main id="main-content" tabIndex={-1} className="flex-1">
                            {props.children}
                        </main>
                    ) : (
                        <div className="docs-workspace">
                            <aside aria-label="Documentation navigation" className="docs-sidebar">
                                <Navigation />
                            </aside>
                            <main id="main-content" tabIndex={-1} className="docs-main">
                                <div className="docs-main-inner">{props.children}</div>
                            </main>
                        </div>
                    )}
                </ComponentsProvider>
            </div>
        </>
    );
};
