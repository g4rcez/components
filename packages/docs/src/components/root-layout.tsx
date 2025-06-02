import { CSSProperties, PropsWithChildren } from "react";
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
import Link from "next/link";
import { Navigation } from "./navigation";
import { Header } from "./header";

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

const sidebarVariables = {
  "--sidebar-padding": "1.5rem",
  "--sidebar-item-padding": "0.875rem",
} as CSSProperties;

export const RootLayout = (props: PropsWithChildren) => {
  const stylesLight = createTokenStyles(defaultLightTheme, tokenRemap);
  const stylesDark = createTokenStyles(defaultDarkTheme, {
    ...tokenRemap,
    name: "dark",
  });

  return (
    <html
      lang="en"
      className="bg-background text-foreground antialiased proportional-nums"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Components</title>
        <style>{stylesLight}</style>
        <style>{stylesDark}</style>
      </head>
      <body>
        <ComponentsProvider locale="pt-BR" tweaks={tweaks}>
          <Notifications>
            <div className="isolate bg-background text-foreground grid grid-template-area w-full">
              <nav
                style={sidebarVariables}
                className="sticky hidden lg:block top-0 h-screen w-64 bg-card-background [grid-area:sidebar]"
              >
                <header className="h-14 px-[var(--sidebar-padding)] flex items-center">
                  <Link href="/" className="font-bold tracking-wide text-lg">
                    UI
                  </Link>
                </header>
                <Navigation />
              </nav>
              <Header />
              <main className="[grid-area:main]">{props.children}</main>
            </div>
          </Notifications>
        </ComponentsProvider>
      </body>
    </html>
  );
};
