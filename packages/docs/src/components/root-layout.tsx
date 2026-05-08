"use client";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { Tweaks } from "../../../lib/src";
import { Notifications } from "../../../lib/src/components/display/notifications";
import { ComponentsProvider } from "../../../lib/src/hooks/use-components-provider";
import { createTokenStyles, type TokenRemap } from "../../../lib/src/styles/design-tokens";
import { defaultDarkTheme, defaultLightTheme } from "../../../lib/src/styles/theme";
import { Header } from "./header";
import { Navigation } from "./navigation";

const tokenRemap: TokenRemap = {
    colors: (t) => {
        t.value = t.value.replace("hsla(", "").replace(/\)$/, "");
        return t;
    },
};

const tweaks: Tweaks = {
    input: { iconFeedback: true },
    table: { filters: false, sorters: false, operations: false, sticky: 55 },
};

export const RootLayout = (props: PropsWithChildren) => {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    const stylesLight = createTokenStyles(defaultLightTheme, tokenRemap);
    const stylesDark = createTokenStyles(defaultDarkTheme, {
        ...tokenRemap,
        name: "dark",
    });

    return (
        <html lang="en" className="dark scroll-smooth bg-background proportional-nums text-foreground antialiased">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Components — Modern React UI Library</title>
                <style>{stylesLight}</style>
                <style>{stylesDark}</style>
            </head>
            <body className="bg-ambient min-h-screen overflow-x-hidden bg-background font-sans text-foreground">
                <div id="root" className="flex min-h-screen flex-col">
                    <div id="root-floating" />
                    <ComponentsProvider locale="en-US" tweaks={tweaks} iconWeight="duotone">
                        <Notifications>
                            <div className="flex min-h-screen flex-col">
                                <Header />
                                <div className="relative flex flex-1 flex-col">
                                    {isLandingPage ? (
                                        <main className="flex-1">{props.children}</main>
                                    ) : (
                                        <div className="max-w-8xl mx-auto flex w-full px-4 sm:px-6 lg:px-8">
                                            <aside className="scrollbar-thin fixed bottom-0 top-[var(--header-height)] hidden w-64 shrink-0 overflow-y-auto border-r border-border/40 pb-10 pt-10 lg:block">
                                                <Navigation />
                                            </aside>
                                            <main className="min-w-0 flex-1 lg:pl-64">
                                                <div className="pb-24 pt-10 lg:pl-12">{props.children}</div>
                                            </main>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Notifications>
                    </ComponentsProvider>
                </div>
            </body>
        </html>
    );
};
