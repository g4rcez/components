"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CSSProperties, PropsWithChildren } from "react";
import { isSsr, Tweaks } from "../../../lib/src";
import { Notifications } from "../../../lib/src/components/display/notifications";
import { ComponentsProvider } from "../../../lib/src/hooks/use-components-provider";
import {
  createTokenStyles,
  type TokenRemap,
} from "../../../lib/src/styles/design-tokens";
import {
  defaultDarkTheme,
  defaultLightTheme,
} from "../../../lib/src/styles/theme";
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

const layoutVariables = {
  "--sidebar-width": "280px",
  "--header-height": "64px",
  "--sidebar-padding": "1.5rem",
  "--sidebar-item-padding": "0.875rem",
  "--content-max-width": "1200px",
} as CSSProperties;

export const RootLayout = (props: PropsWithChildren) => {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const stylesLight = createTokenStyles(defaultLightTheme, tokenRemap);
  const stylesDark = createTokenStyles(defaultDarkTheme, {
    ...tokenRemap,
    name: "dark",
  });

  return (
    <html
      lang="en"
      className="antialiased proportional-nums bg-background text-foreground dark"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Components</title>
        <style>{stylesLight}</style>
        <style>{stylesDark}</style>
      </head>
      <body>
        <div id="root" className="flex flex-col flex-1">
          <div id="root-floating" />
          <ComponentsProvider locale="pt-BR" tweaks={tweaks}>
            <Notifications>
              <div
                style={
                  {
                    ...layoutVariables,
                    "--sidebar-width": isLandingPage ? "0px" : "280px",
                  } as CSSProperties
                }
                className="min-h-screen isolate bg-background text-foreground"
              >
                {isLandingPage ? (
                  <div className="min-h-screen">
                    <main className="bg-linear-to-br from-background via-background to-card-background/20">
                      {props.children}
                    </main>
                  </div>
                ) : (
                  <div className="grid min-h-screen grid-rows-[var(--header-height)_1fr] lg:grid-cols-[var(--sidebar-width)_1fr] lg:grid-rows-[var(--header-height)_1fr]">
                    <nav className="hidden overflow-hidden fixed bottom-0 flex-col h-screen border-r lg:flex w-(--sidebar-width) bg-card-background/95 backdrop-blur-sm border-card-border">
                      <header className="flex items-center border-b h-(--header-height) px-(--sidebar-padding) border-card-border/50">
                        <Link
                          href="/"
                          className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/80"
                        >
                          Components
                        </Link>
                      </header>
                      <div className="overflow-y-auto overscroll-contain flex-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-card-border hover:scrollbar-thumb-card-border/80">
                        <Navigation />
                      </div>
                    </nav>
                    <div className="flex flex-col min-h-screen lg:col-start-2">
                      <Header />
                      <main className="flex-1 mt-12 bg-linear-to-br from-background via-background to-card-background/20">
                        {props.children}
                      </main>
                    </div>
                  </div>
                )}
              </div>
            </Notifications>
          </ComponentsProvider>
        </div>
      </body>
    </html>
  );
};
