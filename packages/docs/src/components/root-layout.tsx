import { PropsWithChildren } from "react";
import { ComponentsProvider } from "../../../lib/src/hooks/use-components-provider";
import { Notifications } from "../../../lib/src/components/display/notifications";
import { createTheme } from "../../../lib/src/styles/design-tokens";
import {
  defaultDarkTheme,
  defaultLightTheme,
} from "../../../lib/src/styles/theme";

export const RootLayout = (props: PropsWithChildren) => {
  const stylesLight = createTheme(defaultLightTheme);
  const stylesDark = createTheme(defaultDarkTheme, "dark");
  return (
    <html className="bg-background overflow-x-clip text-foreground antialiased proportional-nums dark">
      <head>
        <title>Components</title>
        <style>{stylesLight}</style>
        <style>{stylesDark}</style>
      </head>
      <body>
        <ComponentsProvider locale="pt-BR">
          <Notifications>{props.children}</Notifications>
        </ComponentsProvider>
      </body>
    </html>
  );
};
