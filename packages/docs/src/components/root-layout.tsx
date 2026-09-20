"use client";

import { ComponentsProvider, createTokenStyles, defaultDarkTheme, defaultLightTheme, type TokenRemap, type Tweaks } from "@g4rcez/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Header } from "./header";
import { Navigation } from "./navigation";

const tokenRemap: TokenRemap = {
    colors: (token) => {
        token.value = token.value.replace("hsla(", "").replace(/\)$/, "");
        return token;
    },
};

const tweaks: Tweaks = {
    input: { iconFeedback: true },
    table: { filters: false, sorters: false, operations: false, sticky: 64 },
};

export const RootLayout = (props: PropsWithChildren) => {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";
    const isDocsPage = pathname.startsWith("/docs");

    const stylesLight = createTokenStyles(defaultLightTheme, tokenRemap);
    const stylesDark = createTokenStyles(defaultDarkTheme, { ...tokenRemap, name: "dark" });

    return (
        <html lang="en" className="dark scroll-smooth bg-background proportional-nums text-foreground antialiased">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Components — Modern React UI Library</title>
                <style>{stylesLight}</style>
                <style>{stylesDark}</style>
            </head>
            <body className={isDocsPage ? "docs-body" : "min-h-screen bg-background font-sans text-foreground"}>
                <Link
                    href="#main-content"
                    className="sr-only absolute left-4 top-4 z-navbar rounded-md bg-background px-3 py-2 text-sm font-medium text-foreground ring-2 ring-primary focus:not-sr-only"
                >
                    Skip to main content
                </Link>
                <div id="root" className={isDocsPage ? "docs-shell" : "flex min-h-screen flex-col"}>
                    <div id="root-floating" />
                    <ComponentsProvider tweaks={tweaks} iconWeight="duotone">
                        <Header />
                        {isLandingPage ? (
                            <main id="main-content" className="flex-1">
                                {props.children}
                            </main>
                        ) : (
                            <div className="docs-workspace">
                                <aside aria-label="Documentation navigation" className="docs-sidebar">
                                    <Navigation />
                                </aside>
                                <main id="main-content" className="docs-main">
                                    <div className="docs-main-inner">{props.children}</div>
                                </main>
                            </div>
                        )}
                    </ComponentsProvider>
                </div>
            </body>
        </html>
    );
};
