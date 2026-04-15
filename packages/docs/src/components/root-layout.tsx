"use client";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { Tweaks } from "../../../lib/src";
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
      className="antialiased proportional-nums bg-background text-foreground dark scroll-smooth"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Components — Modern React UI Library</title>
        <style>{stylesLight}</style>
        <style>{stylesDark}</style>
      </head>
      <body className="font-sans min-h-screen bg-background text-foreground bg-ambient overflow-x-hidden">
        <div id="root" className="flex flex-col min-h-screen">
          <div id="root-floating" />
          <ComponentsProvider
            locale="en-US"
            tweaks={tweaks}
            iconWeight="duotone"
          >
            <Notifications>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 flex flex-col relative">
                  {isLandingPage ? (
                    <main className="flex-1">{props.children}</main>
                  ) : (
                    <div className="max-w-8xl mx-auto w-full flex px-4 sm:px-6 lg:px-8">
                      <aside className="hidden lg:block w-64 shrink-0 fixed top-[var(--header-height)] bottom-0 overflow-y-auto pt-10 pb-10 scrollbar-thin border-r border-border/40">
                        <Navigation />
                      </aside>
                      <main className="flex-1 lg:pl-64 min-w-0">
                        <div className="lg:pl-12 pt-10 pb-24">
                          {props.children}
                        </div>
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
