import { PropsWithChildren } from "react";
import { Notifications } from "../../../lib/src/components/display/notifications";
import { ComponentsProvider, type Tweaks } from "../../../lib/src/hooks/use-components-provider";
import {
  createTokenStyles,
  type TokenRemap,
} from "../../../lib/src/styles/design-tokens";
import {
  defaultDarkTheme,
  defaultLightTheme,
} from "../../../lib/src/styles/theme";

const tokenRemap: TokenRemap = {
  colors: (t) => {
    t.value = t.value.replace("hsla(", "").replace(/\)$/, "");
    return t;
  },
};

const tweaks: Tweaks = {
  input: { iconFeedback: false }
}

export const RootLayout = (props: PropsWithChildren) => {
  const stylesLight = createTokenStyles(defaultLightTheme, tokenRemap);
  const stylesDark = createTokenStyles(defaultDarkTheme, {
    ...tokenRemap,
    name: "dark",
  });

  return (
    <html lang="en" className="bg-background overflow-x-clip text-foreground antialiased proportional-nums">
      <head>
        <title>Components</title>
        <style>{stylesLight}</style>
        <style>{stylesDark}</style>
      </head>
      <body>
        <ComponentsProvider locale="pt-BR" tweaks={tweaks}>
          <Notifications>{props.children}</Notifications>
        </ComponentsProvider>
      </body>
    </html>
  );
};
