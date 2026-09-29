"use client";
import { ComponentsProvider, configureTheme, createThemeCss, type Tweaks } from "@g4rcez/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type PropsWithChildren } from "react";
import { docsThemes } from "@/config/theme";
import { Header } from "./header";
import { Navigation } from "./navigation";

const tweaks: Tweaks = {
    input: { iconFeedback: true },
    table: { filters: false, sorters: false, operations: false, sticky: 64 },
};

const themeStyles = docsThemes.map((theme) => ({
    id: `g4rcez-theme-${theme.name}`,
    name: theme.name,
    css: createThemeCss(theme),
}));

export const RootLayout = (props: PropsWithChildren) => {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    useEffect(() => {
        for (const theme of docsThemes) configureTheme(theme);
    }, []);

    return (
        <html lang="en" className="dark scroll-smooth bg-background proportional-nums text-foreground antialiased">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                {themeStyles.map(({ id, name, css }) => (
                    <style
                        key={name}
                        id={id}
                        data-theme-owner="theme-runtime"
                        data-theme-name={name}
                        dangerouslySetInnerHTML={{ __html: css }}
                    />
                ))}
                <title>Components — Modern React UI Library</title>
            </head>
            <body className="docs-body">
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
            </body>
        </html>
    );
};
