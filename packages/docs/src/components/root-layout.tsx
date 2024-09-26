import { PropsWithChildren } from "react";
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
    <html className="bg-background text-foreground dark">
      <head>
        <title>Components</title>
        <style>{stylesLight}</style>
        <style>{stylesDark}</style>
      </head>
      <body>
        <Notifications max={6} duration={1000000}>{props.children}</Notifications>
      </body>
    </html>
  );
};
